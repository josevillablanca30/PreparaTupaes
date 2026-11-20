package cl.preparatupaes.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.SystemClock;
import android.provider.Settings;
import android.webkit.WebView;
import androidx.test.core.app.ActivityScenario;
import androidx.test.platform.app.InstrumentationRegistry;
import org.json.JSONObject;
import org.junit.Test;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Runs first on the original version 47, then after adb install -r of version 48. Disposable emulator only. */
public class UpgradePersistenceTest {
 private ActivityScenario<MainActivity> scenario;
 private String js(String code)throws Exception{
  AtomicReference<String> result=new AtomicReference<>();CountDownLatch latch=new CountDownLatch(1);
  scenario.onActivity(a->{WebView w=a.findViewById(android.R.id.content).findViewWithTag("cachaste-web");w.evaluateJavascript(code,s->{result.set(s);latch.countDown();});});
  assertTrue(latch.await(10,TimeUnit.SECONDS));return result.get();
 }
 private void ready(String expression)throws Exception{
  for(int n=0;n<150;n++){if("true".equals(js("Boolean("+expression+")")))return;Thread.sleep(100);}
  fail("Upgrade state not reached: "+expression);
 }
 @Test public void progressSurvivesInstalledVersionUpdate()throws Exception{
  Context c=InstrumentationRegistry.getInstrumentation().getTargetContext();
  assertEquals("cl.preparatupaes.app",c.getPackageName());
  SharedPreferences nav=c.getSharedPreferences("cachaste-navigation",Context.MODE_PRIVATE);
  String phase=InstrumentationRegistry.getArguments().getString("phase");
  if("seed".equals(phase)){
   assertEquals(47,c.getPackageManager().getPackageInfo(c.getPackageName(),0).getLongVersionCode());
   long elapsed=SystemClock.elapsedRealtime();int boot=Settings.Global.getInt(c.getContentResolver(),Settings.Global.BOOT_COUNT,-1);
   c.getSharedPreferences("cachaste-subscription-lease",Context.MODE_PRIVATE).edit().putString("user","10000000-0000-4000-8000-000000000001").putLong("issued",elapsed).putLong("deadline",elapsed+600000).putInt("boot",boot).commit();
   // The preceding clean-install suite ran version 48. A real version-47 installation has no migration marker.
   nav.edit().clear().putString("last-page","file:///android_asset/inicio.html").commit();
   scenario=ActivityScenario.launch(MainActivity.class);
   try{
    ready("location.protocol==='file:'&&document.readyState==='complete'&&window.CachasteDaily&&window.CACHASTE_DAILY_CATALOG");
    // Keep a real old-engine document and add visible progress fields to test exact preservation.
    String raw=js("(()=>{const engine=CachasteDaily.create(localStorage,CACHASTE_DAILY_CATALOG.items,CachasteCurriculum.subjects,undefined,undefined,CACHASTE_DAILY_CATALOG.texts);engine.save();let d=JSON.parse(localStorage.getItem('cachaste-daily-v1'));d.upgradeProof={stars:3,xp:45,streak:2,history:['original-47']};localStorage.setItem('cachaste-daily-v1',JSON.stringify(d));localStorage.setItem('cachaste-m2-v1',JSON.stringify({completed:[{id:'saved-before-upgrade'}]}));return localStorage.getItem('cachaste-daily-v1')})()");
    nav.edit().putString("upgrade-qa-expected",new org.json.JSONTokener(raw).nextValue().toString()).commit();
   }finally{scenario.close();}
  }else{
   assertEquals("verify",phase);assertEquals(48,c.getPackageManager().getPackageInfo(c.getPackageName(),0).getLongVersionCode());
   assertTrue(nav.contains("upgrade-qa-expected"));
   scenario=ActivityScenario.launch(MainActivity.class);
   try{
    ready("location.origin==='https://appassets.androidplatform.net'&&document.readyState==='complete'");
    assertTrue(nav.getBoolean("legacy-archived",false));
    JSONObject archive=new JSONObject(nav.getString("legacy-progress","{}"));
    assertEquals(nav.getString("upgrade-qa-expected","missing"),archive.getString("cachaste-daily-v1"));
    assertEquals("saved-before-upgrade",new JSONObject(archive.getString("cachaste-m2-v1")).getJSONArray("completed").getJSONObject(0).getString("id"));
    scenario.recreate();ready("document.readyState==='complete'&&location.origin==='https://appassets.androidplatform.net'");
    assertEquals(archive.toString(),new JSONObject(nav.getString("legacy-progress","{}")).toString());
   }finally{scenario.close();}
  }
 }
}
