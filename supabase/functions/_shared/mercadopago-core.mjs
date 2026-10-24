export const MP_PLANS=Object.freeze({semanal:{amount:2490,frequency:7,frequency_type:'days'},mensual:{amount:7990,frequency:1,frequency_type:'months'},anual:{amount:64990,frequency:12,frequency_type:'months'}});
const encoder=new TextEncoder();
export const iso=(value)=>Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;
export function periodEnd(start,plan){
 const p=MP_PLANS[plan];if(!p||!iso(start))throw Error('INVALID_PERIOD');
 const d=new Date(start);if(p.frequency_type==='days')d.setUTCDate(d.getUTCDate()+p.frequency);
 else{const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+p.frequency);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));}
 return d.toISOString();
}
export function validatePlan(remote,name,expectedId,{trial=false,collectorId}={}){
 const p=MP_PLANS[name];if(!p||remote?.id!==expectedId||remote.status!=='active'||String(remote.collector_id)!==String(collectorId))throw Error('PLAN_NOT_READY');
 const r=remote.auto_recurring;if(r?.currency_id!=='CLP'||Number(r.transaction_amount)!==p.amount||Number(r.frequency)!==p.frequency||r.frequency_type!==p.frequency_type)throw Error('PLAN_MISMATCH');
 const hasTrial=Number(r.free_trial?.frequency)>0;
 if(trial?(name!=='mensual'||Number(r.free_trial?.frequency)!==7||r.free_trial?.frequency_type!=='days'):hasTrial)throw Error('TRIAL_NOT_CONFIGURED');
 return p;
}
export function checkoutUrl(value){const url=new URL(value);if(url.protocol!=='https:'||!['mercadopago.cl','www.mercadopago.cl','mercadopago.com','www.mercadopago.com','www.mercadopago.com.ar'].includes(url.hostname)||!url.pathname.startsWith('/subscriptions/checkout'))throw Error('INVALID_CHECKOUT_URL');return url.href;}
export function canonicalSubscription(sub,checkout,authorized,payments,{now=Date.now(),collectorId,liveMode=true,existing=null}={}){
 const p=MP_PLANS[checkout.plan];if(!p||String(sub.id)!==String(checkout.provider_id)||sub.external_reference!==checkout.id||sub.preapproval_plan_id!==checkout.provider_plan_id||String(sub.collector_id)!==String(collectorId)||(sub.site_id&&sub.site_id!=='MLC'))throw Error('SUBSCRIPTION_MISMATCH');
 if(sub.auto_recurring?.currency_id!=='CLP'||Number(sub.auto_recurring?.transaction_amount)!==p.amount||Number(sub.auto_recurring?.frequency)!==p.frequency||sub.auto_recurring?.frequency_type!==p.frequency_type)throw Error('SUBSCRIPTION_MISMATCH');
 const approved=[],ledger=[];
 for(const charge of authorized){
  if(String(charge.preapproval_id)!==String(sub.id))throw Error('CHARGE_MISMATCH');
  const payment=payments.find(x=>String(x.id)===String(charge.payment?.id));if(!payment)continue;
  if(String(payment.collector_id)!==String(collectorId)||payment.currency_id!=='CLP'||Number(payment.transaction_amount)!==p.amount||payment.live_mode!==liveMode)throw Error('PAYMENT_MISMATCH');
  const paidAt=iso(payment.date_approved),refunded=Number(payment.transaction_amount_refunded||0)>0;
  const fee=(payment.fee_details||[]).reduce((n,x)=>n+Number(x.amount||0),0);
  if(!Number.isFinite(fee)||fee<0||fee>p.amount)throw Error('INVALID_FEES');
  ledger.push({id:String(payment.id),status:payment.status,amount:p.amount,fee,net:Number((p.amount-fee-Number(payment.transaction_amount_refunded||0)).toFixed(2)),paidAt,liveMode});
  if(charge.status==='processed'&&payment.status==='approved'&&!refunded&&paidAt&&Date.parse(paidAt)<=now+5000)approved.push(periodEnd(paidAt,checkout.plan));
 }
 let paidUntil=approved.sort().at(-1)||null;
 const created=Date.parse(sub.date_created),checkoutCreated=Date.parse(checkout.created_at);
 let trialUntil=null;
 if(checkout.trial_offered&&checkout.plan==='mensual'&&sub.status==='authorized'&&Number.isFinite(created)&&Number.isFinite(checkoutCreated)&&created<=now+5000){trialUntil=new Date(Math.min(created,checkoutCreated)+7*86400000).toISOString();}
 else if(existing?.trial_until&&checkout.trial_offered&&['cancelled','canceled','paused'].includes(sub.status))trialUntil=iso(existing.trial_until);
 if(!['authorized','cancelled','canceled','paused'].includes(sub.status)){paidUntil=null;trialUntil=null;}
 return{userId:checkout.user_id,checkoutId:checkout.id,providerId:String(sub.id),plan:checkout.plan,status:sub.status,paidUntil,trialUntil,renews:sub.status==='authorized',nextPaymentAt:iso(sub.next_payment_date),observedAt:new Date(now).toISOString(),liveMode,payments:ledger};
}
export async function sha256(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function verifyMpSignature(request,secret,now=Date.now()){
 const url=new URL(request.url),id=url.searchParams.get('data.id'),requestId=request.headers.get('x-request-id'),header=request.headers.get('x-signature')||'';
 const matches=[...header.matchAll(/(?:^|,)\s*(ts|v1)=([^,]+)/g)],ts=matches.find(x=>x[1]==='ts')?.[2],sigs=matches.filter(x=>x[1]==='v1').map(x=>x[2]);
 if(!secret||!id||!requestId||!/^\d{10,13}$/.test(ts||'')||!sigs.length)throw Error('INVALID_SIGNATURE');
 const stamp=Number(ts)*(ts.length<=10?1000:1);if(Math.abs(now-stamp)>300000)throw Error('STALE_SIGNATURE');
 const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['verify']);
 const manifest=`id:${id.toLowerCase()};request-id:${requestId};ts:${ts};`;
 for(const signature of sigs){if(!/^[a-f\d]{64}$/i.test(signature))continue;const bytes=Uint8Array.from(signature.match(/../g),x=>parseInt(x,16));if(await crypto.subtle.verify('HMAC',key,bytes,encoder.encode(manifest)))return{id,hash:await sha256(manifest+signature)};}
 throw Error('INVALID_SIGNATURE');
}
export function csvReport(rows){if(rows.length>10000)throw Error('REPORT_TOO_LARGE');const keys=['provider_id','subscription_id','user_id','plan','status','amount_clp','fee_clp','net_clp','paid_at','live_mode'];const cell=x=>'"'+(typeof x==='string'&&/^[\s\uFEFF]*[=+@-]/.test(x)?"'"+x:String(x??'')).replaceAll('"','""')+'"';return '\uFEFF'+[keys.join(','),...rows.map(r=>keys.map(k=>cell(r[k])).join(','))].join('\r\n')+'\r\n';}

// Calendar dates are Chilean dates, including winter time and the midnight DST transition.
export function chileDateRange(fromDate,toDate){
 const valid=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 if(!valid(fromDate)||!valid(toDate)||toDate<fromDate)throw Error('INVALID_REPORT_RANGE');
 const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santiago',year:'numeric',month:'2-digit',day:'2-digit'});
 const dayAt=seconds=>{const p=Object.fromEntries(formatter.formatToParts(new Date(seconds*1000)).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day;};
 const firstInstant=date=>{const anchor=Date.parse(date)/1000;let low=anchor-36*3600,high=anchor+36*3600;while(low<high){const mid=Math.floor((low+high)/2);if(dayAt(mid)<date)low=mid+1;else high=mid;}return low*1000;};
 const after=new Date(Date.parse(toDate)+86400000).toISOString().slice(0,10),from=firstInstant(fromDate),to=firstInstant(after);
 if(to<=from||to-from>367*86400000)throw Error('INVALID_REPORT_RANGE');return{from:new Date(from).toISOString(),to:new Date(to).toISOString()};
}
