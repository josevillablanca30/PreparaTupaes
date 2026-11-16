package cl.preparatupaes.app;

/**
 * Product rules shared with the web Basic tier.
 * This class is deliberately NOT wired into SubscriptionAccessController:
 * local quota counts must never grant educational access.
 */
final class BasicAccessPolicy {
    static final int LESSONS_PER_SUBJECT_DAILY=3;
    static final int DIAGNOSTICS_PER_SUBJECT_LIFETIME=1;
    static final int EXPRESS_EXAMS_DAILY=1;
    static final int DUELS_DAILY=2;

    private BasicAccessPolicy(){}

    static boolean validSubject(String subject){
        return "m1".equals(subject)||"m2".equals(subject)
            ||"lectora".equals(subject)||"ciencias".equals(subject)
            ||"historia".equals(subject);
    }

    static int limit(String kind,String subject){
        if("lesson".equals(kind)&&validSubject(subject))return LESSONS_PER_SUBJECT_DAILY;
        if("diagnostic".equals(kind)&&validSubject(subject))return DIAGNOSTICS_PER_SUBJECT_LIFETIME;
        if("expressExam".equals(kind)&&"all".equals(subject))return EXPRESS_EXAMS_DAILY;
        if("duel".equals(kind)&&"all".equals(subject))return DUELS_DAILY;
        return 0;
    }

    static boolean canAttempt(String kind,String subject,int serverReportedUsed){
        return serverReportedUsed>=0&&serverReportedUsed<limit(kind,subject);
    }
}
