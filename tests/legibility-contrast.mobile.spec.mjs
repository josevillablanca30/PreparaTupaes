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
  await page.locator('.stage-banner [data-action=units]').click();
  await page.locator('[data-action=stage][data-stage=basics]').click();
  await page.locator('[data-action=basic-level]').first().click();
  await page.locator('[data-action=basic-start]').click();
  await expect(page.locator('.lesson-text').first()).toBeVisible();
  const results=await page.evaluate(()=>{
    const selectors=['.wise-cat p','.daily-options button','.visual-choices button','.worked-board li p','.lesson-text'];
    const rgb=s=>{const m=s.match(/rgba?\(([^)]+)\)/);return m?m[1].split(',').slice(0,3).map(Number):null;};
    const out=[];
    for(const selector of selectors)for(const el of document.querySelectorAll(selector)){
      const box=el.getBoundingClientRect();if(!box.width||!box.height)continue;
      const style=getComputedStyle(el);const fg=rgb(style.webkitTextFillColor!=='currentcolor'?style.webkitTextFillColor:style.color)||rgb(style.color);
      let node=el,bg=null;
      while(node){const c=getComputedStyle(node).backgroundColor,v=rgb(c);if(v&&Number((c.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)/)||[])[1]??1)>.95){bg=v;break;}node=node.parentElement;}
      if(fg&&bg)out.push({selector,text:(el.textContent||'').trim().slice(0,55),fg,bg});
    }
    return out;
  });
  expect(results.some(item=>item.selector==='.lesson-text'),'No se auditó texto educativo').toBe(true);
  for(const item of results)expect(contrast(item.fg,item.bg),JSON.stringify(item)).toBeGreaterThanOrEqual(4.5);
});

test('Estados de alternativas y burbujas mantienen contraste aun sin responder',async({page})=>{
  await page.goto('./inicio.html');
  const states=await page.evaluate(()=>{
    const root=document.querySelector('#daily-root');
    if(!root)throw Error('No existe #daily-root');
    const host=document.createElement('section');
    host.style.cssText='position:fixed;top:0;left:0;z-index:9999;background:#fff;padding:8px';
    host.innerHTML='<div class="daily-options"><button>Normal</button><button aria-pressed="true">Seleccionada</button><button class="correct" disabled>Correcta</button><button class="wrong" disabled>Incorrecta</button></div><div class="wise-cat"><p>Explicación del tutor</p></div><div class="visual-choices"><button>Mini práctica</button><button class="right">Acierto</button><button class="try-again">Reintentar</button></div><div class="studio-options"><button class="studio-choice">Estudio</button><button class="studio-choice studio-right">Bien</button><button class="studio-choice studio-wrong">Error</button></div>';
    root.append(host);
    const rgb=value=>{const match=value.match(/rgba?\(([^)]+)\)/);return match?match[1].split(',').slice(0,3).map(Number):null;};
    const items=[...host.querySelectorAll('button,p')].map(el=>{
      const style=getComputedStyle(el);
      const foreground=rgb(style.webkitTextFillColor==='currentcolor'?style.color:style.webkitTextFillColor)||rgb(style.color);
      let node=el,background;
      while(node&&!background){const v=getComputedStyle(node).backgroundColor;if(v==='rgb(255, 255, 255)'||v.startsWith('rgb('))background=rgb(v);node=node.parentElement;}
      return {label:el.textContent,foreground,background};
    });
    host.remove();
    return items;
  });
  expect(states).toHaveLength(11);
  for(const state of states){
    expect(state.foreground,JSON.stringify(state)).toBeTruthy();
    expect(state.background,JSON.stringify(state)).toBeTruthy();
    expect(contrast(state.foreground,state.background),JSON.stringify(state)).toBeGreaterThanOrEqual(4.5);
  }
});
