import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
const require=createRequire(import.meta.url),{PNG}=require(path.join(path.dirname(require.resolve('playwright-core/package.json')),'lib/utilsBundle.js'));
test('landing cutout preserves every source RGB pixel, resolution, eyes and beard',()=>{
 const svg=readFileSync('assets/competition-cat-rank.svg','utf8'),raw=Buffer.from(svg.match(/href="data:image\/png;base64,([^"]+)"/)[1],'base64');
 const original=PNG.sync.read(raw),cutout=PNG.sync.read(readFileSync('web/public/assets/landing-cat-rank-cutout.png'));
 assert.equal(cutout.width,408);assert.equal(cutout.height,278);assert.equal(original.width,cutout.width);assert.equal(original.height,cutout.height);
 let transparent=0;
 for(let i=0;i<original.data.length;i+=4){for(let c=0;c<3;c++)assert.equal(cutout.data[i+c],original.data[i+c],'Original RGB pixel '+i);if(cutout.data[i+3]===0)transparent++;}
 assert.ok(transparent>40000);
 for(const[x,y]of[[165,123],[249,152],[205,226]])assert.equal(cutout.data[(y*408+x)*4+3],255,'Preserve face and beard');
 for(const[x,y]of[[0,0],[407,0],[407,180]])assert.equal(cutout.data[(y*408+x)*4+3],0,'Remove exterior background');
});
