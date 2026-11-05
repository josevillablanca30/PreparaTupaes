#!/usr/bin/env python3
"""Run on the owner's computer/Termux, never in Actions. No secrets in output."""
import argparse
import base64
import getpass
import hashlib
import io
import json
import os
from pathlib import Path
import secrets
import shutil
import subprocess
import tarfile
import tempfile

REPO = 'josevillablanca30/PreparaTupaes'

def run(command, *, env=None, data=None):
    result = subprocess.run(command, input=data, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode:
        raise RuntimeError('No se completó ' + command[0] + '. Los detalles privados no se imprimen.')
    return result.stdout

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--configure-github', action='store_true')
    parser.add_argument('--backup', action='store_true', help='Create an encrypted backup with a separate password entered locally')
    parser.add_argument('--restore-backup', type=Path)
    parser.add_argument('--directory', type=Path, default=Path.home()/'.local/share/cachaste-upload')
    args = parser.parse_args()
    for command in ['keytool'] + (['gh'] if args.configure_github else []):
        if not shutil.which(command):
            raise RuntimeError('Falta instalar: ' + command)
    if args.backup or args.restore_backup:
        try:
            from cryptography.hazmat.primitives.ciphers.aead import AESGCM
        except ImportError:
            raise RuntimeError('Falta instalar python-cryptography.')
    root = args.directory.expanduser().resolve()
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    root.chmod(0o700)
    keyfile, configfile = root/'cachaste-upload.jks', root/'signing.json'
    certfile = root/'upload-certificate.pem'
    if args.restore_backup:
        if keyfile.exists() or configfile.exists():
            raise RuntimeError('La carpeta ya contiene una clave. Usa una carpeta vacía para restaurar.')
        blob=args.restore_backup.read_bytes()
        if not blob.startswith(b'CACHKEY1') or len(blob)>4*1024*1024:
            raise RuntimeError('Formato de respaldo no reconocido.')
        header=blob[:36];salt=blob[8:24];nonce=blob[24:36]
        password=getpass.getpass('Contraseña del respaldo: ')
        derived=hashlib.scrypt(password.encode(),salt=salt,n=32768,r=8,p=1,dklen=32,maxmem=128*1024*1024)
        try:
            plain=AESGCM(derived).decrypt(nonce,blob[36:],header)
        except Exception:
            raise RuntimeError('Contraseña incorrecta o respaldo dañado; no se restauró ninguna clave.')
        with tarfile.open(fileobj=io.BytesIO(plain),mode='r:') as archive:
            allowed={'cachaste-upload.jks','signing.json','upload-certificate.pem'}
            members=archive.getmembers()
            if {m.name for m in members}!=allowed or len(members)!=3 or any(not m.isfile() or m.size>1024*1024 for m in members):
                raise RuntimeError('Contenido del respaldo no reconocido.')
            payloads={m.name:archive.extractfile(m).read() for m in members}
        restored=json.loads(payloads['signing.json'])
        if restored.get('alias')!='cachaste-upload' or any(not isinstance(restored.get(k),str) or len(restored[k])<32 for k in ['storePassword','keyPassword']):
            raise RuntimeError('Configuración de respaldo no reconocida.')
        for name,content in payloads.items():
            with (root/name).open('xb') as handle:
                os.chmod(root/name,0o600);handle.write(content)
    if keyfile.exists() != configfile.exists():
        raise RuntimeError('Respaldo incompleto. No se reemplazará ninguna clave existente.')
    if not keyfile.exists():
        config = {'alias':'cachaste-upload', 'storePassword':secrets.token_urlsafe(36)}
        config['keyPassword'] = config['storePassword']
        env = {**os.environ, 'CACHASTE_LOCAL_STORE_PASS':config['storePassword'], 'CACHASTE_LOCAL_KEY_PASS':config['keyPassword']}
        # Work privately, then install files exclusively. Never replace an existing key.
        with tempfile.TemporaryDirectory(dir=root) as tmp:
            temporary = Path(tmp)/'upload.jks'
            run(['keytool','-genkeypair','-noprompt','-storetype','JKS','-keystore',str(temporary),
                 '-storepass:env','CACHASTE_LOCAL_STORE_PASS','-keypass:env','CACHASTE_LOCAL_KEY_PASS',
                 '-alias',config['alias'],'-keyalg','RSA','-keysize','3072','-validity','10000',
                 '-dname','CN=Cachaste Upload,O=Cachaste,C=CL'],env=env)
            with keyfile.open('xb') as handle:
                os.chmod(keyfile,0o600)
                handle.write(temporary.read_bytes())
            with configfile.open('x') as handle:
                os.chmod(configfile,0o600)
                json.dump(config,handle)
    config = json.loads(configfile.read_text())
    keyfile.chmod(0o600); configfile.chmod(0o600)
    env = {**os.environ,'CACHASTE_LOCAL_STORE_PASS':config['storePassword']}
    der = run(['keytool','-exportcert','-keystore',str(keyfile),'-storepass:env','CACHASTE_LOCAL_STORE_PASS','-alias',config['alias']],env=env)
    pem = run(['keytool','-exportcert','-rfc','-keystore',str(keyfile),'-storepass:env','CACHASTE_LOCAL_STORE_PASS','-alias',config['alias']],env=env)
    certfile.write_bytes(pem)
    fingerprint = hashlib.sha256(der).hexdigest()
    if args.backup:
        backup = root/'Cachaste-upload-backup.enc'
        if not backup.exists():
            password = getpass.getpass('Contraseña del respaldo (mínimo 16 caracteres; guárdala en tu gestor): ')
            if len(password)<16 or password!=getpass.getpass('Repite la contraseña del respaldo: '):
                raise RuntimeError('Contraseñas distintas o demasiado cortas. La clave original se conserva.')
            memory = io.BytesIO()
            with tarfile.open(fileobj=memory,mode='w') as archive:
                for path in [keyfile,configfile,certfile]:
                    archive.add(path,arcname=path.name)
            salt=secrets.token_bytes(16);nonce=secrets.token_bytes(12)
            header=b'CACHKEY1'+salt+nonce
            derived=hashlib.scrypt(password.encode(),salt=salt,n=32768,r=8,p=1,dklen=32,maxmem=128*1024*1024)
            ciphertext=AESGCM(derived).encrypt(nonce,memory.getvalue(),header)
            if AESGCM(derived).decrypt(nonce,ciphertext,header)!=memory.getvalue():
                raise RuntimeError('No se pudo verificar el respaldo cifrado.')
            with backup.open('xb') as handle:
                os.chmod(backup,0o600);handle.write(header+ciphertext)
        print('Respaldo cifrado disponible: '+str(backup))
    if args.configure_github:
        if not (root/'Cachaste-upload-backup.enc').exists():
            raise RuntimeError('Primero crea el respaldo con --backup; no se enviaron secretos.')
        login = json.loads(run(['gh','api','user']))['login']
        if login.lower()!='josevillablanca30':
            raise RuntimeError('Inicia sesión con la cuenta propietaria josevillablanca30. No se enviaron secretos.')
        values = {
            'CACHASTE_RELEASE_KEYSTORE_BASE64':base64.b64encode(keyfile.read_bytes()),
            'CACHASTE_RELEASE_STORE_PASSWORD':config['storePassword'].encode(),
            'CACHASTE_RELEASE_KEY_ALIAS':config['alias'].encode(),
            'CACHASTE_RELEASE_KEY_PASSWORD':config['keyPassword'].encode(),
        }
        for name,value in values.items():
            run(['gh','secret','set',name,'--repo',REPO],data=value)
        print('Los cuatro secretos se guardaron en GitHub Actions.')
    print('Certificado público SHA-256: '+fingerprint)
    print('Clave y configuración privadas: '+str(root))
    print('Conserva fuera de este teléfono el respaldo cifrado y su contraseña por separado.')
    print('Comparte solamente la huella SHA-256. No compartas signing.json ni el keystore.')
    print('El script no modifica la huella esperada del workflow ni publica en Google Play.')

if __name__=='__main__':
    os.umask(0o077)
    try:
        main()
    except RuntimeError as error:
        print(str(error))
        raise SystemExit(1)
    except (ValueError,KeyError,OSError):
        print('No se completó la configuración. Se conservaron los archivos existentes; no se imprimieron secretos.')
        raise SystemExit(1)
