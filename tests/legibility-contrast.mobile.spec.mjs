import { test, expect } from '@playwright/test';

// Prevent white-on-white and dark-on-dark regressions across shared teaching UI.
function contrast(a,b){
  const luminance=c=>{const v=c/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};
  const l=rgb=>.2126*luminance(rgb[0])+.7152*luminance(rgb[1])+.0722*luminance(rgb[2]);
  const x=l(a),y=l(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
test('Tutor, alternativas y desarrollos conservan contraste de texto AA',async({page})=>{
  await page.goto('./inicio.html');
  await page.locator('[data-action=pick-course][data-subject="M1"]').click();
  if(await page.locator('[data-action=game-mode]').count())await page.locator('[data-action=game-mode]').click();
  const results=await page.evaluate(()=>{
    const selectors=['.wise-cat p','.daily-options button','.visual-choices button','.worked-board li p','.lesson-text'];
    const rgb=s=>{const m=s.match(/rgba?\\(([^)]+)\\)/);return m?m[1].split(',').slice(0,3).map(Number):null;};
    const out=[];
    for(const selector of selectors)for(const el of document.querySelectorAll(selector)){
      const box=el.getBoundingClientRect();if(!box.width||!box.height)continue;
      const style=getComputedStyle(el);const fg=rgb(style.webkitTextFillColor!=='currentcolor'?style.webkitTextFillColor:style.color)||rgb(style.color);
      let node=el,bg=null;
      while(node){const c=getComputedStyle(node).backgroundColor,v=rgb(c);if(v&&Number((c.match(/rgba\\([^,]+,[^,]+,[^,]+,\\s*([^)]+)/)||[])[1]??1)>.95){bg=v;break;}node=node.parentElement;}
      if(fg&&bg)out.push({selector,text:(el.textContent||'').trim().slice(0,55),fg,bg});
    }
    return out;
  });
  for(const item of results)expect(contrast(item.fg,item.bg),JSON.stringify(item)).toBeGreaterThanOrEqual(4.5);
});
