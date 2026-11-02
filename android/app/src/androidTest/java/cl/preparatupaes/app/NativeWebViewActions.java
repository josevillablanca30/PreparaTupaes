package cl.preparatupaes.app;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import androidx.test.core.app.ActivityScenario;
import androidx.test.runner.lifecycle.ActivityLifecycleMonitorRegistry;
import androidx.test.runner.lifecycle.Stage;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Bounded UI dispatch for animated WebViews; rendering is still asserted by each caller. */
final class NativeWebViewActions {
    private NativeWebViewActions() {}
    static void onActivity(ActivityScenario<MainActivity> scenario,
            ActivityScenario.ActivityAction<MainActivity> action) throws InterruptedException {
        assertNotEquals("Do not block the main thread",Looper.getMainLooper(),Looper.myLooper());
        assertNotNull("Scenario is required",scenario);
        CountDownLatch complete=new CountDownLatch(1);
        AtomicReference<Throwable> failure=new AtomicReference<>();
        AtomicBoolean pending=new AtomicBoolean(true);
        // Test actions must not wait behind a display synchronization barrier.
        // The caller still asserts DOM readiness and actual rendered-frame commits.
        Handler.createAsync(Looper.getMainLooper()).post(() -> {
            if(!pending.get())return;
            try {
                MainActivity current=null;
                for(Activity activity:ActivityLifecycleMonitorRegistry.getInstance().getActivitiesInStage(Stage.RESUMED)) {
                    if(activity instanceof MainActivity) {
                        assertNull("Expected exactly one resumed application activity",current);
                        current=(MainActivity)activity;
                    }
                }
                assertNotNull("Application activity is not resumed",current);
                assertEquals("Application must be resumed",Stage.RESUMED,
                        ActivityLifecycleMonitorRegistry.getInstance().getLifecycleStageOf(current));
                action.perform(current);
            } catch(Throwable error) {failure.set(error);}
            finally {complete.countDown();}
        });
        boolean completed;
        try {completed=complete.await(10,TimeUnit.SECONDS);}
        finally {pending.set(false);}
        if(!completed)android.util.Log.e("CachasteQa","Main-thread action missed its ten-second deadline");
        assertTrue("Main-thread WebView action timed out",completed);
        Throwable error=failure.get();
        if(error!=null)android.util.Log.e("CachasteQa","Main-thread action failed",error);
        if(error instanceof Error)throw (Error)error;
        if(error!=null)throw new AssertionError("Main-thread WebView action failed",error);
    }
}
