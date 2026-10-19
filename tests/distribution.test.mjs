import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {distributionFiles,verifyDistribution} from '../scripts/verify-distribution.mjs';
async function fixture(t){
 const root=await mkdtemp(join(tmpdir(),'cachaste-distribution-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 for(const file of distributionFiles){await mkdir(dirname(join(root,file)),{recursive:true});await writeFile(join(root,file),'fixture');}
 return root;
}
test('Distribución: exige todos los archivos aprobados y rechaza salidas incompletas',async t=>{
 const root=await fixture(t);assert.deepEqual(await verifyDistribution(root),{files:distributionFiles.length});
 await rm(join(root,'daily-catalog.js'));await assert.rejects(verifyDistribution(root),/Distribución incompleta.*daily-catalog/);
});
test('Distribución: rechaza material interno y mapas de fuente aunque el resto sea válido',async t=>{
 const root=await fixture(t);await writeFile(join(root,'study-app.js.map'),'{}');await assert.rejects(verifyDistribution(root),/Archivo no permitido/);await rm(join(root,'study-app.js.map'));
 await mkdir(join(root,'tests'));await assert.rejects(verifyDistribution(root),/Directorio no permitido/);
});
test('Distribución: rechaza enlaces incluso bajo nombres permitidos',async t=>{
 const root=await fixture(t),target=join(root,'index.html');await rm(target);await symlink(join(root,'inicio.html'),target);
 await assert.rejects(verifyDistribution(root),/Enlace no permitido/);
});
