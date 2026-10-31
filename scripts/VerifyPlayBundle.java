import java.nio.file.*;
import java.security.MessageDigest;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.jar.*;

// java scripts/VerifyPlayBundle.java bundle.aab expected-public-certificate-sha256
// JarFile verifies signatures while every payload entry is read (not just META-INF).
class VerifyPlayBundle {
    public static void main(String[] args) throws Exception {
        String expected = args[1].replace(":", "").toLowerCase(Locale.ROOT);
        if (!expected.matches("[0-9a-f]{64}")) throw new SecurityException("Invalid expected certificate");
        int payloads = 0;
        Set<String> names = new HashSet<>();
        try (JarFile jar = new JarFile(args[0], true)) {
            var entries = jar.entries();
            while (entries.hasMoreElements()) {
                JarEntry entry = entries.nextElement();
                String name = entry.getName();
                if (!names.add(name)) throw new SecurityException("Duplicate bundle entry");
                if (entry.isDirectory()) continue;
                byte[] bytes;
                try (var stream = jar.getInputStream(entry)) { bytes = stream.readAllBytes(); }
                if (name.toUpperCase(Locale.ROOT).startsWith("META-INF/")) continue;
                if (name.matches("(?i).*(fixture|beta-vs|local-duel|\\.jks$|\\.keystore$|\\.p12$|signing\\.json$|\\.sql$).*"))
                    throw new SecurityException("Private/test payload in bundle: " + name);
                var signers = entry.getCodeSigners();
                if (signers == null || signers.length != 1) throw new SecurityException("Unsigned or ambiguous entry: " + name);
                var cert = (X509Certificate) signers[0].getSignerCertPath().getCertificates().get(0);
                cert.checkValidity();
                String fingerprint = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(cert.getEncoded()));
                if (!fingerprint.equals(expected)) throw new SecurityException("Unexpected upload certificate");
                if (cert.getSubjectX500Principal().getName().toLowerCase(Locale.ROOT).contains("android debug"))
                    throw new SecurityException("Debug signer rejected");
                payloads++;
            }
        }
        for (String required : List.of("BundleConfig.pb", "base/manifest/AndroidManifest.xml", "base/dex/classes.dex", "base/assets/competencia.html", "base/assets/competition-client.js", "base/assets/competition-config.js"))
            if (!names.contains(required)) throw new SecurityException("Missing: " + required);
        if (payloads == 0) throw new SecurityException("Empty bundle");
        String sha = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(Path.of(args[0]))));
        System.out.printf("{\"sha256\":\"%s\",\"certificateSha256\":\"%s\",\"verifiedPayloadEntries\":%d,\"allPayloadsSigned\":true}%n", sha, expected, payloads);
    }
}
