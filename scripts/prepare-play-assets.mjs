// Deterministic Play exports from the existing approved brand and native Android captures.
// No images or competitive fixtures are generated for the store.
import {chromium} from '@playwright/test';
import {readFile,mkdir,copyFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const out=path.resolve(process.argv[2]||'publication-output'),screens=process.argv[3]&&path.resolve(process.argv[3]);
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
await mkdir(out,{recursive:true});
const svgData=async file=>'data:image/svg+xml;base64,'+(await readFile(new URL('../'+file,import.meta.url))).toString('base64');
const browser=await chromium.launch({...(executablePath?{executablePath}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const page=await browser.newPage({viewport:{width:512,height:512},deviceScaleFactor:1});
 const icon=await svgData('assets/cachaste-icon.svg');
 await page.setContent('<html><style>*{box-sizing:border-box}html,body{margin:0;width:512px;height:512px;background:#fbf8ff}img{display:block;width:512px;height:512px}</style><img src="'+icon+'" alt="">');
 await page.locator('img').evaluate(img=>img.decode());await page.screenshot({path:path.join(out,'icono-512.png')});
 await page.setViewportSize({width:1024,height:500});
 const logo=await svgData('assets/competition-logo.svg'),cat=await svgData('assets/competition-cat-vs.svg');
 await page.setContent(`<!doctype html><html lang="es"><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:1024px;height:500px;overflow:hidden}body{background:#faf6ff;color:#291044;font-family:Arial,sans-serif}.logo{position:absolute;left:54px;top:55px;width:405px;height:auto}.cat{position:absolute;right:49px;top:149px;width:345px;height:auto}h1{position:absolute;left:55px;top:205px;font-size:51px;line-height:1.1;letter-spacing:-1.5px;margin:0;font-weight:800;max-width:570px}h1 span{display:block;color:#6f2cbe}p{position:absolute;left:57px;bottom:51px;margin:0;font-size:21px;letter-spacing:-.2px;color:#635371}</style><img class="logo" src="${logo}" alt="¿Cachaste?"><h1>Primero cachémoslo<span>fácil.</span></h1><img class="cat" src="${cat}" alt="Gatito sabio"><p>Lecciones claras. Práctica a tu ritmo.</p></html>`);
 await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));await page.screenshot({path:path.join(out,'grafico-1024x500.png')});
}finally{await browser.close();}
// Play requires a 32-bit PNG icon and a feature graphic without alpha.
execFileSync('python3',['-c',"import sys;from pathlib import Path;from PIL import Image;p=Path(sys.argv[1]);Image.open(p/'icono-512.png').convert('RGBA').save(p/'icono-512.png',optimize=True);Image.open(p/'grafico-1024x500.png').convert('RGB').save(p/'grafico-1024x500.png',optimize=True)",out]);
const captures=[['0-overview.png','01-primero-lo-entendemos.png','Matemática M1: idea inicial'],['0-model.png','02-modelo-visual.png','Matemática M1: modelo visual'],['fractions-friendly.png','03-explicacion-cercana.png','Explicación de fracciones'],['1-overview.png','04-matematica-m2.png','Matemática M2'],['2-overview.png','05-competencia-lectora.png','Competencia Lectora'],['release-history-source-transfer.png','06-historia-y-fuentes.png','Historia y análisis de fuentes'],['4-overview.png','07-ciencias.png','Ciencias'],['release-science-mentions.png','08-menciones-ciencias.png','Elección de mención de Ciencias']];
if(screens){await mkdir(path.join(out,'capturas-telefono'),{recursive:true});for(const[from,to]of captures)await copyFile(path.join(screens,from),path.join(out,'capturas-telefono',to));}
await writeFile(path.join(out,'recursos.json'),JSON.stringify({icon:{file:'icono-512.png',width:512,height:512},feature:{file:'grafico-1024x500.png',width:1024,height:500},screenshots:captures.map(([source,file,description])=>({source,file,width:1080,height:1920,description})),source:'Unmodified Android emulator screen captures; no ranking or duel fixtures. Record exact CI source/run in delivery verification.',competitiveScreenshots:'Pending two real accounts and the hosted commercial configuration.'},null,2)+'\n');
console.log('Exported Play brand resources'+(screens?' and eight native captures.':'; native captures not supplied.'));
