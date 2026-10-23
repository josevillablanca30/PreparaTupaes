import{build}from'esbuild';
import{mkdir}from'node:fs/promises';
const path='android/app/src/androidTest/assets';await mkdir(path,{recursive:true});
await build({entryPoints:['tests/helpers/competition-native-fixture.mjs'],outfile:path+'/competition-fixture.js',platform:'browser',bundle:true,minify:true,format:'iife',target:'chrome100'});
console.log('Visual fixture generated in TEST APK assets only; production distribution remains unchanged.');
