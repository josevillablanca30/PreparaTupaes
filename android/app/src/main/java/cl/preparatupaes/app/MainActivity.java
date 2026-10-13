package cl.preparatupaes.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.WebChromeClient;
import android.view.View;

public class MainActivity extends Activity {
    private WebView webView;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        webView = new WebView(this);
        webView.setBackgroundColor(0xfff9f7fd);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
        setContentView(webView);
        webView.loadUrl("file:///android_asset/inicio.html");
    }
    @Override public void onBackPressed() {
        if (webView == null) { super.onBackPressed(); return; }
        webView.evaluateJavascript(
            "(function(){try{return typeof window.cachasteNativeBack==='function' ? window.cachasteNativeBack() : false}catch(e){return false}})()",
            handled -> {
                if ("true".equals(handled)) return;
                if (webView == null) return;
                if (webView.canGoBack()) { webView.goBack(); return; }
                String url = webView.getUrl();
                if (url != null && !url.endsWith("/inicio.html")) {
                    webView.loadUrl("file:///android_asset/inicio.html");
                } else {
                    MainActivity.super.onBackPressed();
                }
            }
        );
    }
    @Override protected void onDestroy() {
        if (webView != null) { webView.destroy(); webView = null; }
        super.onDestroy();
    }
}
