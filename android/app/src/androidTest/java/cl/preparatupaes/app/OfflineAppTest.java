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
        assertEquals("114",js("window.CACHASTE_M2.length"));
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
    @Test public void teacherExplainsSelectedMistakeAndTransfersOffline() throws Exception {
        // Seed from the dashboard: an active study page saves its own closure on pagehide.
        open("inicio.html", "document.querySelectorAll('a.subject').length>=5");
        js("localStorage.setItem('cachaste-m2-v1',JSON.stringify({diagnosticDone:true,history:[],session:{id:'native-teacher',mode:'express',ids:['M2-001'],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:[null],flags:[]}}));true");
        open("m2.html", "document.getElementById('resume')");
        // This test verifies an active, versioned draft. Legacy drafts are intentionally blocked.
        js("var record=JSON.parse(localStorage.getItem('cachaste-m2-v1'));record.session.assessmentVersions=record.session.ids.map(id=>CachasteLearning.assessmentVersion(window.CACHASTE_M2.find(q=>q.id===id)));localStorage.setItem('cachaste-m2-v1',JSON.stringify(record));true");
        open("m2.html", "document.getElementById('resume')");
        js("document.getElementById('resume').click();true");
        waitFor("document.querySelector('[data-choice]')");
        js("[...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.slice(3)==='x=4').click();document.querySelector('[data-conf=\"duda\"]').click();document.getElementById('check').click();true");
        waitFor("document.querySelector('.teaching-section')");
        assertEquals("true",js("document.querySelector('.error-reason').textContent.includes('Elegiste: x=4')"));
        assertEquals("true",js("document.querySelector('.tutor-panel').textContent.includes('El concepto desde cero')"));
        String draft=js("localStorage.getItem('cachaste-m2-v1')");
        js("document.querySelector('[data-explain=\"easy\"]').click();true");
        assertEquals("true",js("document.querySelector('.tutor-panel').textContent.includes('Imagina un valle')"));
        js("document.querySelector('[data-explain=\"example\"]').click();true");
        assertEquals("true",js("document.querySelector('.tutor-panel').textContent.includes('C(q)=(q−6)²+20')"));
        assertEquals(draft,js("localStorage.getItem('cachaste-m2-v1')"));
        scenario.recreate();
        waitFor("document.getElementById('resume')");
        assertEquals(draft,js("localStorage.getItem('cachaste-m2-v1')"));
        js("document.getElementById('resume').click();document.getElementById('next').click();document.getElementById('reinforce').click();true");
        assertEquals("true",js("JSON.parse(localStorage.getItem('cachaste-m2-v1')).session.ids.every(id=>id!=='M2-001')"));
    }
    @Test public void historyTeacherSurvivesRecreationAndOffersDifferentDecision() throws Exception {
        open("inicio.html", "document.querySelectorAll('a.subject').length>=5");
        js("localStorage.setItem('cachaste-history-v1',JSON.stringify({diagnosticDone:true,history:[],session:{id:'native-history',mode:'express',ids:['HIS-009'],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:[null],flags:[]}}));true");
        open("history.html", "document.getElementById('resume')");
        // This test verifies an active, versioned draft. Legacy drafts are intentionally blocked.
        js("var record=JSON.parse(localStorage.getItem('cachaste-history-v1'));record.session.assessmentVersions=record.session.ids.map(id=>CachasteLearning.assessmentVersion(window.CACHASTE_HISTORIA.find(q=>q.id===id)));localStorage.setItem('cachaste-history-v1',JSON.stringify(record));true");
        open("history.html", "document.getElementById('resume')");
        js("document.getElementById('resume').click();[...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.includes('etiqueta de un cuaderno')).click();document.querySelector('[data-conf=\"duda\"]').click();document.getElementById('check').click();true");
        waitFor("document.querySelector('.teaching-section')");
        assertEquals("true",js("document.querySelector('.error-reason').textContent.includes('etiqueta de un cuaderno')"));
        String draft=js("localStorage.getItem('cachaste-history-v1')");
        js("document.querySelector('[data-explain=\"easy\"]').click();true");
        assertEquals("true",js("document.querySelector('.tutor-panel').textContent.includes('Tu sábado')"));
        js("document.querySelector('[data-explain=\"example\"]').click();true");
        assertEquals("true",js("document.querySelector('.tutor-panel').textContent.includes('espacio de música')"));
        assertEquals(draft,js("localStorage.getItem('cachaste-history-v1')"));
        scenario.recreate();waitFor("document.getElementById('resume')");
        assertEquals(draft,js("localStorage.getItem('cachaste-history-v1')"));
        js("document.getElementById('resume').click();document.getElementById('next').click();document.getElementById('reinforce').click();true");
        assertEquals("true",js("JSON.parse(localStorage.getItem('cachaste-history-v1')).session.ids.join(',')==='HIS-059'"));
    }
    @Test public void dailyLearningWorksOfflineAndResumesAfterRecreation() throws Exception {
        open("inicio.html", "window.CachasteDailyApp && document.querySelector('[data-action=practice]')");
        js("document.querySelector('[data-action=practice]').click();true");
        waitFor("document.querySelector('[data-action=smart]')");
        js("document.querySelector('#daily-count').value='1';document.querySelector('[data-action=smart]').click();true");
        waitFor("document.querySelector('.question-title')");
        assertEquals("true",js("CACHASTE_DAILY_CATALOG.items.length>=641 && new Set(CACHASTE_DAILY_CATALOG.items.map(q=>q.key)).size===CACHASTE_DAILY_CATALOG.items.length"));
        waitFor("document.querySelector('.wise-cat img').naturalWidth>0");
        js("document.querySelector('[data-action=choice]').click();document.querySelector('[data-confidence=duda]').click();true");
        String draft=js("localStorage.getItem('cachaste-daily-v1')");
        scenario.recreate();
        waitFor("window.CachasteDailyApp && document.querySelector('.question-title')");
        assertEquals(draft,js("localStorage.getItem('cachaste-daily-v1')"));
        js("document.querySelector('[data-action=check]').click();true");
        waitFor("document.querySelector('.tutor')");
        assertEquals("true",js("CachasteDailyApp.engine.state.attempts.length>=1"));
        InstrumentationRegistry.getInstrumentation().sendKeyDownUpSync(KeyEvent.KEYCODE_BACK);
        waitFor("document.querySelector('[data-action=resume]')");
    }
    @Test public void adventureMapWorksOfflineAndKeepsItsPlace() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.state.foundationDraft=null;CachasteDailyApp.engine.state.basics={};(CachasteDailyApp.engine.state.stages||={}).M1='basics';(CachasteDailyApp.engine.state.basicsOptional||={}).M1=true;CachasteDailyApp.engine.save();location.hash='#courses';CachasteDailyApp.render();true");
        waitFor("document.querySelector('[data-action=pick-course][data-subject=M1]')");
        js("document.querySelector('[data-action=pick-course][data-subject=M1]').click();true");
        waitFor("document.querySelector('.adventure-world.world-foundation .trail-node')");
        assertEquals("true", js("document.querySelector('.road-track').getAttribute('d').startsWith('M ')"));
        assertEquals("true", js("document.querySelector('.world-hud').textContent.includes('0 de 5 misiones dominadas')"));
        js("document.querySelector('.world-quest-banner [data-action=basic-level]').click();true");
        waitFor("document.querySelector('[data-action=basic-start]')");
        js("document.querySelector('[data-action=basic-start]').click();true");
        waitFor("document.querySelector('.teacher-step')");
        assertEquals("true", js("CachasteDailyApp.engine.state.foundationDraft.lesson==='cantidad'"));
        scenario.recreate();
        waitFor("window.CachasteDailyApp && document.querySelector('.teacher-step')");
        assertEquals("true", js("CachasteDailyApp.engine.state.foundationDraft.lesson==='cantidad'"));
        js("document.querySelector('[data-action=pause]').click();true");
        waitFor("document.querySelector('.adventure-world')");
        assertEquals("true", js("document.querySelector('[data-action=resume]')!==null"));
        js("document.querySelector('[data-action=resume]').click();true");
        waitFor("document.querySelector('.teacher-step')");
    }
    @Test public void foundationsTeachVisuallyAndPreserveTheirOwnEvidence() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.state.foundationDraft=null;CachasteDailyApp.basics.start('cantidad');location.hash='#basic';CachasteDailyApp.render();true");
        waitFor("document.querySelector('.learning-picture')");
        assertEquals("true",js("document.getElementById('traditional-section').hidden"));
        assertEquals("0",js("document.querySelectorAll('.daily-nav').length"));
        js("document.querySelector('[data-action=basic-forward]').click();true");
        String draft=js("JSON.stringify(CachasteDailyApp.engine.state.foundationDraft)");
        scenario.recreate();
        waitFor("window.CachasteDailyApp && document.querySelector('.learning-picture')");
        assertEquals(draft,js("JSON.stringify(CachasteDailyApp.engine.state.foundationDraft)"));
        js("while(document.querySelector('[data-action=basic-forward]'))document.querySelector('[data-action=basic-forward]').click();true");
        for(int i=0;i<2;i++) {
            js("var q=CachasteDailyApp.basics.current();document.querySelectorAll('[data-action=basic-choice]')[q.answer].click();document.querySelector('[data-action=basic-check]').click();document.querySelector('[data-action=basic-next]').click();true");
        }
        waitFor("document.querySelector('.celebration-screen')");
        assertEquals("true",js("CachasteDailyApp.basics.status('cantidad').complete"));
        assertEquals("true",js("CACHASTE_DAILY_CATALOG.items.length>=641 && new Set(CACHASTE_DAILY_CATALOG.items.map(q=>q.key)).size===CACHASTE_DAILY_CATALOG.items.length"));
    }
    @Test public void noInternetOrStoragePermissionIsRequested() throws Exception {
        android.content.Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
        PackageInfo info=context.getPackageManager().getPackageInfo(context.getPackageName(),PackageManager.GET_PERMISSIONS);
        assertTrue(info.requestedPermissions==null || info.requestedPermissions.length==0);
    }
}
