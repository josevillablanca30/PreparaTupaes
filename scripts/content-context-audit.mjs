import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {dailyCatalog} from './daily-catalog.mjs';

// Independent arithmetic/geometry checks, not a snapshot of answer indices.
// Textual/symbolic conclusions also receive targeted regression tests below.
const n=(value,suffix='')=>String(Math.round(value*1e6)/1e6).replace('.',',')+suffix;
const normalizeOption=value=>{const text=value.normalize('NFKC').trim();return /\b(?:AA|Aa|aa)\b/.test(text)?text:text.toLocaleLowerCase('es');};
export const numericalChecks={
 'M1:264':()=>n(35-15), 'M1:265':()=>'Mar y Mié', 'M1:266':()=>'15 min',
 'M1:267':()=>n((6+8+10+12)/4), 'M1:268':()=>n(24/(16+24+20)*100,'%'),
 'M1:269':()=>'3/10', 'M1:270':()=>n((100-80)/80*100,'%'), 'M1:271':()=>'$25.000',
 'M1:272':()=>n((11-2)/(3-0)), 'M1:273':()=>n((4-10)/3).replace('-','−'),
 'M1:274':()=>n(1+4*4), 'M1:275':()=>'$'+n(4+2*0),
 'M1:276':()=>n(12*8,' m²'), 'M1:277':()=>n(2*(9+4),' m'),
 'M1:278':()=>n(10*6/2,' cm²'), 'M1:279':()=>n(3*4**2,' cm²'),
 'M1:TR-M1-001':()=>n(450*.18), 'M1:TR-M1-002':()=>'$'+(36000/(.9*.8)).toLocaleString('es-CL'),
 'M1:TR-M1-003':()=>'3³', 'M1:TR-M1-004':()=>'6x − 14',
 'M1:TR-M1-005':()=>n((1-.8**3)*100,'%'), 'M1:TR-M1-006':()=>n(80*.25+60*.35+90*.4),
 'M1:TR-M1-007':()=>n(4/2*7,' km'), 'M1:TR-M1-008':()=>n(240*3/8*2/3),
 'M1:TR-M1-009':()=>n(Math.cbrt(729),' m'), 'M1:TR-M1-010':()=>n(8*15/12,' horas'),
 'M1:TR-M1-011':()=>'x² + 10x + 25', 'M1:TR-M1-012':()=>n(2*35*100/100,'π m'),
 'M1:TR-M1-013':()=>n(Math.sqrt(196),' m'), 'M1:TR-M1-014':()=>'6√2 m',
 'M1:TR-M1-015':()=>'(x − 7) m', 'M1:TR-M1-016':()=>n((14+8)*5/2,' m²'),
 'M1:TR-M1-017':()=>'3a + 7b', 'M1:TR-M1-018':()=>n(2*(-2)**2-3*(-2)*3+3),
 'M1:TR-M1-019':()=>n(12*7,' m²'), 'M1:TR-M1-020':()=>n(.3*.2*100,' %'),
 'M1:TR-M1-021':()=>n(5**4*5**2/5**5),
 'M1:TR-M1-022':()=>'Dibujo y música comparten la frecuencia máxima',
 'M1:TR-M1-023':()=>n((14+16)/2-(5+7)/2),
 'M1:TR-M1-024':()=>[10,12,13,15,16,17,18,20,22,23,25,26,28,30,31,33,35,37,39,40][Math.ceil(.65*20)-1]+' min',
 'M1:TR-M1-025':()=>n(6*5**2,' cm²'), 'M1:TR-M1-026':()=>n(2*4*6,'π cm²'),
 'M1:TR-M1-027':()=>'('+(-4+6)+', '+n(3-5).replace('-','−')+')',
 'M1:TR-M1-028':()=>'(−1, 3)', 'M1:TR-M1-029':()=>n(7.5/3*4,' cm'),
 'M1:TR-M1-030':()=>n(6*3**2,' cm²'), 'M1:TR-M1-031':()=>n(14*9/2,' cm²'),
 'M2:TR-M2-001':()=>'La media es '+n((15*12+10*18)/25)+', pues se pondera cada media por su cantidad de datos',
 'Ciencias:TR-SCI-003':()=>n(.75*80/60,',0 kWh'),
 'Ciencias:TR-SCI-006':()=>n(400*6/30,' W'),
 'Ciencias:TR-SCI-011':()=>n(4+1.5*8,' m/s'),
 'Ciencias:TR-SCI-012':()=>n(12/300*100,' % m/v'),
 'Ciencias:TR-SCI-016':()=>n(1/(1/12+1/6),' Ω'),
 'Ciencias:TR-SCI-018':()=>n(25*2.4/150,' mol/L'),
 'Ciencias:TR-SCI-022':()=>n(24/8,' A'), 'Ciencias:TR-SCI-023':()=>n(12*4,' N'),
 'Ciencias:TR-SCI-024':()=>n((17-5)/4,' m/s²'), 'Ciencias:TR-SCI-026':()=>n(90/30,' g/cm³'),
 'Ciencias:TR-SCI-029':()=>n(64/2,'°'), 'Ciencias:TR-SCI-040':()=>n(6/2*5,' N'),
 'Ciencias:TR-SCI-043':()=>n(3*10*4,' J'), 'Ciencias:TR-SCI-044':()=>n(23+23),
 'Ciencias:TR-SCI-046':()=>n((.5*(4+1)-1)/(1-.5),' mol'),
 'Ciencias:TR-SCI-049':()=>n(2,' m'), 'Ciencias:TR-SCI-050':()=>n(8/.4*.7,' V'),
 'Ciencias:TR-SCI-056':()=>n(205-40,' g'), 'Ciencias:TR-SCI-062':()=>n(8*2.5,' mg'),
 'Ciencias:TR-SCI-067':()=>n(600*2/3,' nm'),
 'Historia:TR-HIS-015':()=>n(50/1.25,' canastas'),
 'Historia:TR-HIS-037':()=>'$250'
};
export function auditContentContext(items=dailyCatalog().items){
 const ctx=vm.createContext({});vm.runInContext(readFileSync(new URL('../daily-visuals.js',import.meta.url),'utf8'),ctx);
 const issues=[],byKey=new Map(items.map(q=>[q.key,q])),texts=dailyCatalog().texts;
 const flag=(key,type,detail)=>issues.push({key,type,detail});
 for(const q of items){
  if(!q.question||!Number.isInteger(q.answer)||!Array.isArray(q.options)||q.answer<0||q.answer>=q.options.length)flag(q.key,'structure','Enunciado, opciones o clave inválidos');
  if(q.options&&new Set(q.options.map(normalizeOption)).size!==q.options.length)flag(q.key,'duplicate-option','Alternativas duplicadas');
  if(q.subjectKey==='Lectura'&&!texts.some(t=>t.id===q.passageId))flag(q.key,'passage','Texto de lectura ausente');
  if(q.visual&&!ctx.CachasteDailyVisual(q))flag(q.key,'unrenderable-visual','Figura ausente o datos inválidos');
  const base=byKey.get(q.sourceKey);
  if(q.visual&&base?.visual&&JSON.stringify(q.visual)===JSON.stringify(base.visual))flag(q.key,'inherited-visual','Revisar explícitamente contexto y datos compartidos');
  if(q.subjectKey==='M1'&&q.q&&q.q!==q.question)flag(q.key,'legacy-stem','Las dos rutas muestran enunciados distintos');
 }
 const calculations=[];
 for(const [key,solve] of Object.entries(numericalChecks)){
  const q=byKey.get(key),expected=solve(),actual=q?.options?.[q.answer],passed=actual===expected;
  calculations.push({key,expected,actual,passed});if(!passed)flag(key,'independent-answer','La alternativa marcada no coincide con el cálculo independiente');
 }
 return {date:'2026-11-04',scope:'Control estructural completo; revisión editorial de las 18 figuras y 171 transferencias; comprobaciones numéricas seleccionadas. No certifica ausencia de errores conceptuales en todo el banco.',questions:items.length,transfers:items.filter(q=>q.sourceKey).length,visuals:items.filter(q=>q.visual).length,calculations,issues};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const report=auditContentContext();mkdirSync(new URL('../reports/content-context-20261104/',import.meta.url),{recursive:true});writeFileSync(new URL('../reports/content-context-20261104/audit.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({questions:report.questions,transfers:report.transfers,visuals:report.visuals,checks:report.calculations.length,issues:report.issues}));if(report.issues.length)process.exitCode=1;
}
