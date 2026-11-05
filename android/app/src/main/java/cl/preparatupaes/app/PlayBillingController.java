package cl.preparatupaes.app;

import android.app.Activity;
import android.net.Uri;
import android.webkit.WebView;
import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import com.android.billingclient.api.*;
import org.json.JSONArray;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Collections;
import java.util.List;

/** Google Play transports receipts; only the authenticated server can grant access. */
final class PlayBillingController {
    static final String PAGE="https://appassets.androidplatform.net/assets/suscripcion.html";
    private static final String PRODUCT="cachaste_premium";
    private final Activity activity;
    private final WebView web;
    private BillingClient billing;
    private JavaScriptReplyProxy purchaseReply;
    private String purchaseRequest;
    private boolean connecting;

    PlayBillingController(Activity activity,WebView web) {
        this.activity=activity;this.web=web;
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(web,"CachastePlay",Collections.singleton("https://appassets.androidplatform.net"),(view,message,origin,mainFrame,reply)->{
                if(!mainFrame||!"https://appassets.androidplatform.net".equals(origin.toString())||!trustedPage())return;
                try {
                    if(message.getType()!=WebMessageCompat.TYPE_STRING||message.getData()==null||message.getData().length()>4096)return;
                    JSONObject request=new JSONObject(message.getData());String id=request.optString("id"),action=request.optString("action");
                    if(!id.matches("[a-zA-Z0-9-]{1,80}"))return;
                    if(!enabled()){respond(reply,id,"BILLING_NOT_CONFIGURED",null);return;}
                    if(!action.equals("offers")&&!action.equals("restore")&&!action.equals("purchase")){respond(reply,id,"INVALID_REQUEST",null);return;}
                    ready(reply,id,()->{
                        if(action.equals("restore"))restore(reply,id);
                        else if(action.equals("offers"))offers(reply,id,null,null);
                        else {
                            String user=request.optString("userId"),offer=request.optString("offer");
                            if(!user.matches("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")||offer.length()>100){respond(reply,id,"INVALID_REQUEST",null);return;}
                            offers(reply,id,user,offer);
                        }
                    });
                } catch(Exception ignored) { /* Malformed or cross-origin messages never invoke billing. */ }
            });
        }
    }
    private boolean trustedPage(){String url=web.getUrl();return url!=null&&PAGE.equals(url.split("[?#]",2)[0]);}
    private boolean enabled(){return BuildConfig.CACHASTE_PLAY_ENABLED&&activity.getPackageName().equals("cl.preparatupaes.app");}
    private void respond(JavaScriptReplyProxy reply,String id,String error,Object data){
        activity.runOnUiThread(()->{if(!trustedPage())return;try{JSONObject r=new JSONObject();r.put("id",id);r.put("error",error==null?JSONObject.NULL:error);r.put("data",data==null?JSONObject.NULL:data);reply.postMessage(r.toString());}catch(Exception ignored){}});
    }
    private void ready(JavaScriptReplyProxy reply,String id,Runnable action){
        if(billing==null)billing=BillingClient.newBuilder(activity).setListener((result,purchases)->{
            JavaScriptReplyProxy target=purchaseReply;String request=purchaseRequest;purchaseReply=null;purchaseRequest=null;
            if(target!=null)deliverPurchases(target,request,result,purchases);
        }).enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()).enableAutoServiceReconnection().build();
        if(billing.isReady()){action.run();return;}
        if(connecting){respond(reply,id,"RETRY",null);return;}connecting=true;
        billing.startConnection(new BillingClientStateListener(){
            @Override public void onBillingSetupFinished(BillingResult result){connecting=false;if(result.getResponseCode()==BillingClient.BillingResponseCode.OK)action.run();else respond(reply,id,"STORE_UNAVAILABLE",null);}
            @Override public void onBillingServiceDisconnected(){connecting=false;}
        });
    }
    private void restore(JavaScriptReplyProxy reply,String id){
        billing.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(),(result,purchases)->deliverPurchases(reply,id,result,purchases));
    }
    private void deliverPurchases(JavaScriptReplyProxy reply,String id,BillingResult result,List<Purchase> purchases){
        if(result.getResponseCode()!=BillingClient.BillingResponseCode.OK){respond(reply,id,result.getResponseCode()==BillingClient.BillingResponseCode.USER_CANCELED?"USER_CANCELED":"STORE_UNAVAILABLE",null);return;}
        JSONArray rows=new JSONArray();boolean pending=false;
        if(purchases!=null)for(Purchase purchase:purchases)if(purchase.getProducts().contains(PRODUCT)){
            if(purchase.getPurchaseState()==Purchase.PurchaseState.PURCHASED){JSONObject row=new JSONObject();try{row.put("purchaseToken",purchase.getPurchaseToken());rows.put(row);}catch(Exception ignored){}}
            else if(purchase.getPurchaseState()==Purchase.PurchaseState.PENDING)pending=true;
        }
        JSONObject data=new JSONObject();try{data.put("purchases",rows);data.put("pending",pending);}catch(Exception ignored){}respond(reply,id,null,data);
    }
    private boolean approvedOffer(ProductDetails.SubscriptionOfferDetails offer){
        List<ProductDetails.PricingPhase> phases=offer.getPricingPhases().getPricingPhaseList();if(phases.isEmpty())return false;
        ProductDetails.PricingPhase last=phases.get(phases.size()-1);
        long price;String period;
        switch(offer.getBasePlanId()){
            case "semanal":price=2490L;period="P1W";break;
            case "mensual":price=7990L;period="P1M";break;
            case "anual":price=64990L;period="P1Y";break;
            default:return false;
        }
        if(!last.getPriceCurrencyCode().equals("CLP")||last.getPriceAmountMicros()!=price*1000000L||!last.getBillingPeriod().equals(period)||last.getRecurrenceMode()!=ProductDetails.RecurrenceMode.INFINITE_RECURRING)return false;
        return phases.size()==1||(phases.size()==2&&offer.getBasePlanId().equals("mensual")&&phases.get(0).getPriceAmountMicros()==0&&phases.get(0).getBillingPeriod().equals("P7D")&&phases.get(0).getBillingCycleCount()==1);
    }
    private void offers(JavaScriptReplyProxy reply,String id,String userId,String selected){
        QueryProductDetailsParams.Product product=QueryProductDetailsParams.Product.newBuilder().setProductId(PRODUCT).setProductType(BillingClient.ProductType.SUBS).build();
        billing.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(Collections.singletonList(product)).build(),(result,details)->{
            if(result.getResponseCode()!=BillingClient.BillingResponseCode.OK){respond(reply,id,"STORE_UNAVAILABLE",null);return;}
            JSONArray rows=new JSONArray();
            for(ProductDetails d:details.getProductDetailsList())if(d.getProductId().equals(PRODUCT)&&d.getSubscriptionOfferDetails()!=null)for(ProductDetails.SubscriptionOfferDetails offer:d.getSubscriptionOfferDetails())if(approvedOffer(offer)){
                String offerKey=offer.getBasePlanId()+":"+(offer.getOfferId()==null?"":offer.getOfferId());
                if(userId!=null&&offerKey.equals(selected)){
                    if(purchaseReply!=null){respond(reply,id,"PURCHASE_IN_PROGRESS",null);return;}
                    try {
                        StringBuilder hash=new StringBuilder();for(byte b:MessageDigest.getInstance("SHA-256").digest(("cachaste:"+userId.toLowerCase(java.util.Locale.ROOT)).getBytes(StandardCharsets.UTF_8)))hash.append(String.format(java.util.Locale.ROOT,"%02x",b&255));
                        BillingFlowParams.ProductDetailsParams item=BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(d).setOfferToken(offer.getOfferToken()).build();
                        purchaseReply=reply;purchaseRequest=id;
                        BillingResult launched=billing.launchBillingFlow(activity,BillingFlowParams.newBuilder().setProductDetailsParamsList(Collections.singletonList(item)).setObfuscatedAccountId(hash.toString()).build());
                        if(launched.getResponseCode()!=BillingClient.BillingResponseCode.OK){purchaseReply=null;purchaseRequest=null;respond(reply,id,"STORE_UNAVAILABLE",null);}
                    }catch(Exception ignored){purchaseReply=null;purchaseRequest=null;respond(reply,id,"STORE_UNAVAILABLE",null);}return;
                }
                try{
                    JSONObject row=new JSONObject();JSONArray phases=new JSONArray();row.put("id",offerKey);row.put("basePlan",offer.getBasePlanId());
                    for(ProductDetails.PricingPhase phase:offer.getPricingPhases().getPricingPhaseList()){JSONObject p=new JSONObject();p.put("price",phase.getFormattedPrice());p.put("micros",phase.getPriceAmountMicros());p.put("currency",phase.getPriceCurrencyCode());p.put("period",phase.getBillingPeriod());p.put("cycles",phase.getBillingCycleCount());phases.put(p);}row.put("phases",phases);rows.put(row);
                }catch(Exception ignored){}
            }
            if(userId!=null)respond(reply,id,"OFFER_UNAVAILABLE",null);else respond(reply,id,null,rows);
        });
    }
    void close(){if(billing!=null){billing.endConnection();billing=null;}purchaseReply=null;purchaseRequest=null;}
}
