package cl.preparatupaes.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.SystemClock;
import android.provider.Settings;
import android.webkit.WebView;
import androidx.test.core.app.ActivityScenario;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Isolated emulator-only package build. No server user, receipt or entitlement is created. */
public class CommercialAccessTest {
    private ActivityScenario<MainActivity> scenario;
    private SharedPreferences prefs;
    private WebView web(MainActivity activity){return activity.findViewById(android.R.id.content).findViewWithTag("cachaste-web");}
    private String js(String script)throws Exception{
        AtomicReference<String> value=new AtomicReference<>();CountDownLatch latch=new CountDownLatch(1);
        scenario.onActivity(activity->web(activity).evaluateJavascript(script,result->{value.set(result);latch.countDown();}));
        assertTrue(latch.await(10,TimeUnit.SECONDS));return value.get();
    }
    private void waitFor(String expression)throws Exception{
        for(int n=0;n<100;n++){if("true".equals(js("Boolean("+expression+")")))return;Thread.sleep(100);}
        fail("Expected commercial access state: "+expression);
    }
    private void open(String page){scenario.onActivity(activity->web(activity).loadUrl(page));}
    private void locked()throws Exception{waitFor("location.pathname.endsWith('/suscripcion.html')&&document.getElementById('billing-status')");}
    @Before public void start()throws Exception{
        Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("cl.preparatupaes.app",context.getPackageName());
        prefs=context.getSharedPreferences("cachaste-subscription-lease",Context.MODE_PRIVATE);prefs.edit().clear().commit();
        scenario=ActivityScenario.launch(MainActivity.class);locked();
    }
    @After public void stop(){if(scenario!=null)scenario.close();if(prefs!=null)prefs.edit().clear().commit();}
    @Test public void startupAndEveryEducationalRouteStayClosedWithoutServerAccess()throws Exception{
        js("localStorage.setItem('premium','true');localStorage.setItem('subscription','active');true");
        for(String page:new String[]{"inicio","index","science","reading","m2","history"}){
            open("file:///android_asset/"+page+".html#lesson");locked();
            open("https://appassets.androidplatform.net/assets/"+page+".html");locked();
        }
        assertFalse(prefs.contains("deadline"));
    }
    @Test public void profileAndRestorationRemainAccessibleWithoutASubscription()throws Exception{
        open("https://appassets.androidplatform.net/assets/competencia.html#perfil");
        waitFor("location.hash==='#perfil'&&document.getElementById('auth-form')");
        open("https://appassets.androidplatform.net/assets/suscripcion.html");locked();
    }
    @Test public void clientMessagesCannotInventAServerLease()throws Exception{
        waitFor("window.CachasteAccess");
        js("window.accessReply=null;CachasteAccess.onmessage=e=>window.accessReply=JSON.parse(e.data);CachasteAccess.postMessage(JSON.stringify({id:'forged-access',action:'verify',userId:'10000000-0000-4000-8000-000000000001',token:'forged',active:true,validUntilMs:9999999999999}));true");
        waitFor("window.accessReply&&accessReply.error==='AUTH_REQUIRED'");assertFalse(prefs.contains("deadline"));
        open("file:///android_asset/index.html");locked();
    }
    @Test public void androidBackCanExitTheLockedSubscriptionScreen()throws Exception{
        scenario.onActivity(MainActivity::onBackPressed);
        for(int n=0;n<100&&!scenario.getState().toString().equals("DESTROYED");n++)Thread.sleep(50);
        assertEquals("DESTROYED",scenario.getState().toString());
    }
    @Test public void offlineLeaseSurvivesActivityRecreationButExpiryAndSignoutCloseAccess()throws Exception{
        Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
        int boot=Settings.Global.getInt(context.getContentResolver(),Settings.Global.BOOT_COUNT,-1);assertTrue(boot>=0);
        long elapsed=SystemClock.elapsedRealtime();
        // Only this instrumentation APK writes a fixture lease into its disposable emulator.
        prefs.edit().putString("user","10000000-0000-4000-8000-000000000001").putLong("issued",elapsed).putLong("deadline",elapsed+60000).putInt("boot",boot).commit();
        open("file:///android_asset/inicio.html");waitFor("location.pathname.endsWith('/inicio.html')&&document.querySelector('main')");
        scenario.recreate();waitFor("location.pathname.endsWith('/inicio.html')&&document.querySelector('main')");
        prefs.edit().putLong("deadline",SystemClock.elapsedRealtime()-1).commit();
        open("file:///android_asset/m2.html");locked();
        elapsed=SystemClock.elapsedRealtime();prefs.edit().putLong("issued",elapsed).putLong("deadline",elapsed+60000).commit();
        waitFor("window.CachasteAccess");js("CachasteAccess.postMessage(JSON.stringify({id:'logout',action:'clear'}));true");
        for(int n=0;n<100&&prefs.contains("deadline");n++)Thread.sleep(50);
        assertFalse(prefs.contains("deadline"));open("file:///android_asset/history.html");locked();
    }
}
