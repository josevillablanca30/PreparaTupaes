package cl.preparatupaes.app;

/** Server-bounded access measured against elapsed realtime, never the editable wall clock. */
final class SubscriptionLease {
    static final long MAX_MILLIS=12L*60*60*1000;
    final String user;
    final long issued,deadline;
    final int boot;
    SubscriptionLease(String user,long issued,long deadline,int boot){this.user=user;this.issued=issued;this.deadline=deadline;this.boot=boot;}
    static SubscriptionLease fromServer(String user,long serverNow,long validUntil,long requested,long received,int boot){
        long lifetime=Math.min(MAX_MILLIS,validUntil-serverNow)-Math.max(0,received-requested)-10000;
        if(serverNow<=0||received<requested||lifetime<=0)return new SubscriptionLease("",0,0,-1);
        return new SubscriptionLease(user,received,received+lifetime,boot);
    }
    boolean valid(long elapsed,int currentBoot){
        return user!=null&&user.matches("[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}")
            &&boot>=0&&boot==currentBoot&&issued>=0&&deadline>issued&&deadline-issued<=MAX_MILLIS
            &&elapsed>=issued&&elapsed<deadline;
    }
    static boolean requiresSubscription(String packageName,String url){
        if(!"cl.preparatupaes.app".equals(packageName)||url==null)return false;
        String path=url.split("[?#]",2)[0];
        return path.matches("file:///android_asset/(inicio|index|science|reading|m2|history)\\.html")
            ||path.matches("https://appassets\\.androidplatform\\.net/assets/(inicio|index|science|reading|m2|history)\\.html");
    }
}
