import{build}from'esbuild';
import{mkdir}from'node:fs/promises';
import{dailyCatalog}from'./daily-catalog.mjs';
const path='android/app/src/androidTest/assets';await mkdir(path,{recursive:true});
const q=dailyCatalog().items.find(q=>q.key==='M1:264'),stimulus={key:q.key,question:q.question,options:q.options,visual:q.visual,concept:q.concept};
await build({entryPoints:['tests/helpers/competition-native-fixture.mjs'],outfile:path+'/competition-fixture.js',platform:'browser',bundle:true,minify:true,format:'iife',target:'chrome100',define:{__CACHASTE_QA_STIMULUS__:JSON.stringify(stimulus)}});
console.log('Visual fixture generated in TEST APK assets only; production distribution remains unchanged.');
