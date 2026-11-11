package cl.preparatupaes.app;

import android.webkit.WebView;
import androidx.test.core.app.ActivityScenario;
import androidx.test.platform.app.InstrumentationRegistry;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Actual installed WebView, original assets, offline content, no production writes. */
public class Work3LegibilityTest {
    private ActivityScenario<MainActivity> scenario;
    private String js(String script) throws Exception {
        AtomicReference<String> result=new AtomicReference<>();
        CountDownLatch done=new CountDownLatch(1);
        NativeWebViewActions.onActivity(scenario,a -> {
            WebView w=(WebView)a.findViewById(android.R.id.content).findViewWithTag("cachaste-web");
            w.evaluateJavascript(script,value -> {result.set(value);done.countDown();});
        });
        assertTrue("Installed WebView did not respond",done.await(10,TimeUnit.SECONDS));
        return result.get();
    }
    private void ready(String expression) throws Exception {
        for(int i=0;i<150;i++){if("true".equals(js("Boolean("+expression+")")))return;Thread.sleep(100);}
        fail("Installed WebView not ready: "+expression);
    }
    private void audit(String probe,String state) throws Exception {
        String selectors=".reference-speech,.didactic-overview *,.reference-easy-card *,.reference-example-card *,.tutor *,.wise-cat p,.answer-feedback,.selected-repair *,.confidence-guide *,.daily-options button,.question-title,.lesson-chapters button";
        JSONArray rows=new JSONArray(js(probe+"("+JSONObject.quote(selectors)+")"));
        assertTrue(state+" must measure real educational text",rows.length()>10);
        for(int i=0;i<rows.length();i++){
            JSONObject row=rows.getJSONObject(i);
            assertTrue(state+" "+row.toString(),row.getBoolean("passed"));
        }
        assertEquals(state+" horizontal overflow","true",js("document.documentElement.scrollWidth<=innerWidth+1"));
        android.util.Log.i("CachasteQa","Work3 "+state+": "+rows.length()+" text nodes passed AA");
    }
    @Test public void fiveSubjectsAndScienceTracksKeepContrastAfterRecreation() throws Exception {
        String probe;
        try(java.io.InputStream in=InstrumentationRegistry.getInstrumentation().getContext().getAssets().open("work3-contrast.js")){
            probe=new String(in.readAllBytes(),StandardCharsets.UTF_8);
        }
        scenario=ActivityScenario.launch(MainActivity.class);
        try{
            NativeWebViewActions.onActivity(scenario,a -> ((WebView)a.findViewById(android.R.id.content).findViewWithTag("cachaste-web")).loadUrl("file:///android_asset/inicio.html"));
            ready("window.CachasteDailyApp && document.readyState==='complete'");
            for(String[] spec:new String[][]{{"M1",""},{"M2",""},{"Lectura",""},{"Historia",""},{"Ciencias","Biología"},{"Ciencias","Física"},{"Ciencias","Química"},{"Ciencias","TP"}}){
                String subject=JSONObject.quote(spec[0]),track=spec[1].isEmpty()?"null":JSONObject.quote(spec[1]);
                js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.track="+track+";var pool=CachasteCurriculum.sciencePool(CACHASTE_DAILY_CATALOG.items,e.state.track);var q=pool.find(q=>q.subjectKey==="+subject+"&&(!e.state.track||e.state.track==='TP'||q.subject===e.state.track));e.start("+subject+",2,'lesson',q.concept);location.hash='#session';CachasteDailyApp.render();true");
                ready("document.querySelector('.didactic-overview')");audit(probe,spec[0]+spec[1]+" lesson");
                js("document.querySelector('[data-action=begin-question]').click();true");
                ready("document.querySelector('.question-title')");audit(probe,spec[0]+" question");
                js("var e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[0]);document.querySelector('[data-action=choice][data-index=\"'+((q.answer+1)%q.options.length)+'\"]').click();document.querySelector('[data-action=check]').click();true");
                ready("document.querySelector('.tutor')");audit(probe,spec[0]+" checked");
                String draft=js("localStorage.getItem('cachaste-daily-v1')");
                scenario.recreate();ready("window.CachasteDailyApp && document.querySelector('.tutor')");
                assertEquals("Draft survives activity recreation",draft,js("localStorage.getItem('cachaste-daily-v1')"));
                audit(probe,spec[0]+" resumed");
            }
        }finally{if(scenario!=null)scenario.close();}
    }
}
