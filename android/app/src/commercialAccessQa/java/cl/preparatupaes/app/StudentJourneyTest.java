package cl.preparatupaes.app;

import android.webkit.WebView;
import android.graphics.Bitmap;
import androidx.test.core.app.ActivityScenario;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import org.json.JSONObject;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

public class StudentJourneyTest {
    private ActivityScenario<MainActivity> scenario;
    private String email;
    private String password;

    private String js(String script) throws Exception {
        AtomicReference<String> result = new AtomicReference<>();
        CountDownLatch done = new CountDownLatch(1);
        scenario.onActivity(activity -> {
            WebView view = activity.findViewById(android.R.id.content).findViewWithTag("cachaste-web");
            view.evaluateJavascript(script, value -> { result.set(value); done.countDown(); });
        });
        assertTrue("WebView disponible", done.await(10, TimeUnit.SECONDS));
        return result.get();
    }
    private void until(String condition, String label) throws Exception {
        for (int i=0;i<120;i++) {
            if ("true".equals(js("Boolean("+condition+")"))) return;
            Thread.sleep(400);
        }
        fail(label);
    }
    private void click(String selector) throws Exception {
        String node="document.querySelector("+JSONObject.quote(selector)+")";
        until(node,"Control ausente: "+selector);
        js(node+".click();true");
    }
    private void submit(String id) throws Exception {
        String form="document.getElementById("+JSONObject.quote(id)+")";
        until(form,"Formulario ausente: "+id);
        js("(()=>{const f="+form+";f.elements.email.value="+JSONObject.quote(email)+";f.elements.password.value="+JSONObject.quote(password)+";f.requestSubmit();return true})()");
    }
    private void screenshot(String file) throws Exception {
        Bitmap frame=InstrumentationRegistry.getInstrumentation().getUiAutomation().takeScreenshot();
        try(FileOutputStream out=InstrumentationRegistry.getInstrumentation().getTargetContext().openFileOutput(file,0)){
            assertTrue(frame.compress(Bitmap.CompressFormat.PNG,100,out));
        }
        frame.recycle();
    }
    @Test public void studentFromFirstLaunchToReturn() throws Exception {
        email=InstrumentationRegistry.getArguments().getString("qaEmail");
        assertNotNull(email);
        try(ActivityScenario<MainActivity> run=ActivityScenario.launch(MainActivity.class)){
            scenario=run;
            until("document.querySelector('#basic-access')","Entrada gratuita");
            assertEquals("\"Plan Básico GRATIS|Semanal|Mensual|Anual\"",js("Array.from(document.querySelectorAll('section[aria-label=Planes] h2'),e=>e.textContent).join('|')"));
            screenshot("planes.png");
            click("#basic-access");
            android.content.Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
            try (FileInputStream input=context.openFileInput("qa-login")) {
                password=new String(input.readAllBytes(),StandardCharsets.UTF_8);
            } finally { context.deleteFile("qa-login"); }
            submit("auth-form");
            until("document.querySelector('[data-action=signout]')","Ingreso del estudiante confirmado");
            click("a[href^='inicio.html']");
            until("window.CachasteDailyApp?.engine","Motor educativo abierto sin cobro");
            screenshot("ingreso.png");
            js("(()=>{const E=CachasteDailyApp.engine;const first=[...E.byKey.values()].find(q=>q.subjectKey==='M1');E.start('M1',2,'lesson',first.concept);return true})()");
            until("window.CachasteDailyApp.engine.state.session?.basicAttempt","Actividad Básica emitida por el servidor");
            for(int i=0;i<2;i++){
                click("[data-action=begin-question]");
                click("[data-action=choice][data-index='0']");
                click("[data-action=check]");
                until("CachasteDailyApp.engine.state.session?.checked","Respuesta recibida");
                click("[data-action=next]");
            }
            until("document.querySelector('.celebration-screen')","Actividad completada");
            screenshot("actividad.png");
            js("location.href='competencia.html#perfil';true");
            click("[data-action=signout]");
            submit("auth-form");
            until("document.querySelector('[data-action=signout]')","Reingreso");
            click("a[href^='inicio.html']");
            until("window.CachasteDailyApp?.engine?.state?.completed?.length>0","Progreso de Básico conservado");
            screenshot("reingreso.png");
        }
    }
}