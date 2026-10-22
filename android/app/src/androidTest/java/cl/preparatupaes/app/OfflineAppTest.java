package cl.preparatupaes.app;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.view.KeyEvent;
import android.os.ParcelFileDescriptor;
import java.io.BufferedReader;
import java.io.InputStreamReader;
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
        return (WebView)activity.findViewById(android.R.id.content).findViewWithTag("cachaste-web");
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

    @Test public void scrolledLessonViewportStaysOutsideSystemBars() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        scenario.onActivity(activity -> {
            android.graphics.Rect bounds=new android.graphics.Rect();
            WebView view=web(activity);
            assertTrue(view.getGlobalVisibleRect(bounds));
            android.view.View decor=activity.getWindow().getDecorView();
            android.graphics.Insets bars=decor.getRootWindowInsets().getInsets(android.view.WindowInsets.Type.systemBars() | android.view.WindowInsets.Type.displayCutout());
            assertTrue("Content draws behind status bar",bounds.top>=bars.top);
            assertTrue("Controls draw behind navigation bar",bounds.bottom<=decor.getHeight()-bars.bottom);
        });
    }

    @Test public void pendingSessionOffersAWorkingWayToBeginTheChosenLesson() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        js("location.hash='#courses';CachasteDailyApp.render();document.querySelector('[data-action=pick-course][data-subject=M1]').click();var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.track=null;e.state.seen={};e.state.attempts=[];e.start('M1',2,'free','Descuento porcentual');var old=e.state.session.id;var q=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey==='M1'&&q.concept==='Enteros y cambios');location.hash='#level:'+encodeURIComponent(q.levelId);CachasteDailyApp.render();document.querySelector('[data-action=check-first]').click();true");
        waitFor("document.querySelector('.session-switch')");
        assertEquals("true",js("CachasteDailyApp.engine.state.session.id===old"));
        js("document.querySelector('[data-action=switch-start]').click();true");
        waitFor("document.querySelector('.question-title')");
        assertEquals("true",js("CachasteDailyApp.engine.state.session.id!==old && CachasteDailyApp.engine.state.session.concept==='Enteros y cambios'"));
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.save();true");
    }

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
        js("['m2-bank.js','learning-core.js','daily-catalog.js'].forEach(path=>{const script=document.createElement('script');script.src=path;document.head.appendChild(script)});true");
        waitFor("window.CachasteLearning && window.CACHASTE_DAILY_CATALOG && window.CACHASTE_M2");
        js("var record=JSON.parse(localStorage.getItem('cachaste-m2-v1'));record.session.assessmentVersions=record.session.ids.map(id=>CachasteLearning.assessmentVersion(CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey==='M2'&&q.id===id)));localStorage.setItem('cachaste-m2-v1',JSON.stringify(record));true");
        open("m2.html", "document.getElementById('resume')");
        js("document.getElementById('resume').click();true");
        waitFor("document.querySelector('[data-choice]')");
        js("[...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.slice(3)==='x=4').click();document.getElementById('check').click();true");
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
        js("['history-bank.js','learning-core.js','daily-catalog.js'].forEach(path=>{const script=document.createElement('script');script.src=path;document.head.appendChild(script)});true");
        waitFor("window.CachasteLearning && window.CACHASTE_DAILY_CATALOG && window.CACHASTE_HISTORIA");
        js("var record=JSON.parse(localStorage.getItem('cachaste-history-v1'));record.session.assessmentVersions=record.session.ids.map(id=>CachasteLearning.assessmentVersion(CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey==='Historia'&&q.id===id)));localStorage.setItem('cachaste-history-v1',JSON.stringify(record));true");
        open("history.html", "document.getElementById('resume')");
        js("document.getElementById('resume').click();[...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.includes('etiqueta de un cuaderno')).click();document.getElementById('check').click();true");
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
        open("inicio.html", "window.CachasteDailyApp");
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.state.foundationDraft=null;(CachasteDailyApp.engine.state.stages||={}).M1='';(CachasteDailyApp.engine.state.basicsOptional||={}).M1=false;location.hash='#courses';CachasteDailyApp.render();document.querySelector('[data-action=pick-course][data-subject=M1]').click();true");
        waitFor("document.querySelector('[data-action=game-mode]')");
        js("document.querySelector('[data-action=game-mode]').click();true");
        waitFor("document.querySelector('.trail-stop.current .trail-node')");
        js("document.querySelector('.trail-stop.current .trail-node').click();true");
        waitFor("document.querySelector('[data-action=check-first]')");
        js("document.querySelector('[data-action=check-first]').click();true");
        waitFor("document.querySelector('.question-title')");
        assertEquals("true",js("CACHASTE_DAILY_CATALOG.items.length>=641 && new Set(CACHASTE_DAILY_CATALOG.items.map(q=>q.key)).size===CACHASTE_DAILY_CATALOG.items.length"));
        waitFor("document.querySelector('.wise-cat img').naturalWidth>0");
        js("document.querySelector('[data-action=choice]').click();true");
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
        waitFor("document.querySelector('[data-action=game-mode]')");
        js("document.querySelector('[data-action=game-mode]').click();true");
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
        captureDidacticScreen("release-celebration");
        assertEquals("true",js("CACHASTE_DAILY_CATALOG.items.length>=641 && new Set(CACHASTE_DAILY_CATALOG.items.map(q=>q.key)).size===CACHASTE_DAILY_CATALOG.items.length"));
    }
    @Test public void visualBiologyLessonTeachesInteractsAndResumesOffline() throws Exception {
        open("inicio.html", "window.CachasteDailyApp && window.CachasteLessons");
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.state.foundationDraft=null;location.hash='#courses';CachasteDailyApp.render();document.querySelector('[data-action=pick-course][data-subject=Ciencias]').click();true");
        waitFor("document.querySelector('[data-track=Biología]')");
        js("document.querySelector('[data-track=Biología]').click();true");
        waitFor("document.querySelector('[data-action=game-mode]')");
        js("document.querySelector('[data-action=game-mode]').click();true");
        waitFor("document.querySelector('.trail-stop.current .trail-node')");
        js("document.querySelector('.trail-stop.current .trail-node').click();true");
        waitFor("document.querySelector('[data-action=lesson]')");
        js("document.querySelector('[data-action=lesson]').click();true");
        waitFor("document.querySelector('.lesson-scene img') && document.querySelector('.lesson-scene img').naturalWidth>0");
        assertEquals("3",js("document.querySelectorAll('.didactic-overview > section').length"));
        js("document.querySelector('[data-action=intro-next]').click();true");
        assertEquals("0",js("document.querySelectorAll('.visual-lesson details').length"));
        String xp=js("CachasteDailyApp.engine.stats().xp");
        js("document.querySelector('[data-action=intro-next]').click();document.querySelectorAll('[data-action=visual-tap]')[2].click();true");
        waitFor("document.querySelector('.visual-discovery').textContent.includes('acoplar')");
        String draft=js("JSON.stringify(CachasteDailyApp.engine.state.session.visualLesson)");
        scenario.recreate();
        waitFor("window.CachasteDailyApp && document.querySelector('.visual-discovery')");
        assertEquals(draft,js("JSON.stringify(CachasteDailyApp.engine.state.session.visualLesson)"));
        js("document.querySelector('[data-action=intro-next]').click();document.querySelectorAll('[data-action=visual-choose]')[1].click();true");
        waitFor("document.querySelector('.visual-response.try-again')");
        assertEquals("true",js("document.querySelector('[data-action=intro-next]').disabled"));
        js("document.querySelectorAll('[data-action=visual-choose]')[0].click();true");
        waitFor("document.querySelector('.visual-response.right')");
        assertEquals(xp,js("CachasteDailyApp.engine.stats().xp"));
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.save();location.hash='#home';CachasteDailyApp.render();true");
    }
    @Test public void fullTeachingAndManipulableModelPersistWithoutAwardingMastery() throws Exception {
        open("inicio.html", "window.CachasteDailyApp && window.CachasteLessons");
        js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.start('M1',2,'lesson','Descuento porcentual');location.hash='#session';CachasteDailyApp.render();true");
        waitFor("document.querySelector('[data-laboratory=percent]')");
        String xp=js("CachasteDailyApp.engine.stats().xp");
        js("document.querySelector('[data-action=visual-lab][data-value=\"3\"]').click();true");
        waitFor("document.querySelector('.lab-formula').textContent.includes('$150')");
        scenario.recreate();
        waitFor("window.CachasteDailyApp && document.querySelector('.lab-formula')");
        assertEquals("true",js("document.querySelector('.lab-formula').textContent.includes('$150')"));
        js("document.querySelector('[data-action=visual-read]').click();true");
        waitFor("document.querySelector('.lesson-reader')");
        assertEquals("true",js("(()=>{var e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[0]),t=q.teaching,body=document.querySelector('.lesson-reader').textContent;return [...t.foundation,...t.intuition,t.example.problem,...t.example.steps,t.example.bridge].every(x=>body.includes(x))})()"));
        assertEquals(xp,js("CachasteDailyApp.engine.stats().xp"));
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.save();location.hash='#home';CachasteDailyApp.render();true");
    }
    @Test public void numericGuidedPracticePersistsDecimalCommaWithoutMastery() throws Exception {
        open("inicio.html", "window.CachasteDailyApp && window.CachasteDemonstrations");
        js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.start('M1',2,'lesson','Exponente negativo');location.hash='#session';CachasteDailyApp.render();true");
        waitFor("document.querySelector('[data-visual-answer]')");
        String xp=js("CachasteDailyApp.engine.stats().xp");
        String attempts=js("CachasteDailyApp.engine.state.attempts.length");
        js("var input=document.querySelector('[data-visual-answer]');input.value='-25';input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-action=visual-try]').click();true");
        waitFor("document.querySelector('.visual-response.try-again')");
        js("var input=document.querySelector('[data-visual-answer]');input.value='0,04';input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-action=visual-try]').click();true");
        waitFor("document.querySelector('.visual-response.right')");
        scenario.recreate();
        waitFor("window.CachasteDailyApp && document.querySelector('.visual-response.right')");
        assertEquals("\"0,04\"",js("document.querySelector('[data-visual-answer]').value"));
        assertEquals(xp,js("CachasteDailyApp.engine.stats().xp"));
        assertEquals(attempts,js("CachasteDailyApp.engine.state.attempts.length"));
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.save();location.hash='#home';CachasteDailyApp.render();true");
    }
    @Test public void thematicReadingCaseAndSchoolSequenceWorkOffline() throws Exception {
        open("inicio.html", "window.CachasteDailyApp && window.CachasteSchool && window.CachasteScenarios");
        js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.start('Lectura',2,'lesson','Tabla y relaciones entre datos');location.hash='#session';CachasteDailyApp.render();true");
        waitFor("document.querySelector('.scenario-table-wrap')");
        js("document.querySelector('[data-action=visual-tap][data-value=\"1\"]').click();true");
        waitFor("document.querySelector('.visual-discovery').textContent.includes('80%')");
        scenario.recreate();
        waitFor("window.CachasteDailyApp && document.querySelector('.visual-discovery')");
        assertEquals("true",js("document.querySelector('.visual-discovery').textContent.includes('80%')"));
        assertEquals("true",js("CachasteProgression.route(CACHASTE_DAILY_CATALOG.items,'M2',null,[]).units.every((u,i,a)=>!i||u.schoolYear>=a[i-1].schoolYear)"));
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.save();location.hash='#home';CachasteDailyApp.render();true");
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
    private void captureDidacticScreen(String name) throws Exception {
        InstrumentationRegistry.getInstrumentation().waitForIdleSync();
        Thread.sleep(1200);
        CountDownLatch painted=new CountDownLatch(1);
        scenario.onActivity(activity -> {
            WebView view=web(activity);
            view.postVisualStateCallback(System.nanoTime(),new WebView.VisualStateCallback() {
                @Override public void onComplete(long requestId) {
                    view.postOnAnimation(() -> view.postOnAnimation(painted::countDown));
                }
            });
        });
        assertTrue("WebView did not paint the current lesson",painted.await(10,TimeUnit.SECONDS));
        Thread.sleep(300);
        // Keep native captures outside app data, which Gradle clears after testing.
        String path="/data/local/tmp/cachaste-didactic-screens/"+name+".png";
        // UiAutomation starts one process per call; it does not interpret shell operators.
        deviceCommand("mkdir -p /data/local/tmp/cachaste-didactic-screens");
        deviceCommand("screencap -p "+path);
        assertTrue("Native screenshot export failed",deviceCommand("stat -c %s "+path).matches("[1-9][0-9]*"));
    }
    @Test public void illustratedFiveSubjectLessonsAndSelectedErrorsWorkInInstalledApk() throws Exception {
        open("inicio.html", "window.CachasteDailyApp && window.CachasteIllustrations");
        js("location.hash='#courses';CachasteDailyApp.render();document.querySelector('[data-action=pick-course][data-subject=M1]').click();true");
        waitFor("document.querySelector('.mode-picker')");
        captureDidacticScreen("modes-cat");
        String[][] cases={{"M1","Enteros y cambios"},{"M2","Ecuaciones lineales"},{"Lectura","Función de un fragmento"},{"Historia","Cuestión social"},{"Ciencias","Respiración celular y ATP"},{"Ciencias","Molaridad"},{"Ciencias","Segunda ley de Newton"}};
        for(int i=0;i<cases.length;i++) {
            js("var e=CachasteDailyApp.engine;var sample=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey==='"+cases[i][0]+"' && q.concept==='"+cases[i][1]+"');e.close();e.state.foundationDraft=null;e.state.track=sample.subjectKey==='Ciencias'?sample.subject:null;e.start(sample.subjectKey,2,'lesson',sample.concept);location.hash='#session';CachasteDailyApp.render();true");
            waitFor("document.querySelectorAll('.didactic-overview > section').length===3");
            waitFor("Array.from(document.querySelectorAll('.reference-lesson-hero img')).every(im=>im.complete && im.naturalWidth>0)");
            assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth+1"));
            js("scrollTo(0,0);true");captureDidacticScreen(i+"-overview");
            js("document.querySelector('.didactic-model').scrollIntoView();true");captureDidacticScreen(i+"-model");
            js("document.querySelector('[data-action=begin-question]').click();var e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);s.selected=(q.answer+1)%q.options.length;s.confidence='seguro';CachasteDailyApp.render();document.querySelector('[data-action=check]').click();true");
            waitFor("document.querySelector('.reference-easy-card') && document.querySelector('.reference-example-card')");
            assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth+1"));
            js("document.querySelector('.selected-repair').scrollIntoView();true");captureDidacticScreen(i+"-repair");
        }
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.save();true");
    }
    @Test public void expressFifteenWorksOfflineWithoutConfidenceAndKeepsItsAreaReport() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.subject='M1';e.save();location.hash='#courses';CachasteDailyApp.render();document.querySelector('[data-action=pick-course][data-subject=M1]').click();true");
        waitFor("document.querySelector('[data-action=express-mode]')");
        js("document.querySelector('[data-action=express-mode]').click();true");
        waitFor("document.querySelector('.question-title')");
        assertEquals("15",js("CachasteDailyApp.engine.state.session.keys.length"));
        assertEquals("true",js("!document.querySelector('[data-action=confidence]') && !document.querySelector('[data-action=hint]')"));
        scenario.recreate();waitFor("window.CachasteDailyApp && document.querySelector('.question-title')");
        for(int i=0;i<15;i++) {
            js("var e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);document.querySelector('[data-action=choice][data-index=\"'+q.answer+'\"]').click();document.querySelector('[data-action=check]').click();true");
            assertEquals("true",js("!document.querySelector('.daily-options .correct') && !document.querySelector('.tutor')"));
            js("document.querySelector('[data-action=next]').click();true");
        }
        waitFor("document.querySelector('.express-report')");
        assertEquals("true",js("document.querySelector('.express-report').textContent.includes('15/15') && document.querySelectorAll('.express-review').length===15"));
        scenario.recreate();waitFor("window.CachasteDailyApp && document.querySelector('.express-report')");
        assertEquals("true",js("CachasteDailyApp.engine.state.expressReports.at(-1).areas.length>=3"));
        captureDidacticScreen("express-report");
    }
    @Test public void diagnosisAndUnlimitedAttemptsUnlockTheMapOffline() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.attempts=e.state.attempts.filter(r=>r.subject!=='M1');e.state.unitExams={};e.state.stages={};e.state.seen={};localStorage.removeItem(CachasteCurriculum.subjects.M1.key);e.save();location.hash='#courses';CachasteDailyApp.render();document.querySelector('[data-action=pick-course][data-subject=M1]').click();true");
        waitFor("document.querySelector('[data-action=diagnostic-mode]')");
        js("document.querySelector('[data-action=diagnostic-mode]').click();true");
        waitFor("document.querySelector('.question-title')");
        for(int i=0;i<30;i++) {
            js("var e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]),n=s.index<2?q.answer:(q.answer+1)%q.options.length;document.querySelector('[data-action=choice][data-index=\"'+n+'\"]').click();document.querySelector('[data-action=check]').click();true");
            if(i==4) {
                assertEquals("0",js("CachasteDailyApp.engine.profile('M1').filter(p=>p.status==='comprobado').length"));
                scenario.recreate();waitFor("window.CachasteDailyApp && document.querySelector('.answer-feedback')");
            }
            js("document.querySelector('[data-action=next]').click();true");
        }
        waitFor("document.querySelector('.diagnostic-placement')");
        assertEquals("true",js("CachasteDailyApp.engine.state.celebration.demonstrated.length===1"));
        captureDidacticScreen("diagnostic-placement");
        js("document.querySelector('[data-action=diagnostic-path]').click();true");
        waitFor("document.querySelector('.trail-stop.current')");
        assertEquals("true",js("!document.querySelectorAll('.trail-node')[1].disabled && document.querySelectorAll('.trail-node')[2].disabled"));
        js("var e=CachasteDailyApp.engine;e.state.attempts=e.state.attempts.filter(r=>r.subject!=='M1');e.state.seen={};localStorage.removeItem(CachasteCurriculum.subjects.M1.key);var concept=CachasteProgression.route(CACHASTE_DAILY_CATALOG.items,'M1',null,e.profile('M1')).current.objective;e.start('M1',2,'lesson',concept);while(e.state.session){var s=e.state.session,q=e.byKey.get(s.keys[s.index]);s.studied=true;e.answer(q.answer);e.next();}CachasteDailyApp.render();true");
        assertEquals("true",js("document.querySelectorAll('.trail-node')[1].disabled"));
        js("var e=CachasteDailyApp.engine,concept=CachasteProgression.route(CACHASTE_DAILY_CATALOG.items,'M1',null,e.profile('M1')).current.objective;e.start('M1',2,'free',concept);while(e.state.session){var s=e.state.session,q=e.byKey.get(s.keys[s.index]);e.answer(q.answer);e.next();}CachasteDailyApp.render();true");
        assertEquals("true",js("!document.querySelectorAll('.trail-node')[1].disabled && document.querySelectorAll('.trail-node')[2].disabled"));
        scenario.recreate();waitFor("window.CachasteDailyApp && document.querySelector('.trail-stop.current')");
        assertEquals("true",js("!document.querySelectorAll('.trail-node')[1].disabled"));
        captureDidacticScreen("earned-unlock");
    }
    @Test public void friendlyFractionsExplainWordsBeforeLettersAndKeepTheFullLesson() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.track=null;e.start('M1',2,'lesson','Fracciones y unidad común');location.hash='#session';CachasteDailyApp.render();true");
        waitFor("document.querySelector('.didactic-key')");
        assertEquals("true",js("var opening=[...document.querySelectorAll('.didactic-key > p')].map(p=>p.textContent).join(' ');opening.includes('pizza') && opening.includes('denominador') && opening.includes('numerador') && !opening.includes('a/b')"));
        assertEquals("true",js("!document.querySelector('.didactic-depth').open && document.documentElement.scrollWidth<=innerWidth+1"));
        js("document.querySelector('.didactic-key').scrollIntoView();true");captureDidacticScreen("fractions-friendly");
        js("document.querySelector('.didactic-depth summary').click();document.querySelector('.didactic-depth').scrollIntoView();true");
        assertEquals("true",js("var e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[0]);q.teaching.foundation.every(p=>document.querySelector('.didactic-depth').textContent.replace(/\\s+/g,' ').includes(p.replace(/\\s+/g,' ')))"));
        captureDidacticScreen("fractions-full");
        scenario.recreate();waitFor("window.CachasteDailyApp && document.querySelector('.didactic-key')");
        assertEquals("true",js("document.querySelector('.didactic-key').textContent.includes('pizza')"));
    }
    @Test public void noInternetOrStoragePermissionIsRequested() throws Exception {
        android.content.Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
        PackageInfo info=context.getPackageManager().getPackageInfo(context.getPackageName(),PackageManager.GET_PERMISSIONS);
        assertTrue(info.requestedPermissions==null || info.requestedPermissions.length==0);
    }

    @Test public void entireShippedCatalogueRendersLessonsAndAllTutorModesOffline() throws Exception {
        open("inicio.html", "window.CachasteDailyApp && window.CachasteLessons");
        assertEquals("802",js("CACHASTE_DAILY_CATALOG.items.length"));
        assertEquals("318",js("new Set(CACHASTE_DAILY_CATALOG.items.map(q=>q.levelId)).size"));
        js("window.releaseAuditBackup=JSON.stringify(Object.entries(localStorage));window.releaseAuditIssues=[];window.releaseAuditCount=0;true");
        try {
            // Small batches keep the WebView responsive and the instrumentation callback bounded.
            for(int start=0;start<802;start+=10) {
                String issues=js("(function(){var e=CachasteDailyApp.engine;for(var i="+start+";i<Math.min("+(start+10)+",CACHASTE_DAILY_CATALOG.items.length);i++){var q=CACHASTE_DAILY_CATALOG.items[i];e.close();e.state.foundationDraft=null;e.state.subject=q.subjectKey;e.state.track=q.subjectKey==='Ciencias'?q.subject:null;var s=e.state.session={id:'native-catalogue-'+i,subject:q.subjectKey,track:e.state.track,concept:q.concept,mode:'lesson',keys:[q.key],index:0,selected:null,checked:false,results:[],stage:'intro'};location.hash='#session';CachasteDailyApp.render();if(document.querySelectorAll('.didactic-overview > section').length!==3)releaseAuditIssues.push(q.key+':lesson');s.stage='question';s.selected=(q.answer+1)%q.options.length;s.checked=true;s.results=[{correct:false}];for(var mode of ['steps','easy','example']){s.tutor=mode;s.card=0;CachasteDailyApp.render();if(!document.querySelector('.tutor .lesson-text')?.textContent.trim())releaseAuditIssues.push(q.key+':'+mode);if(document.documentElement.scrollWidth>innerWidth+1)releaseAuditIssues.push(q.key+':overflow');}releaseAuditCount++;}return releaseAuditIssues.slice(0,12).join(';')})()");
                assertEquals("Installed catalogue contains broken lessons or tutor modes", "\"\"", issues);
            }
            assertEquals("802",js("releaseAuditCount"));
        } finally {
            js("CachasteDailyApp.engine.close();localStorage.clear();JSON.parse(releaseAuditBackup).forEach(([k,v])=>localStorage.setItem(k,v));true");
        }
    }

    @Test public void releaseScreensCoverFiveSubjectsAndEveryScienceMention() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.state.foundationDraft=null;location.hash='#courses';CachasteDailyApp.render();scrollTo(0,0);true");
        captureDidacticScreen("release-home");
        for(String subject:new String[]{"M1","M2","Lectura","Historia"}) {
            js("location.hash='#courses';CachasteDailyApp.render();document.querySelector('[data-action=pick-course][data-subject="+subject+"]').click();true");
            waitFor("document.querySelector('[data-action=game-mode]')");
            js("document.querySelector('[data-action=game-mode]').click();true");
            waitFor("document.querySelector('.trail-node')");
            js("scrollTo(0,0);true");
            captureDidacticScreen("release-map-"+subject);
        }
        js("location.hash='#courses';CachasteDailyApp.render();document.querySelector('[data-action=pick-course][data-subject=Ciencias]').click();scrollTo(0,0);true");
        waitFor("document.querySelector('[data-track=Biología]')");
        captureDidacticScreen("release-science-mentions");
        for(String track:new String[]{"Biología","Química","Física","TP"}) {
            js("location.hash='#tracks';CachasteDailyApp.render();document.querySelector('[data-track=\""+track+"\"]').click();true");
            waitFor("document.querySelector('[data-action=game-mode]')");
            assertEquals("\""+track+"\"",js("CachasteDailyApp.engine.state.track"));
            js("document.querySelector('[data-action=game-mode]').click();scrollTo(0,0);true");
            waitFor("document.querySelector('.trail-node')");
            captureDidacticScreen("release-science-"+track);
        }
    }

    @Test public void longFormulaAndTitleStayReadableInInstalledWebView() throws Exception {
        open("inicio.html", "window.CachasteDailyApp");
        String[][] cases={{"M2","Logaritmos"},{"M2","Distancia en el plano"},{"Historia","Industrialización y fomento estatal"},{"Ciencias","Frecuencia al cambiar de medio"}};
        for(int i=0;i<cases.length;i++) {
            js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;var q=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey==='"+cases[i][0]+"'&&q.concept==='"+cases[i][1]+"');e.state.track=q.subjectKey==='Ciencias'?q.subject:null;e.start(q.subjectKey,2,'lesson',q.concept);location.hash='#session';CachasteDailyApp.render();scrollTo(0,0);true");
            waitFor("document.querySelector('.didactic-overview')");
            assertEquals("true",js("[...document.querySelectorAll('.reference-lesson-hero h1,.lesson-chapters button,.lesson-reading-control button')].every(n=>n.scrollWidth<=n.clientWidth+2)"));
            assertEquals("true",js("[...document.querySelectorAll('.lesson-chapters button,.lesson-reading-control button,.lesson-top button')].every(n=>n.getBoundingClientRect().height>=48)"));
            captureDidacticScreen("release-long-"+i);
            js("document.querySelector('[data-action=begin-question]').click();var e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);document.querySelector('[data-action=choice][data-index=\"'+((q.answer+1)%q.options.length)+'\"]').click();document.querySelector('[data-action=check]').click();scrollTo(0,0);true");
            captureDidacticScreen("release-error-"+i);
            js("document.querySelector('[data-mode=example]').click();document.querySelector('.reference-example-card').scrollIntoView();true");
            assertEquals("true",js("[...document.querySelectorAll('.tutor li,.reference-example-card li')].every(n=>n.scrollWidth<=n.clientWidth+2)"));
            captureDidacticScreen("release-example-"+i);
        }
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.save();true");
    }

    @Test public void additionalIllustrationsAndScientificComparisonWorkOffline() throws Exception {
        open("inicio.html", "window.CachasteDailyApp && window.CachasteTopicVisuals");
        assertEquals("11",js("CachasteTopicVisuals.themes.length"));
        js("window.nativeAssetsReady=false;window.nativeAssetsOk=false;Promise.all(['osmosis','meiosis','electricity','waves','geometry','probability','industry','argument'].map(k=>new Promise(resolve=>{var im=new Image();im.onload=()=>resolve(im.naturalWidth>900);im.onerror=()=>resolve(false);im.src='assets/lesson-cat-'+k+'-v3.webp'}))).then(results=>{window.nativeAssetsOk=results.every(Boolean);window.nativeAssetsReady=true});true");
        waitFor("window.nativeAssetsReady");
        assertEquals("true",js("window.nativeAssetsOk"));
        js("var e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.start('M2',2,'lesson','Dispersión');location.hash='#session';CachasteDailyApp.render();true");
        waitFor("document.querySelector('[data-topic-model=dispersion]')");
        String xp=js("CachasteDailyApp.engine.stats().xp");
        String attempts=js("CachasteDailyApp.engine.state.attempts.length");
        js("document.querySelectorAll('[data-action=visual-topic]')[2].click();true");
        waitFor("document.querySelector('.topic-equation').textContent.includes('32/3')");
        scenario.recreate();
        waitFor("window.CachasteDailyApp && document.querySelector('.topic-equation')");
        assertEquals("true",js("document.querySelector('.topic-equation').textContent.includes('32/3')"));
        assertEquals(xp,js("CachasteDailyApp.engine.stats().xp"));
        assertEquals(attempts,js("CachasteDailyApp.engine.state.attempts.length"));
        js("CachasteDailyApp.engine.close();CachasteDailyApp.engine.save();location.hash='#home';CachasteDailyApp.render();true");
    }
}
