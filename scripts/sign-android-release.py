#!/usr/bin/env python3
"""Sign a verified AAB with the owner's local upload key. Never prints credentials."""
import argparse,json,os,subprocess,zipfile,hashlib
from pathlib import Path
from cryptography import x509
from cryptography.hazmat.primitives import hashes
p=argparse.ArgumentParser();p.add_argument('bundle',type=Path,nargs='?');p.add_argument('--signing-dir',type=Path,required=True);p.add_argument('--output',type=Path);p.add_argument('--check-key-only',action='store_true');args=p.parse_args()
OFFICIAL_UPLOAD_SHA256='a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575'
if not args.check_key_only and (args.bundle is None or args.output is None):
    p.error('bundle y --output son obligatorios para firmar')
config=json.loads((args.signing_dir/'signing.json').read_text())
env={**os.environ,'CACHASTE_SIGN_STORE_PASS':config['storePassword'],'CACHASTE_SIGN_KEY_PASS':config['keyPassword']}
export=subprocess.run(['keytool','-exportcert','-rfc','-keystore',str(args.signing_dir/'cachaste-upload.jks'),'-alias',config['alias'],'-storepass:env','CACHASTE_SIGN_STORE_PASS'],env=env,capture_output=True)
if export.returncode:
    raise SystemExit('No se pudo abrir la clave de subida existente. No se generó un AAB firmado.')
key_certificate=x509.load_pem_x509_certificate(export.stdout)
key_fingerprint=key_certificate.fingerprint(hashes.SHA256()).hex()
if key_fingerprint!=OFFICIAL_UPLOAD_SHA256:
    raise SystemExit('UPLOAD_CERTIFICATE_MISMATCH: la clave existente no coincide con el SHA-256 oficial de Google Play. No se generó un AAB firmado.')
expected=x509.load_pem_x509_certificate((args.signing_dir/'upload-certificate.pem').read_bytes())
if expected.fingerprint(hashes.SHA256())!=key_certificate.fingerprint(hashes.SHA256()):
    raise SystemExit('BACKUP_CERTIFICATE_MISMATCH: el certificado del respaldo no coincide con su keystore.')
if args.check_key_only:
    print(json.dumps({'uploadCertificateMatchesGooglePlay':True,'certificateSha256':key_fingerprint}))
    raise SystemExit(0)
with zipfile.ZipFile(args.bundle) as z:
    assert 'BundleConfig.pb' in z.namelist(),'No es un Android App Bundle'
    before={n:hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist() if not n.upper().startswith('META-INF/')}
args.output.parent.mkdir(parents=True,exist_ok=True)
command=['java','-m','jdk.jartool/sun.security.tools.jarsigner.Main','-keystore',str(args.signing_dir/'cachaste-upload.jks'),'-storepass:env','CACHASTE_SIGN_STORE_PASS','-keypass:env','CACHASTE_SIGN_KEY_PASS','-sigalg','SHA256withRSA','-digestalg','SHA-256','-signedjar',str(args.output),str(args.bundle),config['alias']]
subprocess.run(command,env=env,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True)
subprocess.run(['java','-m','jdk.jartool/sun.security.tools.jarsigner.Main','-verify',str(args.output)],stdout=subprocess.DEVNULL,stderr=subprocess.PIPE,check=True)
cert=subprocess.run(['keytool','-printcert','-jarfile',str(args.output),'-rfc'],capture_output=True,check=True).stdout
actual=x509.load_pem_x509_certificate(cert)
assert actual.fingerprint(hashes.SHA256())==expected.fingerprint(hashes.SHA256()),'Certificado no coincide'
with zipfile.ZipFile(args.output) as z:
    after={n:hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist() if not n.upper().startswith('META-INF/')}
assert before==after,'La firma cambió contenido de aplicación'
print(json.dumps({'output':str(args.output),'certificateSha256':actual.fingerprint(hashes.SHA256()).hex(),'contentPreserved':True,'sha256':hashlib.sha256(args.output.read_bytes()).hexdigest()}))
