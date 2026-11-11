// Runs in the browser. Measures painted text (including WebView text fill),
// alpha layers and every computed gradient endpoint. Using the worst endpoint
// is conservative; screenshots review the diagrams and artwork separately.
export function renderedContrast(selector){
 const rgba=value=>{const m=value?.match(/^rgba?\(([^)]+)\)$/);if(!m)return null;const n=m[1].split(/[, /]+/).map(Number);return[n[0],n[1],n[2],n[3]??1];};
 const over=(fg,bg)=>fg.slice(0,3).map((n,i)=>n*fg[3]+bg[i]*(1-fg[3])).concat(1);
 const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 const results=[];
 for(const el of document.querySelectorAll(selector)){
  const style=getComputedStyle(el),rect=el.getBoundingClientRect();
  if(!rect.width||!rect.height||style.visibility==='hidden'||el.closest('[aria-hidden=true]')||style.clipPath==='inset(50%)')continue;
  const text=Array.from(el.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join(' ').trim()||(el.matches('input,textarea')?(el.value||el.placeholder):'');
  if(!text)continue;
  const chain=[];for(let n=el;n;n=n.parentElement)chain.unshift(getComputedStyle(n));
  let backgrounds=[[255,255,255,1]],opacity=1;
  for(const layer of chain){
   const fill=rgba(layer.backgroundColor);if(fill)backgrounds=backgrounds.map(b=>over(fill,b));
   const stops=[...layer.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map(m=>rgba(m[0])).filter(Boolean);
   if(stops.length)backgrounds=backgrounds.flatMap(b=>stops.map(s=>over(s,b)));
   // Identical opaque descendants collapse the possible ancestor backgrounds.
   backgrounds=[...new Map(backgrounds.map(b=>[b.join(','),b])).values()];
   opacity*=Number(layer.opacity);
  }
  const foreground=rgba(el instanceof SVGElement?style.fill:style.webkitTextFillColor)||rgba(style.color);
  if(!foreground)throw Error('Unmeasurable foreground: '+text);
  foreground[3]*=opacity;
  const minimum=4.5; // These controls and teaching texts retain the normal-text AA threshold.
  const contrast=Math.min(...backgrounds.map(b=>ratio(over(foreground,b),b)));
  results.push({element:el.tagName.toLowerCase()+'.'+String(el.className?.baseVal??el.className).trim().replace(/\s+/g,'.'),text:text.slice(0,100),color:style.color,textFill:style.webkitTextFillColor,backgrounds,opacity,size:parseFloat(style.fontSize),ratio:Number(contrast.toFixed(3)),minimum,passed:contrast>=minimum});
 }
 return results;
}
