import {mkdir,writeFile} from 'node:fs/promises';
import {renderedContrast} from '../tests/helpers/rendered-contrast.mjs';
await mkdir('android/app/src/androidTest/assets',{recursive:true});
await writeFile('android/app/src/androidTest/assets/work3-contrast.js','('+renderedContrast.toString()+')');
console.log('Generated contrast probe for instrumentation only; never packaged in release.');
