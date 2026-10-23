package cl.preparatupaes.app;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.SystemClock;
import android.provider.Settings;
import android.webkit.WebView;
import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Only a direct authenticated HTTPS server response can create an educational access lease. */
final class SubscriptionAccessController {
    private static final String ORIGIN="https://appassets.androidplatform.net";
    private static final String API="https://jmobinmdwrmdqrxtcruj.supabase.co/rest/v1/rpc/cachaste_access";
    private static final String PUBLIC_KEY="sb_publishable_wf2Ji381IwRo2exQKJQ7ew_SRYCl_q1";
    private final Activity activity;
    private final WebView web;
    private final SharedPreferences prefs;
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private long generation;
    private boolean closed;
    SubscriptionAccessController(Activity activity,WebView web){
        this.activity=activity;this.web=web;this.prefs=activity.getSharedPreferences("cachaste-subscription-lease",Activity.MODE_PRIVATE);
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"CachasteAccess",Collections.singleton(ORIGIN),(view,message,origin,mainFrame,reply)->{
                if(!mainFrame||!ORIGIN.equals(origin.toString())||!trustedPage()||closed)return;
                try{
                    if(message.getType()!=WebMessageCompat.TYPE_STRING||message.getData()==null||message.getData().length()>10000)return;
                    JSONObject request=new JSONObject(message.getData());String id=request.optString("id"),action=request.optString("action");
                    if(!id.matches("[a-zA-Z0-9-]{1,80}"))return;
                    if(action.equals("clear")){clear();respond(reply,id,null,false);return;}
                    if(!action.equals("verify"))return;
                    if(!activity.getPackageName().equals("cl.preparatupaes.app")){respond(reply,id,null,false);return;}
                    String token=request.optString("token");
                    String expectedUser=request.optString("userId");
                    if(!token.matches("[a-zA-Z0-9_.-]{50,8000}")||!expectedUser.matches("[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}")){respond(reply,id,"AUTH_REQUIRED",false);return;}
                    // A second account or a logout invalidates any in-flight response from the first.
                    if(!expectedUser.equals(prefs.getString("user","")))clear();else generation++;
                    long epoch=generation;
                    worker.execute(()->verify(token,expectedUser,reply,id,epoch));
                }catch(Exception ignored){ /* Never log credentials or grant access for malformed messages. */ }
            });
        }
    }
    private boolean trustedPage(){
        String url=web.getUrl();if(url==null)return false;String path=url.split("[?#]",2)[0];
        return path.equals(ORIGIN+"/assets/competencia.html")||path.equals(ORIGIN+"/assets/suscripcion.html");
    }
    private int boot(){try{return Settings.Global.getInt(activity.getContentResolver(),Settings.Global.BOOT_COUNT,-1);}catch(Exception ignored){return -1;}}
    boolean hasAccess(){
        SubscriptionLease lease=new SubscriptionLease(prefs.getString("user",""),prefs.getLong("issued",0),prefs.getLong("deadline",0),prefs.getInt("boot",-1));
        return lease.valid(SystemClock.elapsedRealtime(),boot());
    }
    private void clear(){generation++;prefs.edit().clear().apply();}
    private void respond(JavaScriptReplyProxy reply,String id,String error,boolean active){
        if(closed||!trustedPage())return;
        try{JSONObject response=new JSONObject();response.put("id",id);response.put("required",activity.getPackageName().equals("cl.preparatupaes.app"));response.put("active",active);response.put("error",error==null?JSONObject.NULL:error);reply.postMessage(response.toString());}catch(Exception ignored){}
    }
    private void verify(String token,String expectedUser,JavaScriptReplyProxy reply,String id,long epoch){
        HttpURLConnection connection=null;JSONObject result=null;String error=null;long started=SystemClock.elapsedRealtime();
        try{
            connection=(HttpURLConnection)new URL(API).openConnection();
            connection.setRequestMethod("POST");connection.setConnectTimeout(8000);connection.setReadTimeout(8000);connection.setInstanceFollowRedirects(false);connection.setDoOutput(true);
            connection.setRequestProperty("Authorization","Bearer "+token);connection.setRequestProperty("apikey",PUBLIC_KEY);connection.setRequestProperty("Content-Type","application/json");connection.setRequestProperty("Accept","application/json");
            try(java.io.OutputStream out=connection.getOutputStream()){out.write("{}".getBytes(StandardCharsets.UTF_8));}
            int status=connection.getResponseCode();
            if(status==401||status==403){error="AUTH_REQUIRED";throw new Exception("AUTH_REQUIRED");}
            if(status!=200)throw new Exception("ACCESS_UNAVAILABLE");
            try(java.io.InputStream in=connection.getInputStream();ByteArrayOutputStream out=new ByteArrayOutputStream()){
                byte[] buffer=new byte[1024];int read;
                while((read=in.read(buffer))!=-1){if(out.size()+read>8192)throw new Exception("ACCESS_UNAVAILABLE");out.write(buffer,0,read);}
                result=new JSONObject(out.toString("UTF-8"));
            }
        }catch(Exception ignored){if(error==null)error="ACCESS_UNAVAILABLE";}
        finally{if(connection!=null)connection.disconnect();}
        final JSONObject data=result;final String failure=error;final long received=SystemClock.elapsedRealtime();
        activity.runOnUiThread(()->{
            if(closed||epoch!=generation)return;
            boolean active=false;String outcome=failure;
            if("AUTH_REQUIRED".equals(failure))clear();
            try{
                if(data!=null&&!expectedUser.equals(data.getString("userId"))){clear();throw new Exception("AUTH_REQUIRED");}
                if(data!=null&&data.getBoolean("active")){
                    SubscriptionLease lease=SubscriptionLease.fromServer(data.getString("userId"),data.getLong("serverTimeMs"),data.getLong("validUntilMs"),started,received,boot());
                    if(lease.valid(SystemClock.elapsedRealtime(),boot())){
                        prefs.edit().putString("user",lease.user).putLong("issued",lease.issued).putLong("deadline",lease.deadline).putInt("boot",lease.boot).apply();active=true;
                    }else outcome="ACCESS_UNAVAILABLE";
                }else if(data!=null)clear();
            }catch(Exception ignored){outcome="ACCESS_UNAVAILABLE";}
            respond(reply,id,outcome,active);
        });
    }
    void close(){closed=true;generation++;worker.shutdownNow();}
}
