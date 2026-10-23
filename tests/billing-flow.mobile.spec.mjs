import {test,expect} from '@playwright/test';
async function setup(page,{ready=true,cancel=false,pending=false,lost=false}={}){
 await page.route('**/competition-config.js',r=>r.fulfill({contentType:'text/javascript',body:"window.CACHASTE_COMPETITION_CONFIG={billingReady:true,supabaseUrl:'https://jmobinmdwrmdqrxtcruj.supabase.co'};"}));
 await page.route('**/competition-client.js',r=>r.fulfill({contentType:'text/javascript',body:`window.testCalls=[];window.verifiedPremium=false;window.lostOnce=${lost};window.CachasteCompetitionClient={CompetitionClient:class{constructor(){this.user={id:'10000000-0000-4000-8000-000000000001'};this.sdk={functions:{invoke:async(_name,{body})=>{testCalls.push(body.action);if(window.lostOnce&&body.action==='verify'){window.lostOnce=false;return{error:{}};}if(body.action==='verify')window.verifiedPremium=true;return{data:{premium:window.verifiedPremium}};}}};}async connect(){this.premium=window.verifiedPremium;}}};` }));
 await page.route('https://jmobinmdwrmdqrxtcruj.supabase.co/functions/v1/cachaste-play',r=>r.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({ready})}));
 await page.addInitScript(({cancel,pending})=>{
  window.nativeCalls=[];
  window.CachastePlay={postMessage(raw){const message=JSON.parse(raw);nativeCalls.push(message);let data;
   if(message.action==='offers')data=[{id:'mensual:trial',basePlan:'mensual',phases:[{micros:0,currency:'CLP',period:'P7D',price:'$0'},{micros:7990000000,currency:'CLP',period:'P1M',price:'$7.990'}]}];
   else data={purchases:pending?[]:[{purchaseToken:'only-a-test-fixture-receipt'}],pending};
   setTimeout(()=>window.CachastePlay.onmessage({data:JSON.stringify({id:message.id,error:cancel&&message.action==='purchase'?'USER_CANCELED':null,data})}),0);
  }};
 },{cancel,pending});
 await page.goto('suscripcion.html');
}
test('server readiness gates purchases even when the native bridge exists',async({page})=>{
 await setup(page,{ready:false});await expect(page.locator('#subscribe')).toBeDisabled();await expect(page.locator('#billing-status')).toContainText('pendiente de configuración');expect(await page.evaluate(()=>nativeCalls.length)).toBe(0);
});
test('only an explicit tap launches the selected eligible Play offer and a server-verifiable receipt',async({page})=>{
 await setup(page);await expect(page.locator('#subscribe')).toBeEnabled();expect(await page.evaluate(()=>nativeCalls.map(x=>x.action))).toEqual(['offers']);
 await expect(page.locator('#store-offer')).toContainText('7 días gratis, luego $7.990 CLP / mes');await page.locator('#subscribe').click();await expect(page.locator('#billing-status')).toContainText('suscripción está validada');
 expect(await page.evaluate(()=>nativeCalls[1])).toMatchObject({action:'purchase',userId:'10000000-0000-4000-8000-000000000001',offer:'mensual:trial'});expect(await page.evaluate(()=>testCalls)).toEqual(['verify','refresh']);
});
test('pending payment does not grant access and cancellation sends no receipt to the server',async({page})=>{
 await setup(page,{pending:true});await expect(page.locator('#subscribe')).toBeEnabled();await page.locator('#subscribe').click();await expect(page.locator('#billing-status')).toContainText('procesando el pago');expect(await page.evaluate(()=>verifiedPremium)).toBe(false);
});
test('cancellation leaves the account unverified without another purchase',async({page})=>{
 await setup(page,{cancel:true});await expect(page.locator('#subscribe')).toBeEnabled();await page.locator('#subscribe').click();await expect(page.locator('#billing-status')).toContainText('Cancelaste la compra');expect(await page.evaluate(()=>testCalls)).toEqual([]);
});
test('a lost verification reply can be recovered through Restore without a second purchase',async({page})=>{
 await setup(page,{lost:true});await expect(page.locator('#subscribe')).toBeEnabled();await page.locator('#subscribe').click();await expect(page.locator('#billing-status')).toContainText('no contrates de nuevo');await page.locator('#restore').click();await expect(page.locator('#billing-status')).toContainText('suscripción está validada');
 expect(await page.evaluate(()=>nativeCalls.filter(x=>x.action==='purchase').length)).toBe(1);expect(await page.evaluate(()=>nativeCalls.at(-1).action)).toBe('restore');
});
