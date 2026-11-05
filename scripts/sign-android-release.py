#!/usr/bin/env python3
"""Sign a verified AAB with the owner's local upload key. Never prints credentials."""
import argparse,json,os,subprocess,zipfile,hashlib
from pathlib import Path
from cryptography import x509
from cryptography.hazmat.primitives import hashes
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path);p.add_argument('--signing-dir',type=Path,required=True);p.add_argument('--output',type=Path,required=True);args=p.parse_args()
config=json.loads((args.signing_dir/'signing.json').read_text())
with zipfile.ZipFile(args.bundle) as z:
    assert 'BundleConfig.pb' in z.namelist(),'No es un Android App Bundle'
    before={n:hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist() if not n.upper().startswith('META-INF/')}
args.output.parent.mkdir(parents=True,exist_ok=True)
env={**os.environ,'CACHASTE_SIGN_STORE_PASS':config['storePassword'],'CACHASTE_SIGN_KEY_PASS':config['keyPassword']}
command=['java','-m','jdk.jartool/sun.security.tools.jarsigner.Main','-keystore',str(args.signing_dir/'cachaste-upload.jks'),'-storepass:env','CACHASTE_SIGN_STORE_PASS','-keypass:env','CACHASTE_SIGN_KEY_PASS','-sigalg','SHA256withRSA','-digestalg','SHA-256','-signedjar',str(args.output),str(args.bundle),config['alias']]
subprocess.run(command,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True)
subprocess.run(['java','-m','jdk.jartool/sun.security.tools.jarsigner.Main','-verify',str(args.output)],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True)
cert=subprocess.run(['keytool','-printcert','-jarfile',str(args.output),'-rfc'],capture_output=True,check=True).stdout
expected=x509.load_pem_x509_certificate((args.signing_dir/'upload-certificate.pem').read_bytes())
actual=x509.load_pem_x509_certificate(cert)
assert actual.fingerprint(hashes.SHA256())==expected.fingerprint(hashes.SHA256()),'Certificado no coincide'
with zipfile.ZipFile(args.output) as z:
    after={n:hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist() if not n.upper().startswith('META-INF/')}
assert before==after,'La firma cambió contenido de aplicación'
print(json.dumps({'output':str(args.output),'certificateSha256':actual.fingerprint(hashes.SHA256()).hex(),'contentPreserved':True,'sha256':hashlib.sha256(args.output.read_bytes()).hexdigest()}))
