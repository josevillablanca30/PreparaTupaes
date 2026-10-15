package cl.preparatupaes.app;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.view.KeyEvent;
import android.view.ViewGroup;
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

/** Runs against an installed APK and its actual Android WebView, without a server. */
public class OfflineAppTest {
    private ActivityScenario<MainActivity> scenario;
    private WebView web(MainActivity activity) {
        return (WebView)((ViewGroup)activity.findViewById(android.R.id.content)).getChildAt(0);
    }
    private String js(String script) throws Exception {
        AtomicReference<String> answer = new AtomicReference<>();
        CountDownLatch latch = new CountDownLatch(1);
        scenario.onActivity(activity -> web(activity).evaluateJavascript(script, value -> {answer.set(value);latch.countDown();}));
        assertTrue("WebView did not answer JavaScript", latch.await(10, TimeUnit.SECONDS));
        return answer.get();
    }
    private void waitFor(String expression) throws Exception {
        for (int n=0;n<150;n++) {
            if ("true".equals(js("Boolean("+expression+")"))) return;
            Thread.sleep(100);
        }
        fail("WebView condition timed out: "+expression);
    }
    private void open(String page, String ready) throws Exception {
        scenario.onActivity(activity -> web(activity).loadUrl("file:///android_asset/"+page));
        waitFor("location.pathname.endsWith('/"+page+"') && document.readyState==='complete' && ("+ready+")");
    }
    @Before public void launch() {scenario=ActivityScenario.launch(MainActivity.class);}
    @After public void close() {if(scenario!=null)scenario.close();}

    @Test public void allFiveSubjectsStartOffline() throws Exception {
        open("inicio.html", "document.querySelectorAll('a.subject').length>=5");
        open("index.html", "typeof start==='function' && document.querySelector('h1')");
        open("science.html", "Array.isArray(window.SCIENCE_BANK) && document.querySelector('h1')");
        assertEquals("206",js("window.SCIENCE_BANK.length"));
        open("reading.html", "Array.isArray(window.READING_QUESTIONS) && document.querySelector('h1')");
        assertEquals("130",js("window.READING_QUESTIONS.length"));
        open("m2.html", "document.getElementById('diagnostic')");
        assertEquals("106",js("window.CACHASTE_M2.length"));
        open("history.html", "document.getElementById('diagnostic')");
        assertEquals("65",js("window.CACHASTE_HISTORIA.length"));
    }
    @Test public void draftSurvivesActivityRecreationAndNativeBack() throws Exception {
        open("index.html", "typeof start==='function'");
        js("start('diagnostico30');choice=1;confidence='azar';draw();true");
        String draft=js("localStorage.getItem('cachaste-m1-diagnostic-draft-v1')");
        assertNotEquals("null",draft);
        scenario.recreate();
        waitFor("typeof resumeMathDiagnosis==='function' && document.readyState==='complete'");
        assertEquals(draft,js("localStorage.getItem('cachaste-m1-diagnostic-draft-v1')"));
        assertEquals("true",js("resumeMathDiagnosis();choice===1 && confidence==='azar' && queue.length===30"));
        InstrumentationRegistry.getInstrumentation().sendKeyDownUpSync(KeyEvent.KEYCODE_BACK);
        waitFor("document.querySelector('h1') && document.querySelector('h1').textContent.includes('Aprende primero')");
        assertNotEquals("null",js("localStorage.getItem('cachaste-m1-diagnostic-draft-v1')"));
    }
    @Test public void noInternetOrStoragePermissionIsRequested() throws Exception {
        android.content.Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
        PackageInfo info=context.getPackageManager().getPackageInfo(context.getPackageName(),PackageManager.GET_PERMISSIONS);
        assertTrue(info.requestedPermissions==null || info.requestedPermissions.length==0);
    }
}
