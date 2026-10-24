// Exercise the original competitive security suite against the additive web schema.
import{readFile}from'node:fs/promises';
const original=await readFile(new URL('../../tests/competition-security.test.mjs',import.meta.url),'utf8');
const helper=new URL('./database.mjs',import.meta.url).href;
await import('data:text/javascript;base64,'+Buffer.from(original.replace("'./helpers/competition-db.mjs'",JSON.stringify(helper))).toString('base64'));
