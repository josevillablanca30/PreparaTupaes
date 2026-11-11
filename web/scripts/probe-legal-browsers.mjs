import {chromium,webkit,devices} from '@playwright/test';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {previewUrl,publicSiteUrl} from './pages-client.mjs';
import {measureTextContrast,PUBLIC_SURFACE_TEXT} from '../tests/helpers/text-contrast.mjs';
const isPublic=process.argv.includes('--public');
const deployed=JSON.parse(await readFile(isPublic?'web/artifacts/pages-public.json':'web/artifacts/pages-preview.json','utf8'));
const origin=(isPublic?publicSiteUrl:previewUrl)(deployed.url);
if(deployed.deployment?.id==null||deployed.revision!==process.env.GITHUB_SHA)throw Error('VERIFIED_PREVIEW_REQUIRED');
const revision=process.env.GITHUB_SHA;
if(!/^[a-f\d]{40}$/.test(revision||''))throw Error('EXACT_REVISION_REQUIRED');
const version=await fetch(origin+'/version.json',{signal:AbortSignal.timeout(20000)}).then(r=>r.json());
if(version.revision!==revision||version.paymentsEnabledByBuild!==false)throw Error('DEPLOYED_REVISION_OR_BILLING_MISMATCH');
await mkdir('web/artifacts/legal-live',{recursive:true});
const pages=[['privacidad','Política de privacidad'],['condiciones','Condiciones de uso'],['eliminar-cuenta','Eliminar cuenta y datos']];
const checks=[];
for(const[name,engine,use]of[['Desktop-Chrome',chromium,{viewport:{width:1365,height:900}}],['Android-Chrome',chromium,devices['Pixel 7']],['iPhone-WebKit',webkit,devices['iPhone 13']],['mobile-320px',chromium,{viewport:{width:320,height:700},isMobile:true,hasTouch:true}]]){
 const browser=await engine.launch({headless:true}),context=await browser.newContext({...use,locale:'es-CL'}),page=await context.newPage();page.setDefaultTimeout(20000);
 try{
  for(const[slug,title]of pages){
   try{
    const response=await page.goto(origin+'/'+slug+'.html',{waitUntil:'networkidle'});
    if(response.status()!==200||new URL(page.url()).origin!==origin)throw Error('PUBLIC_HTTPS_200_REQUIRED');
    if((await page.locator('h1').textContent()).trim()!==title)throw Error('LEGAL_CONTENT_NOT_LANDING');
    if(!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)))throw Error('MOBILE_LAYOUT_OR_IMAGE_FAILED');
    if((await context.cookies()).some(c=>c.name==='cachaste_web_session'))throw Error('LEGAL_ACCESS_MUST_BE_ANONYMOUS');
    for(const[target]of pages)if(!await page.locator('main .legal-nav a[href="/'+target+'.html"]').isVisible())throw Error('LEGAL_NAVIGATION_MISSING');
    if(slug==='eliminar-cuenta'&&!(await page.getByRole('link',{name:'Solicitar eliminación de mi cuenta',exact:true}).getAttribute('href')).startsWith('mailto:jose.villablanca.horta@gmail.com?subject=Eliminar'))throw Error('EXTERNAL_DELETION_PATH_MISSING');
    await page.screenshot({path:'web/artifacts/legal-live/'+name+'-'+slug+'.png',fullPage:true,animations:'disabled'});
    checks.push({browser:name,path:'/'+slug+'.html',status:response.status(),anonymous:true,passed:true});
   }catch{checks.push({browser:name,path:'/'+slug+'.html',passed:false});}
  }
  for(const entry of['/','/cuenta.html','/recuperar']){
   try{await page.goto(origin+entry);for(const[slug]of pages){const link=page.locator('footer a[href="/'+slug+'.html"]');if(!await link.isVisible())throw Error('LEGAL_LINK_MISSING');}await page.locator('footer a[href="/eliminar-cuenta.html"]').click();await page.getByRole('heading',{name:'Eliminar cuenta y datos',exact:true}).waitFor();checks.push({browser:name,entry,footerNavigation:true,passed:true});}
   catch{checks.push({browser:name,entry,footerNavigation:true,passed:false});}
  }
  if(isPublic)for(const[path,title]of[['/','Te lo dejamos clarito para un buen resultado.'],['/cuenta.html','Tu preparación comienza aquí.'],['/recuperar','Recupera tu contraseña.']]){
   let measurements=[];
   try{
    const response=await page.goto(origin+path,{waitUntil:'networkidle'});
    if(response.status()!==200)throw Error('PUBLIC_HTTPS_REQUIRED');
    await page.getByRole('heading',{name:title,exact:true}).waitFor();
    measurements=await page.evaluate(measureTextContrast,PUBLIC_SURFACE_TEXT);
    if(measurements.length<9||measurements.some(x=>!x.passed))throw Error('PUBLIC_TEXT_CONTRAST_FAILED');
    await page.screenshot({path:'web/artifacts/legal-live/'+name+'-readable-'+(path==='/'?'landing':path.includes('cuenta')?'account':'recovery')+'.png',fullPage:!name.includes('iPhone')});
    checks.push({browser:name,path,renderedTextContrast:true,textSamples:measurements.length,minimumRatio:Math.min(...measurements.map(x=>x.ratio)),passed:true});
   }catch(error){
    await page.screenshot({path:'web/artifacts/legal-live/'+name+'-failed-'+(path==='/'?'landing':path.includes('cuenta')?'account':'recovery')+'.png',fullPage:false}).catch(()=>{});
    checks.push({browser:name,path,renderedTextContrast:true,passed:false,reason:error.message.split('\n')[0],observedHeading:await page.locator('h1').allTextContents().catch(()=>[]),textSamples:measurements.length,contrastFailures:measurements.filter(x=>!x.passed)});
   }
  }
 }finally{await context.close();await browser.close();}
}
if(isPublic){
 const browser=await chromium.launch({headless:true}),context=await browser.newContext({javaScriptEnabled:false,locale:'es-CL',viewport:{width:1365,height:900}}),page=await context.newPage();page.setDefaultTimeout(20000);
 try{for(const[slug,title]of pages){
  try{
   const r=await page.goto(origin+'/'+slug+'.html',{waitUntil:'networkidle'});
   if(r.status()!==200||(await page.locator('h1').textContent()).trim()!==title)throw Error('LEGAL_PAGE_REQUIRED_WITHOUT_JAVASCRIPT');
   if(await page.locator('a[href^="mailto:jose.villablanca.horta@gmail.com"]').count()<1)throw Error('DIRECT_LEGAL_CONTACT_REQUIRED');
   if(slug==='eliminar-cuenta'&&!(await page.getByRole('link',{name:'Solicitar eliminación de mi cuenta',exact:true}).getAttribute('href')).startsWith('mailto:jose.villablanca.horta@gmail.com?subject=Eliminar'))throw Error('DIRECT_DELETION_PATH_REQUIRED');
   await page.screenshot({path:'web/artifacts/legal-live/no-js-'+slug+'.png',fullPage:true,animations:'disabled'});
   checks.push({browser:'Desktop-Chrome',javaScriptEnabled:false,path:'/'+slug+'.html',contactIsDirect:true,passed:true});
  }catch{checks.push({browser:'Desktop-Chrome',javaScriptEnabled:false,path:'/'+slug+'.html',passed:false});}
 }}finally{await context.close();await browser.close();}
}
const report={origin,revision,checkedAt:new Date().toISOString(),environment:'real public Cloudflare deployment',physicalPhones:false,authenticatedAccountsUsed:false,requestEmailSent:false,passed:checks.every(x=>x.passed),checks};
await writeFile('web/artifacts/legal-live/report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({origin,revision,passed:report.passed,checks:checks.length}));
if(!report.passed)process.exitCode=1;
