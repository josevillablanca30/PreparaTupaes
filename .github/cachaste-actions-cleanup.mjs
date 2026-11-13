import {readFile} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';

const base = 'https://api.github.com/repos/josevillablanca30/PreparaTupaes/actions/artifacts';
const approved = JSON.parse(await readFile(new URL('./cachaste-actions-cleanup.json', import.meta.url), 'utf8'));
const protectedIds = new Set([12505271434, 13821445714, 13857781378, 14029401069, 14030515024, 14033634575, 14034921361]);
const temporaryName = /^(cachaste-web-commercial-preview-|Cachaste-Web-Pages-)[a-f0-9]{40}$/;
const ids = new Set(approved.map(row => row[0]));
if (!process.env.GH_TOKEN || approved.length !== 106 || ids.size !== approved.length ||
    approved.some(([id, name]) => protectedIds.has(id) || !temporaryName.test(name))) {
  throw Error('Lista de artefactos temporales inválida');
}

async function request(path, method = 'GET') {
  const headers = {authorization: 'Bearer ' + process.env.GH_TOKEN, accept: 'application/vnd.github+json'};
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(base + path, {method, headers, redirect: 'error', signal: AbortSignal.timeout(18000)});
    if (response.status === 429 || (response.status === 403 && response.headers.has('retry-after'))) {
      const retry = Number(response.headers.get('retry-after') || '60');
      await response.body?.cancel();
      await delay(Math.min(Math.max(retry, 1), 60) * 1000);
      continue;
    }
    return response;
  }
  throw Error('GitHub mantuvo el límite de solicitudes');
}

const inventory = new Map();
for (let page = 1; ; page++) {
  const response = await request('?per_page=100&page=' + page);
  if (!response.ok) throw Error('Inventario HTTP ' + response.status);
  for (const artifact of (await response.json()).artifacts) inventory.set(artifact.id, artifact);
  if (!response.headers.get('link')?.includes('rel="next"')) break;
}
for (const id of protectedIds) {
  if (!inventory.has(id)) console.log('Evidencia protegida no listada', id);
}
for (const [id, name, runId, branch, sha, bytes] of approved) {
  const item = inventory.get(id);
  if (item && (item.name !== name || item.workflow_run.id !== runId ||
      item.workflow_run.head_branch !== branch || item.workflow_run.head_sha !== sha ||
      item.size_in_bytes !== bytes)) throw Error('Cambió el artefacto ' + id);
}

let removed = 0, bytesRemoved = 0, alreadyAbsent = 0;
const errors = [];
for (const [id, , , , , bytes] of approved) {
  if (!inventory.has(id)) {
    alreadyAbsent++;
    continue;
  }
  const response = await request('/' + id, 'DELETE');
  if (response.status === 204) {
    removed++;
    bytesRemoved += bytes;
    console.log('Eliminado', id, bytes);
  } else if (response.status === 404) {
    alreadyAbsent++;
  } else {
    errors.push([id, response.status]);
    console.log('Sin eliminar', id, response.status);
    if (response.status === 401 || response.status === 403) break;
  }
  await delay(1250);
}
for (const id of [13857781378, 14029401069, 14033634575]) {
  const response = await request('/' + id);
  console.log('Verificación de archivo protegido', id, response.status);
  if (response.status !== 200) errors.push([id, response.status]);
}
console.log(JSON.stringify({removed, bytesRemoved, alreadyAbsent, errors}));
if (errors.length) process.exitCode = 1;
