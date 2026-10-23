package cl.preparatupaes.app;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.view.WindowInsets;
import android.widget.FrameLayout;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import androidx.webkit.WebViewAssetLoader;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.WebChromeClient;

/** Offline application. Student data stays in WebView DOM storage on this device. */
public class MainActivity extends Activity {
    private static final String HOME = "file:///android_asset/inicio.html";
    private static final String ASSETS = "https://appassets.androidplatform.net/assets/";
    private static final String COMPETITION = ASSETS + "competencia.html";
    private static final String SUBSCRIPTION = ASSETS + "suscripcion.html";
    private static final String PREFS = "cachaste-navigation";
    private WebView webView;
    private PlayBillingController playBilling;

    private boolean isApplicationPage(String url) {
        if (url == null) return false;
        String path = url.split("[?#]", 2)[0];
        return path.equals(COMPETITION) || path.equals(SUBSCRIPTION) || path.equals(HOME) || path.equals("file:///android_asset/index.html")
            || path.equals("file:///android_asset/science.html")
            || path.equals("file:///android_asset/reading.html")
            || path.equals("file:///android_asset/m2.html")
            || path.equals("file:///android_asset/history.html")
            || path.equals("file:///android_asset/suscripcion.html");
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        webView = new WebView(this);
        webView.setTag("cachaste-web");
        playBilling = new PlayBillingController(this,webView);
        webView.setBackgroundColor(0xfffaf9fe);
        WebView.setWebContentsDebuggingEnabled((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setTextZoom(Math.max(100, Math.min(200, Math.round(getResources().getConfiguration().fontScale * 100))));
        // Online competition gets a secure origin; offline pages keep their original origin and saved progress.
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("file:///android_asset/competencia.html")) {
                    view.loadUrl(COMPETITION + (request.getUrl().getFragment() == null ? "" : "#" + request.getUrl().getFragment()));
                    return true;
                }
                if (url.startsWith("file:///android_asset/suscripcion.html")) { view.loadUrl(SUBSCRIPTION); return true; }
                if (url.startsWith(ASSETS) && !isApplicationPage(url)) {
                    String local = "file:///android_asset/" + url.substring(ASSETS.length());
                    if (isApplicationPage(local)) view.loadUrl(local);
                    return true;
                }
                if (isApplicationPage(url)) return false;
                if ("https".equals(request.getUrl().getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); }
                    catch (android.content.ActivityNotFoundException ignored) { }
                }
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) {
                if (isApplicationPage(url)) getSharedPreferences(PREFS, MODE_PRIVATE).edit().putString("last-page", url).apply();
            }
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                getSharedPreferences(PREFS, MODE_PRIVATE).edit().putString("last-page", HOME).apply();
                if (webView != null) { webView.destroy(); webView = null; }
                recreate();
                return true;
            }
        });
        webView.setWebChromeClient(new WebChromeClient());
        // Inset the viewport itself: WebView padding still lets scrolled content draw under bars.
        FrameLayout viewport = new FrameLayout(this);
        viewport.addView(webView,new FrameLayout.LayoutParams(-1,-1));
        viewport.setBackgroundColor(0xfffaf9fe);
        viewport.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                view.setPadding(bars.left,bars.top,bars.right,bars.bottom);
                return WindowInsets.CONSUMED;
            }
            view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),
                insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        setContentView(viewport);
        viewport.requestApplyInsets();
        String last = state != null ? state.getString("last-page") : getSharedPreferences(PREFS, MODE_PRIVATE).getString("last-page", HOME);
        if (isApplicationPage(last)) webView.loadUrl(last);
        else webView.loadUrl("file:///android_asset/inicio.html");
    }

    @Override protected void onSaveInstanceState(Bundle state) {
        if (webView != null && isApplicationPage(webView.getUrl())) state.putString("last-page", webView.getUrl());
        super.onSaveInstanceState(state);
    }
    @Override protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
            // Every answer is saved synchronously; rendering checks the absolute exam deadline.
            webView.evaluateJavascript("document.dispatchEvent(new Event('visibilitychange'))", null);
        }
    }
    @Override public void onBackPressed() {
        if (webView == null) { super.onBackPressed(); return; }
        webView.evaluateJavascript(
            "(function(){try{return typeof window.cachasteNativeBack==='function' ? window.cachasteNativeBack() : false}catch(e){return false}})()",
            handled -> {
                if ("true".equals(handled) || webView == null) return;
                if (webView.canGoBack()) { webView.goBack(); return; }
                String url = webView.getUrl();
                if (url != null && !url.endsWith("/inicio.html")) webView.loadUrl(HOME);
                else MainActivity.super.onBackPressed();
            }
        );
    }
    @Override protected void onDestroy() {
        if (playBilling != null) { playBilling.close(); playBilling = null; }
        if (webView != null) { webView.stopLoading(); webView.destroy(); webView = null; }
        super.onDestroy();
    }
}
