import {expect} from '@playwright/test';
// Measure rendered foreground over ancestor surfaces, including translucent fills and gradient stops.
// Decorative image pixels are reviewed in captures; this check does not claim a complete accessibility audit.
export async function readable(locator){
 await expect.poll(async()=>{const ratio=await locator.evaluate(el=>{
  if(!el.isConnected||!getComputedStyle(el).color)return null;
  const rgba=value=>{const n=value.match(/[\d.]+/g).map(Number);return[n[0],n[1],n[2],n[3]??1];};
  const over=(fg,bg)=>fg.slice(0,3).map((v,i)=>v*fg[3]+bg[i]*(1-fg[3])).concat(1);
  const light=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  const chain=[];for(let n=el;n;n=n.parentElement)chain.unshift(getComputedStyle(n));let backgrounds=[[255,255,255,1]];
  for(const style of chain){const fill=rgba(style.backgroundColor);backgrounds=backgrounds.map(bg=>over(fill,bg));const stops=[...style.backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map(m=>rgba(m[0]));if(stops.length)backgrounds=backgrounds.flatMap(bg=>stops.map(stop=>over(stop,bg)));}
  const fg=rgba(getComputedStyle(el).color);return Math.min(...backgrounds.map(bg=>{const f=light(over(fg,bg)),b=light(bg);return(Math.max(f,b)+.05)/(Math.min(f,b)+.05);}));
 });return ratio??0;}).toBeGreaterThanOrEqual(4.5);
}
