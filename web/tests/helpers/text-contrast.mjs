// Evaluate in the browser against rendered CSS, including inherited text and
// translucent ancestors. Targets use solid surfaces; this is not a pixel audit
// of text overlapping artwork or gradients.
export function measureTextContrast(selector){
 const rgb=value=>(value.match(/[\d.]+/g)||[]).map(Number);
 const blend=(front,back)=>front.slice(0,3).map((n,i)=>n*(front[3]??1)+back[i]*(1-(front[3]??1)));
 const luminance=color=>color.map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;}).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
 return Array.from(document.querySelectorAll(selector)).filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(element=>{
  let background=[255,255,255];const ancestors=[];
  for(let e=element;e;e=e.parentElement)ancestors.unshift(e);
  for(const e of ancestors){const color=rgb(getComputedStyle(e).backgroundColor);if(color.length>=3)background=blend(color,background);}
  const style=getComputedStyle(element),foreground=blend(rgb(style.color),background),a=luminance(foreground),b=luminance(background),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),size=parseFloat(style.fontSize),large=size>=24||(size>=18.66&&Number(style.fontWeight)>=700),minimum=large?3:4.5;
  return{selector:element.tagName.toLowerCase()+(element.className?'.'+String(element.className).trim().replace(/\s+/g,'.'):''),text:element.textContent.trim().slice(0,90),ratio:Number(ratio.toFixed(3)),minimum,passed:ratio>=minimum};
 });
}
export const PUBLIC_SURFACE_TEXT='.account-card h1,.account-card h2,.account-card p,.account-card label,.account-card input,.account-card select,.account-card .eyebrow,.account-card .auth-divider,.account-card .text-button,.price-card h3,.price-card p,.price-card li,.price-card small,.practice-grid h3,.practice-grid p,.site-footer p,.site-footer a,.site-footer small,.account-footer a,#account-status:not(:empty),.web-dialog h2,.web-dialog p';
