package cl.preparatupaes.app;

import android.webkit.WebView;
import android.os.ParcelFileDescriptor;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import androidx.test.core.app.ActivityScenario;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Installed beta only: plays both turns using the real bank and the actual WebView. */
public class LocalVsBetaTest {
    private ActivityScenario<MainActivity> scenario;
    private WebView web(MainActivity activity){return (WebView)activity.findViewById(android.R.id.content).findViewWithTag("cachaste-web");}
    private String js(String script) throws Exception {
        AtomicReference<String> result=new AtomicReference<>();CountDownLatch latch=new CountDownLatch(1);
        scenario.onActivity(a->web(a).evaluateJavascript(script,value->{result.set(value);latch.countDown();}));
        assertTrue(latch.await(10,TimeUnit.SECONDS));return result.get();
    }
    private void waitFor(String script) throws Exception {
        for(int n=0;n<150;n++){if("true".equals(js("Boolean("+script+")")))return;Thread.sleep(100);}
        fail("Beta WebView did not reach: "+script);
    }
    private String deviceCommand(String command) throws Exception {
        try(BufferedReader output=new BufferedReader(new InputStreamReader(new ParcelFileDescriptor.AutoCloseInputStream(
                InstrumentationRegistry.getInstrumentation().getUiAutomation().executeShellCommand(command))))) {
            StringBuilder result=new StringBuilder();
            String line;
            while((line=output.readLine())!=null)result.append(line).append('\n');
            return result.toString().trim();
        }
    }
    private void capture(String name) throws Exception {
        InstrumentationRegistry.getInstrumentation().waitForIdleSync();
        Thread.sleep(1200);
        // VisualStateCallback makes the DOM available for the NEXT draw, not the frame already on screen.
        // Wait for actual render commits: animation callbacks alone allowed screencap to export the previous route.
        for(int frame=0;frame<2;frame++) {
            CountDownLatch painted=new CountDownLatch(1);
            scenario.onActivity(activity -> {
                WebView view=web(activity);
                view.postVisualStateCallback(System.nanoTime(),new WebView.VisualStateCallback() {
                    @Override public void onComplete(long requestId) {
                        if(android.os.Build.VERSION.SDK_INT>=29 && view.isHardwareAccelerated()) {
                            view.getViewTreeObserver().registerFrameCommitCallback(painted::countDown);
                            view.invalidate();
                            ((android.view.View)view.getParent()).invalidate();
                        } else {
                            view.invalidate();
                            view.postOnAnimation(() -> view.postOnAnimation(painted::countDown));
                        }
                    }
                });
            });
            assertTrue("WebView did not commit the current screen",painted.await(10,TimeUnit.SECONDS));
        }
        Thread.sleep(300);
        // Keep native captures outside app data, which Gradle clears after testing.
        String path="/data/local/tmp/cachaste-didactic-screens/"+name+".png";
        // UiAutomation starts one process per call; it does not interpret shell operators.
        deviceCommand("mkdir -p /data/local/tmp/cachaste-didactic-screens");
        deviceCommand("screencap -p "+path);
        assertTrue("Native screenshot export failed",deviceCommand("stat -c %s "+path).matches("[1-9][0-9]*"));
    }
    @Test public void localVsEntryPlaysBothTurnsOfflineAndRestoresHandoff() throws Exception {
        scenario=ActivityScenario.launch(MainActivity.class);
        try {
            assertEquals("cl.preparatupaes.app.sciencebeta",InstrumentationRegistry.getInstrumentation().getTargetContext().getPackageName());
            scenario.onActivity(a->web(a).loadUrl("https://appassets.androidplatform.net/assets/competencia.html#duelos"));
            waitFor("document.querySelector('.beta-entry a')");js("document.querySelector('.beta-entry a').click()");
            waitFor("document.getElementById('beta-setup')");
            js("document.querySelector('[name=player0]').value='Prueba_A';document.querySelector('[name=player1]').value='Prueba_B';document.getElementById('beta-setup').requestSubmit()");
            waitFor("document.querySelector('.versus-players')");capture("beta-local-vs");
            js("document.querySelector('[data-action=begin]').click()");
            for(int p=0;p<2;p++){
                for(int i=0;i<10;i++){
                    waitFor("document.getElementById('beta-answer')");
                    assertEquals("true",js("document.querySelector('.question-meta strong').textContent.includes('"+(i+1)+"/10') && !document.querySelector('.beta-review-card')"));
                    js("var s=JSON.parse(localStorage.getItem('cachaste-beta-vs:v1')),q=CACHASTE_DAILY_CATALOG.items.find(q=>q.key===s.keys["+i+"]);document.querySelectorAll('[name=choice]')["+(p==0?"q.answer":"(q.answer+1)%q.options.length")+"].checked=true;document.getElementById('beta-answer').requestSubmit()");
                }
                if(p==0){
                    waitFor("document.body.textContent.includes('¡Primer turno listo!')");
                    assertEquals("true",js("!document.querySelector('.result-score') && !document.querySelector('.beta-review-card')"));
                    scenario.recreate();waitFor("document.body.textContent.includes('¡Primer turno listo!')");
                    js("document.querySelector('[data-action=begin]').click()");
                }
            }
            waitFor("document.querySelector('.result-score')");
            assertEquals("true",js("document.body.textContent.includes('Ganó Prueba_A') && document.querySelectorAll('.result-players b')[0].textContent.includes('10')"));
            capture("beta-local-result");js("document.querySelector('[data-action=review]').click()");waitFor("document.querySelectorAll('.beta-review-card').length===10");capture("beta-local-review");
            js("window.cachasteNativeBack()");waitFor("document.querySelector('.result-score')");
            assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth+1"));
        } finally {if(scenario!=null)scenario.close();}
    }
}
