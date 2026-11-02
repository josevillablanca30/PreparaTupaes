import {expect} from '@playwright/test';
export async function readable(locator){
 const ratio=await locator.evaluate(el=>{const rgba=v=>{const n=v.match(/[\d.]+/g).map(Number);return[n[0],n[1],n[2],n[3]??1];};const fg=rgba(getComputedStyle(el).color);let bg;for(let n=el;n;n=n.parentElement){const c=rgba(getComputedStyle(n).backgroundColor);if(c[3]===1){bg=c;break;}}if(!bg)throw new Error('No opaque reading surface found');const light=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);const f=light(fg),b=light(bg);return(Math.max(f,b)+.05)/(Math.min(f,b)+.05);});expect(ratio).toBeGreaterThanOrEqual(4.5);
}
