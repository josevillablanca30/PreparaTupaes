import {readFile, access} from 'node:fs/promises';
import {createDecipheriv} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

export async function verifyPrivateDistribution({root = fileURLToPath(new URL('../../', import.meta.url)), contentKey = process.env.BANK_CONTENT_KEY} = {}) {
  if (!/^[A-Za-z0-9+/]{43}=$/.test(contentKey || '')) throw Error('BANK_CONTENT_KEY_REQUIRED');
  const dist = path.join(root, 'web/dist');
  const manifest = JSON.parse(await readFile(path.join(root, 'web/artifacts/build-manifest.json'), 'utf8'));
  const routes = JSON.parse(await readFile(path.join(dist, '_routes.json'), 'utf8'));
  if (JSON.stringify(routes.include) !== '["/*"]' || routes.exclude.length) throw Error('ALL_ROUTES_MUST_USE_PREMIUM_GATEWAY');
  let clearDirectory = true;
  try { await access(path.join(dist, 'app')); } catch { clearDirectory = false; }
  if (clearDirectory) throw Error('PLAINTEXT_EDUCATIONAL_FILES_DENIED');
  const worker = await readFile(path.join(dist, '_worker.js'), 'utf8');
  if (worker.includes(contentKey)) throw Error('CONTENT_KEY_EXPOSED_IN_WORKER');
  for (const name of manifest.protectedFiles) {
    const asset = manifest.encryptedFiles[name];
    if (!/^\/app\/[a-zA-Z0-9_./-]+$/.test(name) || name.includes('..') || !/^\/__encrypted\/[a-f\d]{64}\.bin$/.test(asset || '')) throw Error('INVALID_ENCRYPTED_MANIFEST');
    const bytes = await readFile(path.join(dist, asset));
    const cipher = createDecipheriv('aes-256-gcm', Buffer.from(contentKey, 'base64'), bytes.subarray(0, 12));
    cipher.setAAD(Buffer.from(name)); cipher.setAuthTag(bytes.subarray(-16));
    const plain = Buffer.concat([cipher.update(bytes.subarray(12, -16)), cipher.final()]);
    if (!plain.length && name !== '/app/.nojekyll') throw Error('EMPTY_EDUCATIONAL_FILE');
  }
  for (const bank of ['daily-catalog.js', 'm2-bank.js', 'reading-bank.js', 'science-bank.js', 'history-bank.js']) {
    if (!manifest.protectedFiles.includes('/app/' + bank)) throw Error('FIVE_SUBJECT_BANKS_REQUIRED');
  }
  return {authenticatedEncryptedFiles: manifest.protectedFiles.length, plaintextEducationalFiles: 0, keyEmbeddedInWorker: false, routesFailClosed: true};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const contentKey = process.env.BANK_CONTENT_KEY || (process.argv.includes('--local') ? JSON.parse(await readFile(new URL('../.local-bindings.json', import.meta.url), 'utf8')).BANK_CONTENT_KEY : undefined);
    console.log(JSON.stringify(await verifyPrivateDistribution({contentKey})));
  }
  catch (error) { console.error(/^[A-Z_]+$/.test(error.message) ? error.message : 'Encrypted distribution verification failed. Deployment stopped.'); process.exitCode = 1; }
}
