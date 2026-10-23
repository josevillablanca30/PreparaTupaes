package cl.preparatupaes.app;

import org.junit.Test;
import static org.junit.Assert.*;

public class SubscriptionLeaseTest {
    private final String user="10000000-0000-4000-8000-000000000001";
    @Test public void everyCommercialEducationalRouteRequiresAccess(){
        for(String page:new String[]{"inicio","index","science","reading","m2","history"}){
            assertTrue(SubscriptionLease.requiresSubscription("cl.preparatupaes.app","file:///android_asset/"+page+".html#lesson"));
            assertTrue(SubscriptionLease.requiresSubscription("cl.preparatupaes.app","https://appassets.androidplatform.net/assets/"+page+".html"));
            assertFalse(SubscriptionLease.requiresSubscription("cl.preparatupaes.app.sciencebeta","file:///android_asset/"+page+".html"));
        }
        assertFalse(SubscriptionLease.requiresSubscription("cl.preparatupaes.app","https://appassets.androidplatform.net/assets/competencia.html#perfil"));
        assertFalse(SubscriptionLease.requiresSubscription("cl.preparatupaes.app","https://appassets.androidplatform.net/assets/suscripcion.html"));
    }
    @Test public void leaseNeverOutlivesServerExpiryAndNetworkTimeIsSubtracted(){
        SubscriptionLease lease=SubscriptionLease.fromServer(user,1000000,1060000,1000,3000,7);
        assertTrue(lease.valid(3000,7));assertTrue(lease.valid(50999,7));assertFalse(lease.valid(51000,7));
        assertFalse(lease.valid(2999,7));assertFalse(lease.valid(3000,8));
    }
    @Test public void longExpiredOrMalformedLeasesCannotGrantAccess(){
        SubscriptionLease cap=SubscriptionLease.fromServer(user,1000,Long.MAX_VALUE,1000,1000,4);
        assertTrue(cap.valid(1000,4));assertFalse(cap.valid(1000+SubscriptionLease.MAX_MILLIS,4));
        assertFalse(SubscriptionLease.fromServer(user,1000,1000,1000,1000,4).valid(1000,4));
        assertFalse(new SubscriptionLease(user,0,SubscriptionLease.MAX_MILLIS+1,4).valid(1000,4));
        assertFalse(new SubscriptionLease("forged",0,2000,4).valid(1000,4));
        assertFalse(new SubscriptionLease(user,0,2000,-1).valid(1000,-1));
    }
}
