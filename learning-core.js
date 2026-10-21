/* Shared, offline learning rules. No network, accounts, or paid services. */
(function (global) {
  'use strict';
  const concept = q => q.concept || q.topic || q.skill || q.area;
  // Content identifier only. This is not a signature, purchase check, or anti-tamper mechanism.
  function contentHash(text) {
    const bytes=Array.from(unescape(encodeURIComponent(text)),c=>c.charCodeAt(0)),length=bytes.length;
    bytes.push(128);while(bytes.length%64!==56)bytes.push(0);
    for(let i=7;i>=0;i--)bytes.push(Math.floor(length*8/2**(i*8))&255);
    const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const rotate=(x,n)=>(x>>>n)|(x<<(32-n));
    for(let offset=0;offset<bytes.length;offset+=64){
      const w=[];for(let i=0;i<16;i++)w[i]=(bytes[offset+i*4]<<24)|(bytes[offset+i*4+1]<<16)|(bytes[offset+i*4+2]<<8)|bytes[offset+i*4+3];
      for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(rotate(a,7)^rotate(a,18)^(a>>>3))+w[i-7]+(rotate(b,17)^rotate(b,19)^(b>>>10)))|0;}
      let [a,b,c,d,e,f,g,j]=h;
      for(let i=0;i<64;i++){const t1=(j+(rotate(e,6)^rotate(e,11)^rotate(e,25))+((e&f)^(~e&g))+k[i]+w[i])|0,t2=((rotate(a,2)^rotate(a,13)^rotate(a,22))+((a&b)^(a&c)^(b&c)))|0;j=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
      h=h.map((v,i)=>(v+[a,b,c,d,e,f,g,j][i])|0);
    }
    return h.map(v=>(v>>>0).toString(16).padStart(8,'0')).join('');
  }
  const versionCache=new WeakMap();
  function assessmentVersion(q) {
    const source=JSON.stringify([q.question||q.q||'',q.options,q.answer,concept(q)||null,q.transferGroup||String(q.id),q.passageId||null,q.passageVersion||null,q.visual||null]);
    const cached=versionCache.get(q);if(cached?.source===source)return cached.version;
    const version='a1-'+contentHash(source);versionCache.set(q,{source,version});return version;
  }
  function bindPassages(bank,passages){const versions=new Map(passages.map(p=>[p.id,contentHash(JSON.stringify([p.title,p.paragraphs]))]));for(const q of bank)if(q.passageId)q.passageVersion=versions.get(q.passageId)||'missing';}
  function assessmentSnapshot(q) {
    return {id:q.id,assessmentVersion:assessmentVersion(q),question:q.question||q.q||'',options:[...q.options],answer:q.answer,concept:concept(q)||null,transferGroup:q.transferGroup||String(q.id),area:q.area||null,passageId:q.passageId||null,passageVersion:q.passageVersion||null,visual:q.visual==null?null:JSON.parse(JSON.stringify(q.visual))};
  }
  // Recover only exact, self-consistent snapshots: never reinterpret an old answer with a new key.
  function archivedSessionQuestions(session) {
    if (!session || !Array.isArray(session.ids) || !Array.isArray(session.assessmentVersions) ||
        !Array.isArray(session.questionSnapshots) || !session.ids.length ||
        session.ids.length!==session.assessmentVersions.length ||
        session.ids.length!==session.questionSnapshots.length) return null;
    const seen=new Set(),recovered=[];
    for (let i=0;i<session.ids.length;i++) {
      const q=session.questionSnapshots[i],id=session.ids[i],version=session.assessmentVersions[i];
      if (!q || typeof q!=='object' || String(q.id)!==String(id) || seen.has(String(id)) ||
          typeof q.question!=='string' || !Array.isArray(q.options) ||
          q.options.length<2 || q.options.some(x=>typeof x!=='string') ||
          !Number.isInteger(q.answer) || q.answer<0 || q.answer>=q.options.length ||
          !/^a1-[a-f0-9]{64}$/.test(version) || assessmentVersion(q)!==version) return null;
      seen.add(String(id));
      recovered.push({...q,options:[...q.options],visual:q.visual==null?null:JSON.parse(JSON.stringify(q.visual))});
    }
    return recovered;
  }
  function priorAssessment(q,version){
    const requested=version||q?.legacyAssessmentVersion;
    return (q?.previousAssessments||[]).find(old=>old.assessmentVersion===requested&&assessmentVersion(old)===requested)||null;
  }
  function freezeSession(s,bank){
    if(!s||!Array.isArray(s.ids))return s;
    const byId=new Map(bank.map(q=>[String(q.id),q]));
    s.assessmentVersions=s.ids.map(id=>assessmentVersion(byId.get(String(id))));
    s.questionSnapshots=s.ids.map(id=>{const q=byId.get(String(id));return JSON.parse(JSON.stringify({...q,...assessmentSnapshot(q),previousAssessments:undefined}));});return s;
  }
  function restoreSession(s,bank){
    if(!s||!Array.isArray(s.ids)||s.questionSnapshots)return s;
    const byId=new Map(bank.map(q=>[String(q.id),q])),questions=[];
    if(!s.ids.some(id=>byId.get(String(id))?.previousAssessments?.length))return s;
    for(let i=0;i<s.ids.length;i++){
      const q=byId.get(String(s.ids[i]));if(!q)return s;
      const version=s.assessmentVersions?.[i],old=priorAssessment(q,version);
      const selected=version&&version===assessmentVersion(q)?q:old||q;
      questions.push(selected);
    }
    const copy={...s};freezeSession(copy,questions);return copy;
  }
  function verifiedAssessmentQuestion(assessment,row,bankQuestion){
    if (!row) return bankQuestion || null;
    if(typeof row.assessmentVersion!=='string')return priorAssessment(bankQuestion)||bankQuestion||null;
    const snapshots=Array.isArray(assessment?.questionSnapshots)?assessment.questionSnapshots:[];
    const candidates=snapshots.filter(q=>q && String(q.id)===String(row.id) && q.assessmentVersion===row.assessmentVersion);
    if(candidates.length===1){
      const q=candidates[0];
      if(typeof q.question==='string' && Array.isArray(q.options) && q.options.length>=2 &&
        q.options.every(x=>typeof x==='string') && Number.isInteger(q.answer) && q.answer>=0 && q.answer<q.options.length &&
        assessmentVersion(q)===row.assessmentVersion){
        const archived={...q,options:[...q.options],visual:q.visual==null?null:JSON.parse(JSON.stringify(q.visual))};
        return bankQuestion && assessmentVersion(bankQuestion)===row.assessmentVersion ? {...bankQuestion,...archived} : archived;
      }
    }
    return bankQuestion && assessmentVersion(bankQuestion)===row.assessmentVersion ? bankQuestion : priorAssessment(bankQuestion,row.assessmentVersion);
  }
  function sessionVersionStatus(session,bank) {
    if (!session || !Array.isArray(session.ids)) return 'invalid';
    if (!Array.isArray(session.assessmentVersions)) return 'legacy';
    if (session.assessmentVersions.length !== session.ids.length) return 'changed';
    const byId=new Map(bank.map(q=>[String(q.id),q]));
    return session.ids.every((id,i)=>{
      const q=byId.get(String(id));
      return q && session.assessmentVersions[i]===assessmentVersion(q);
    }) ? 'compatible' : 'changed';
  }
  function compatibleAttempt(q,row){return row.assessmentVersion==null?!q.legacyAssessmentVersion:row.assessmentVersion===assessmentVersion(q);}
  function profile(bank, history) {
    const byId = new Map(bank.map(q => [q.id, q]));
    const groups = new Map();
    for (const q of bank) {
      const key = concept(q);
      if (!groups.has(key)) groups.set(key, { concept: key, area: q.area || q.axis || q.skill, attempts: 0, correct: 0, lastFailure: -1, evidence: new Set(), status: 'sin explorar' });
    }
    history.forEach((row, index) => {
      const q = row && byId.get(row.id); if (!q || row.diagnosticPending || !compatibleAttempt(q,row)) return;
      const item = groups.get(concept(q)); item.attempts++;
      if (row.correct) item.correct++;
      if(row.correct && row.repeatedReview)return;
      if (!row.correct || row.assisted || row.afterStudy || row.confidence === 'azar' || row.confidence === 'duda') {
        item.lastFailure = index; item.evidence.clear(); item.status = 'por reforzar';
      } else if(row.confidence === 'seguro' || row.confidence === 'no-declarada') {
        item.evidence.add(q.transferGroup || row.id);
        item.status = item.evidence.size >= 2 ? 'comprobado' : 'por comprobar';
      } else if(item.status !== 'comprobado') item.status='por comprobar';
    });
    return [...groups.values()].map(x => ({ ...x, evidence: [...x.evidence] }));
  }
  // Stars are derived exclusively from the existing compatible evidence.
  // 4 stars = two distinct unassisted transfer families (mastery).
  // 5 stars = three such families; limited banks cannot fabricate the fifth.
  function skillStars(state) {
    if(!state || !Number.isFinite(state.attempts) || state.attempts<=0)return 0;
    const distinct=new Set(Array.isArray(state.evidence)?state.evidence:[]).size;
    if(distinct>=3 && state.status==='comprobado')return 5;
    if(distinct>=2 && state.status==='comprobado')return 4;
    if(distinct>=1 && state.status==='por comprobar')return 3;
    if(state.correct>0)return 2;
    return 1;
  }
  function select(bank, history, count, { exclude = [], concepts = null, balanced = false, distinctFamilies = true, random = Math.random } = {}) {
    const blocked = new Set(exclude), seen = new Map(), latest = new Map();
    history.forEach(row => { if (!row) return; seen.set(row.id, (seen.get(row.id) || 0) + 1); latest.set(row.id, row); });
    const p = new Map(profile(bank, history).map(x => [x.concept, x]));
    const allowed = concepts ? new Set(concepts) : null;
    const families=new Set();
    const ranked = bank.filter(q => !blocked.has(q.id) && (!allowed || allowed.has(concept(q)))).map(q => {
      const state = p.get(concept(q));
      // New questions about weak concepts come first. Never label a repeated item as transfer.
      const priority = (seen.get(q.id) || 0) * 20 + (state?.status === 'por reforzar' ? -8 : state?.status === 'por comprobar' ? -3 : 0);
      return { q, priority, tie: random() };
    }).sort((a, b) => a.priority - b.priority || a.tie - b.tie).filter(x=>{if(!distinctFamilies)return true;const family=x.q.transferGroup||x.q.id;if(families.has(family))return false;families.add(family);return true;});
    if (!balanced) return ranked.slice(0, count).map(x => x.q);
    const areas = [...new Set(bank.map(q => q.area || q.axis || q.skill))], result = [];
    while (result.length < count && ranked.length) {
      for (const area of areas) {
        const i = ranked.findIndex(x => (x.q.area || x.q.axis || x.q.skill) === area);
        if (i >= 0 && result.length < count) result.push(ranked.splice(i, 1)[0].q);
      }
    }
    return result;
  }
  function transfer(bank, history, rows, count = 10) {
    const byId = new Map(bank.map(q => [q.id, q]));
    const weak = [...new Set(rows.filter(r => r && (!r.correct || r.assisted || r.afterStudy || r.confidence === 'duda' || r.confidence === 'azar')).map(r => byId.get(r.id)).filter(Boolean).map(concept))];
    const seen = new Set(history.map(r => r?.id));
    const exclude = [...new Set([...rows.map(r => r?.id), ...history.slice(-10).map(r => r?.id)])];
    const blockedFamilies=new Set(exclude.map(id=>byId.get(id)).filter(Boolean).map(q=>q.transferGroup||q.id));
    const eligible=bank.filter(q=>!blockedFamilies.has(q.transferGroup||q.id));
    const fresh = select(eligible.filter(q => !seen.has(q.id)), history, count, { exclude, concepts: weak });
    // If the bank is exhausted, use a spaced, different item, never the item just failed.
    const rest = select(eligible.filter(q=>!fresh.some(f=>(f.transferGroup||f.id)===(q.transferGroup||q.id))), history, count - fresh.length, { exclude: [...exclude, ...fresh.map(q => q.id)], concepts: weak });
    return [...fresh, ...rest];
  }
  function validSession(s, bank, modes, limit = 200) {
    if (!s || !Array.isArray(s.ids) || !s.ids.length || s.ids.length > limit || new Set(s.ids).size !== s.ids.length || !Number.isInteger(s.index) || s.index < 0 || s.index >= s.ids.length || !modes.includes(s.mode) || !Array.isArray(s.results) || s.results.length>s.ids.length || new Set(s.results.map(r=>r?.id)).size!==s.results.length) return false;
    const byId = new Map(bank.map(q => [q.id, q]));
    const original=archivedSessionQuestions(s);
    // Verified archives remain resumable even when an item is no longer in the current catalog.
    if ((!original && !s.ids.every(id => byId.has(id))) || s.results.some(r => !r || !s.ids.includes(r.id) || (!original && !byId.has(r.id)) || typeof r.correct !== 'boolean')) return false;
    const active=original ? original[s.index] : byId.get(s.ids[s.index]);
    if (s.selected != null && (!Number.isInteger(s.selected) || s.selected < 0 || s.selected >= active.options.length)) return false;
    return true;
  }
  function cleanRows(bank, rows, limit = 5000) {
    const byId=new Map(bank.map(q=>[q.id,q]));
    return Array.isArray(rows)?rows.filter(r=>r&&byId.has(r.id)&&typeof r.correct==='boolean').slice(-limit).map(r=>({...r,selected:Number.isInteger(r.selected)&&r.selected>=0&&((typeof r.assessmentVersion==='string'&&/^a1-[a-f0-9]{64}$/.test(r.assessmentVersion)&&!compatibleAttempt(byId.get(r.id),r))||r.selected<byId.get(r.id).options.length)?r.selected:null})):[];
  }
  function cleanAssessment(bank, value){
    if(!value||!Array.isArray(value.results))return null;
    const results=cleanRows(bank,value.results,200);
    return {...value,id:String(value.id||'legacy-'+(value.at||value.date||'')),results,total:results.length,correct:results.filter(r=>r.correct).length};
  }
  function summary(mode, rows, extra = {}) {
    return { id: extra.id || 'round-' + Date.now(), mode, at: new Date().toISOString(), total: rows.length, correct: rows.filter(x => x.correct).length, results: rows, ...extra };
  }
  const cordialCorrections=[
    ['Confundes un método de barrera con uno hormonal: el preservativo no inhibe la ovulación.','Aquí conviene separar dos mecanismos. El preservativo actúa como barrera; no usa hormonas para inhibir la ovulación.'],
    ['Confundiste resistencia con corriente.','Resistencia y corriente son magnitudes distintas. Mira la unidad de cada dato antes de elegir la operación.'],
    ['Confundiste masa de muestra con cantidad en moles.','Aquí hay dos cantidades distintas: la masa de la muestra y su cantidad en moles.'],
    ['Confundes las ondas S de cizalla con ondas longitudinales como las P, que sí pueden propagarse en líquidos.','Las ondas S son de cizalla. Las P son longitudinales y sí pueden propagarse en líquidos. Distinguir esos movimientos ayuda a elegir.'],
    ['Confundiste miligramos con gramos:','Fíjate en las unidades:'],
    ['Confundiste participar como institución representativa con administrar el proceso electoral.','Participar como institución representativa y administrar una elección son tareas diferentes.'],
    ['Confundiste coexistencia con predominio:','Que dos formas de trabajo existan al mismo tiempo no significa que tengan la misma importancia:'],
    ['Confundiste cuestionar las condiciones de una actividad con que esa actividad dejara de existir.','Cuestionar las condiciones de un trabajo es distinto de decir que ese trabajo dejó de existir.'],
    ['Confundiste el pasado con su reconstrucción.','Podemos cambiar nuestra explicación del pasado cuando aparece información nueva. Eso no cambia lo que ya ocurrió.'],
    ['Confundiste el instrumento de pago con la producción que se mide.','El dinero sirve para pagar, pero la producción mide los bienes y servicios producidos.'],
    ['Confundiste respaldo de una mayoría con permiso ilimitado para suprimir protección a otras personas.','El apoyo de una mayoría no da permiso ilimitado para quitar derechos o protección a otras personas.']
  ];
  function friendlyText(text){let out=String(text||'');for(const [before,after]of cordialCorrections)out=out.split(before).join(after);return out;}
  function polishTeaching(bank){
    const map=value=>typeof value==='string'?friendlyText(value):Array.isArray(value)?value.map(map):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,v])=>[key,key==='evidence'?v:map(v)])):value;
    for(const q of bank){for(const key of ['explanations','steps','easy','example','why','hint','teaching'])if(q[key]!=null)q[key]=map(q[key]);}return bank;
  }
  // Present the existing teaching in smaller steps. Assessment text and keys stay untouched.
  function readingChunks(text, limit=36) {
    const sentences=String(text||'').trim().split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/u),out=[];let chunk='';
    for(const sentence of sentences){if(chunk&&(chunk+' '+sentence).split(/\s+/).length>limit){out.push(chunk);chunk='';}chunk+=(chunk?' ':'')+sentence;}if(chunk)out.push(chunk);return out;
  }
  const friendlyStarts={
    'Enteros y cambios':['La recta numérica ordena los números. El 0 es la referencia: los positivos están a la derecha y los negativos, a la izquierda.','Cada paso entre enteros vecinos vale una unidad. Marca dónde partes. Sumar un número positivo te mueve hacia la derecha; sumar uno negativo, hacia la izquierda.'],
    'Fracciones y unidad común':['Imagina una pizza cortada en 4 trozos iguales. Si tomas 1, tienes 1/4 de la pizza: una de sus cuatro partes.','En 1/4, el 4 de abajo dice en cuántas partes iguales dividimos la pizza. Se llama denominador. El 1 de arriba cuenta las partes que tomaste: es el numerador.'],
    'Fracción de una cantidad':['Si tienes una cantidad y quieres usar solo una parte, puedes calcular una fracción de ella. Por ejemplo, la mitad significa repartir en dos partes iguales y tomar una.','La cantidad inicial también puede ser una fracción. En ese caso seguimos repartiendo lo que tenemos, sin cambiar el tamaño de la unidad de referencia.'],
    'Parte porcentual':['Un porcentaje dice cuántas partes tomamos de cada 100. Por ejemplo, 30% significa 30 de cada 100.','Para encontrar esa parte, multiplicamos el total por 30 y dividimos por 100. El mismo procedimiento sirve con el porcentaje que indique el ejercicio.'],
    'Potencias y operaciones':['2³ es una forma corta de escribir 2 × 2 × 2. El 2 es la base: el número que repetimos al multiplicar.','El 3 es el exponente: cuenta cuántas veces aparece ese factor. Aquí no hacemos 2 × 3; multiplicamos tres factores iguales a 2.'],
    'Producto de potencias':['Una potencia permite escribir una multiplicación de factores iguales de forma más corta. La base es el factor; el exponente cuenta sus repeticiones.','Si multiplicas dos potencias de la misma base, puedes contar juntos todos esos factores. Por eso se suman sus exponentes.'],
    'Exponente negativo':['Un exponente negativo no obliga a que el resultado tenga signo menos. Indica que debemos escribir la potencia como una división.','Por ejemplo, a⁻ⁿ se escribe 1/aⁿ, siempre que a sea distinto de cero. Es la misma cantidad escrita de otra forma.'],
    'Ecuación lineal':['Piensa en una balanza equilibrada. Los dos lados de una ecuación también deben valer lo mismo.','La letra x representa la cantidad que queremos descubrir. Para encontrarla, hacemos la misma operación en ambos lados hasta dejar x sola.'],
    'Ecuaciones lineales':['Una ecuación dice que dos cantidades son iguales. La incógnita es la cantidad que todavía no conocemos y suele representarse con x.','Resolverla es descubrir qué valor hace verdadera la igualdad. Cada paso debe conservar el equilibrio entre sus dos lados.'],
    'Términos semejantes':['Puedes juntar tres manzanas y dos manzanas: tendrás cinco manzanas. Con las letras pasa algo parecido.','Solo juntamos términos que tengan las mismas letras con los mismos exponentes. Sumamos o restamos los números que acompañan esas letras.'],
    'Sustitución con signos':['Cuando te dan el valor de una letra, reemplázala por ese número completo, incluido su signo. Si es negativo, ponlo entre paréntesis.','Después resuelve en orden: primero potencias, luego multiplicaciones y divisiones, y al final sumas y restas.'],
    'Evaluación de funciones':['Una función es una regla: recibe un valor y entrega un resultado. Calcular f(2) significa usar 2 en todos los lugares donde aparece x.','Si reemplazas x por un número negativo, escríbelo entre paréntesis para conservar su signo al hacer las operaciones.'],
    'Composición de funciones':['Aquí usamos dos reglas, una después de la otra. Primero calculamos el resultado de la regla interior.','Ese resultado pasa a ser la entrada de la segunda regla. Así se lee g(f(x)): primero f y después g.'],
    'Logaritmos':['Un logaritmo pregunta por un exponente: ¿a qué número debo elevar la base para obtener el resultado indicado?','Por eso log_b(A) = c significa lo mismo que b^c = A. La base debe ser positiva y distinta de 1; A debe ser positivo.'],
    'Dominio de raíces':['El dominio reúne los valores que podemos usar como entrada. Para trabajar con una raíz cuadrada real, lo que está dentro de √ debe ser mayor o igual que cero.','Primero escribe esa condición. Después busca todos los valores de x que la cumplen. El cero también está permitido.'],
    'Rectas y pendiente':['La pendiente compara cuánto cambia la altura de una recta con cuánto avanzamos horizontalmente. Es como comparar la subida de una rampa con su avance.','En y = mx + b, m es la pendiente. b indica el valor de y cuando x vale cero.'],
    'Pendiente de una recta':['Imagina una rampa. Para saber qué tan inclinada está, importa cuánto sube y cuánto avanza horizontalmente.','La pendiente se calcula dividiendo ese cambio vertical por el cambio horizontal. Al restar las coordenadas, usa el mismo orden para los dos puntos.'],
    'Probabilidad sin reposición':['Si sacas un objeto de una bolsa y no lo devuelves, la bolsa cambia antes de la siguiente elección.','Para calcular la segunda probabilidad, cuenta de nuevo cuántos objetos quedan en total y cuántos cumplen lo que buscas.'],
    'Probabilidad equiprobable':['Primero cuenta todos los resultados posibles. Luego cuenta los que cumplen lo que pide la pregunta.','Si cada resultado tiene la misma posibilidad de salir, la probabilidad es: resultados que buscamos divididos por resultados posibles.'],
    'Probabilidad simple':['Imagina elegir un boleto sin mirar. Nos interesa qué parte de todos los boletos tiene la marca que buscamos.','Si todos tienen la misma posibilidad de salir, dividimos los casos que cumplen la condición por el total de casos posibles.'],
    'Independencia de eventos':['Dos eventos son independientes cuando saber qué pasó en uno no cambia la probabilidad del otro.','Por ejemplo, en lanzamientos independientes de una moneda equilibrada, la probabilidad de cara sigue siendo 1/2 aunque antes hayan salido varias caras.'],
    'Interés compuesto':['El capital es el dinero con que partes. El interés compuesto calcula cada nuevo interés sobre el monto actualizado, que incluye lo ganado antes.','Por eso no sumamos siempre el mismo interés en pesos. Primero actualizamos el monto de un período y usamos ese resultado para el siguiente.'],
    'Valor absoluto':['El valor absoluto mide una distancia en la recta numérica. |x| indica qué tan lejos está x del cero.','Por eso |5| y |−5| valen 5: están a la misma distancia del cero, aunque en lados distintos.'],
    'Discriminante':['Una ecuación cuadrática puede tener dos soluciones reales, una sola o ninguna. El discriminante ayuda a distinguir esos casos.','Primero escribe ax² + bx + c = 0 y conserva el signo de cada número. Después calcula Δ = b² − 4ac.'],
    'Vértice de una cuadrática':['La gráfica de una función cuadrática tiene forma de parábola. Su vértice es el punto donde deja de bajar y empieza a subir, o al revés.','Si la parábola abre hacia arriba, ese punto es el más bajo. Si abre hacia abajo, es el más alto.'],
    'Proporción directa':['Si cada ficha entrega la misma cantidad de agua, saber lo que entrega una ficha permite calcular lo que entregan varias.','Esa relación es una proporción directa: al duplicar una cantidad, la otra también se duplica y se mantiene la cantidad por unidad.'],
    'Respiración celular y ATP':['Las células necesitan energía para trabajar. La respiración celular aprovecha la energía de los nutrientes para producir ATP, que la célula usa en sus tareas.','En las mitocondrias ocurren etapas que producen gran parte del ATP cuando hay oxígeno. No toda la producción de ATP ocurre dentro de ellas.'],
    'Molaridad':['La molaridad indica cuántos moles de soluto hay por cada litro de solución. El soluto es la sustancia disuelta; la solución es la mezcla completa.','Para calcularla, divide los moles de soluto por el volumen total de la solución en litros.'],
    'Molalidad':['Aquí importa cuánto soluto hay por cada kilogramo de solvente. El solvente es el medio en que se disuelve la sustancia.','La molalidad usa moles de soluto y kilogramos de solvente. Fíjate en esa base antes de elegir una fórmula.'],
    'Fracción molar':['La fracción molar cuenta qué parte de los moles de una mezcla corresponde a un componente.','Divide los moles de ese componente por la suma de los moles de todos los componentes. El resultado no tiene unidad.'],
    'Segunda ley de Newton':['Un objeto puede recibir varias fuerzas al mismo tiempo. Primero debemos ver qué efecto tienen juntas, considerando sus direcciones.','Esa fuerza total se llama fuerza neta. La segunda ley de Newton la relaciona con la masa y la aceleración: F neta = m × a.'],
    'Conducción y transducción nerviosa':['Un receptor sensorial detecta un cambio, como una presión, y lo convierte en una señal que el sistema nervioso puede transmitir. Ese cambio de una forma de señal a otra se llama transducción.','El axón conduce señales eléctricas. No transporta la presión como si fuera un objeto que viajara dentro de un cable.'],
    'Recombinación y variabilidad':['Un par de cromosomas homólogos reúne información de origen materno y paterno. Tienen genes correspondientes, pero pueden tener versiones distintas de esos genes.','Durante la meiosis pueden intercambiarse segmentos entre cromátidas no hermanas. Así se forman nuevas combinaciones de variantes que ya existían.'],
    'Sinapsis química':['Las neuronas pueden comunicarse mediante sustancias llamadas neurotransmisores. Una neurona los libera y la otra puede recibirlos a través de receptores.','La señal cruza el pequeño espacio entre ambas células en forma química. Recibirla no siempre produce una nueva señal eléctrica: el efecto también puede ser inhibidor.'],
    'Fecundación y diploidía':['Una célula diploide tiene dos juegos de cromosomas: uno de cada progenitor. Una célula haploide tiene un solo juego.','Los gametos aportan un juego cada uno. Al unirse en la fecundación, se reúnen nuevamente dos juegos.'],
    'Información explícita':['Parte por lo que el texto dice directamente. Busca el dato que responde la pregunta y comprueba a quién, cuándo o a qué situación se refiere.'],
    'Dato explícito':['Aquí buscamos un dato que está escrito en el texto. Vuelve al fragmento y revisa las palabras que lo rodean antes de elegir.'],
    'Crítica y contraste de fuentes':['Dos fuentes pueden contar un mismo hecho de maneras distintas. Para compararlas, revisa qué afirma cada una y con qué información lo respalda.','También importa quién la produjo, cuándo y para qué público. Una perspectiva distinta no vuelve falsos todos sus datos.'],
    'Procedencia y alcance de testimonios':['Un testimonio cuenta una experiencia desde el punto de vista de alguien. Puede ayudarnos a conocer lo que esa persona vivió o pensó.','Para extender esa conclusión a otros lugares o personas, necesitamos más fuentes. Un solo testimonio no describe automáticamente a todo un país.'],
    'Costo de oportunidad':['Cuando eliges una alternativa y no puedes hacer ambas, también dejas algo de lado. El costo de oportunidad es el valor de la mejor opción a la que renuncias.','La pregunta busca qué beneficio dejaste de obtener al elegir. No hace falta inventar precios o gastos que el ejercicio no entrega.'],
    'Representación y soberanía popular':['En una democracia representativa, la ciudadanía elige autoridades para ejercer cargos bajo reglas y por períodos determinados.','La soberanía popular significa que la legitimidad del poder se funda en el pueblo. Elegir una autoridad no la deja libre de controles ni del respeto a los derechos.'],
    'Progresividad tributaria':['Para comparar impuestos, mira qué parte del ingreso o monto considerado se paga, no solo cuántos pesos se entregan.','Un esquema es progresivo cuando esa proporción aumenta al aumentar la base sobre la que se calcula el impuesto.'],
    'Externalidades negativas':['A veces una compra, venta o actividad también afecta a personas que no participaron en ella. Por ejemplo, puede causar molestias o gastos a vecinos.','Si ese costo no se incorpora totalmente en la decisión o en el precio, hablamos de una externalidad negativa.'],
    'Desocupación y fuerza de trabajo':['Contar personas sin empleo no basta para comparar grupos de distinto tamaño. También necesitamos saber con cuántas personas estamos comparando.','La tasa de desocupación divide los desocupados por la fuerza de trabajo y multiplica por 100. La fuerza de trabajo reúne ocupados y desocupados según los criterios de la medición.']
  };
  const learningWords=[
    ['numerador','el número de arriba en una fracción; cuenta las partes que tomamos'],['denominador','el número de abajo; indica en cuántas partes iguales se divide la unidad'],
    ['incógnita','la cantidad que todavía no conocemos'],['coeficiente','el número que multiplica una letra o una expresión'],['exponente','el número que indica la potencia'],
    ['recíproco','1 dividido por un número distinto de cero'],['cociente','el resultado de una división'],['radicando','la cantidad que está dentro de una raíz'],
    ['perpendicular','que forma un ángulo recto, de 90°, con otra línea o superficie'],['hipotenusa','el lado opuesto al ángulo recto en un triángulo rectángulo'],['catetos','los dos lados que forman el ángulo recto'],
    ['ordenada al origen','el valor de y cuando x vale cero'],['dominio','los valores que se pueden usar como entrada de una función'],['equiprobables','que tienen la misma probabilidad de ocurrir'],
    ['frecuencia relativa','la cantidad de casos de un grupo dividida por el total'],['frecuencia absoluta','la cantidad de veces que aparece un dato o una categoría'],['dispersión','qué tan separados o agrupados están los datos'],
    ['soluto','la sustancia que se disuelve'],['solvente','el medio en que se disuelve el soluto'],['solución','la mezcla del soluto y el solvente'],
    ['mol','una unidad que permite contar una cantidad de entidades, como átomos o moléculas'],['solubilidad','la cantidad de una sustancia que puede disolverse bajo condiciones determinadas'],
    ['isótopos','átomos del mismo elemento que tienen distinto número de neutrones'],['valencia','en este tema, se relaciona con los electrones externos y la formación de enlaces'],
    ['orbital','una descripción de estados de los electrones; no una órbita como la de un planeta'],['hibridación','un modelo que combina orbitales de un mismo átomo para describir direcciones de enlace'],['cromátidas hermanas','las copias que se forman al replicarse un cromosoma'],['replicación','la producción de nuevas copias del material genético'],['síntesis','la formación de moléculas a partir de componentes'],['alelos','versiones de un mismo gen'],['homólogos','en cromosomas, los de un par que tienen genes correspondientes'],['gametos','células reproductivas que aportan un juego de cromosomas'],
    ['diploide','que tiene dos juegos de cromosomas'],['haploide','que tiene un juego de cromosomas'],['enzimas','sustancias que aceleran reacciones químicas'],
    ['neurotransmisor','sustancia que participa en la comunicación entre neuronas'],['potencial de acción','un cambio eléctrico que puede viajar por la membrana de una célula excitable'],
    ['transducción','convertir un tipo de señal en otro'],['ATP','una molécula que participa en la transferencia de energía para tareas celulares'],
    ['fuerza neta','el resultado de sumar las fuerzas considerando sus direcciones'],['aceleración','el cambio de la velocidad con el tiempo'],['magnitud','una propiedad que podemos medir'],
    ['amplitud','la máxima separación respecto de la posición de equilibrio de una oscilación'],['frecuencia','la cantidad de ciclos por unidad de tiempo'],['longitud de onda','la distancia entre dos puntos equivalentes consecutivos de una onda'],
    ['normal','en óptica, la línea perpendicular a la superficie en el punto de encuentro'],['refracción','el cambio de rapidez de una onda al pasar a otro medio; puede cambiar su dirección'],
    ['inferencia','una conclusión que construimos usando pistas del texto'],['tesis','la idea principal que se defiende en una argumentación'],['evidencia','información que respalda una afirmación'],
    ['implícito','que no está dicho directamente y debe deducirse del contexto'],['contrastar','comparar para reconocer coincidencias y diferencias'],['conector','una palabra o expresión que relaciona ideas'],
    ['soberanía','el fundamento último de la autoridad política'],['legitimidad','la justificación o reconocimiento de una autoridad'],['sufragio','el voto en una elección'],
    ['coerción','el uso de presión o fuerza para imponer una decisión'],['procedencia','de dónde viene una fuente'],['corroborar','comprobar una información con otras pruebas'],
    ['inflación','el aumento sostenido del nivel general de precios'],['demanda','lo que las personas desean y pueden comprar a distintos precios'],['oferta','lo que se desea y puede vender a distintos precios'],
    ['proporción','una relación entre cantidades'],['hipótesis','una explicación o relación que se puede poner a prueba'],['variable dependiente','la respuesta que se mide'],['variable independiente','la condición que se modifica o compara']
  ];
  function lessonOpening(q){
    const t=q.teaching||{},curated=friendlyStarts[concept(q)];if(curated)return [...curated];
    const firstSentence=value=>String(value||'').split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/u)[0].trim();
    const concrete=firstSentence(t.intuition?.[0]),definition=firstSentence(t.foundation?.[0]);
    return [...new Set([concrete,definition].filter(s=>s&&s.split(/\s+/).length<=55))].slice(0,2).length?
      [...new Set([concrete,definition].filter(s=>s&&s.split(/\s+/).length<=55))].slice(0,2):[t.foundation?.[0]||t.aim||''];
  }
  function wordsFor(q,text=lessonOpening(q).join(' ')){
    const subject=q.subjectKey||q.subject||'';return learningWords.filter(([term])=>{
      if(new RegExp('\\b'+term+'\\s+(?:es|son|significa)\\b','iu').test(text))return false;
      if(['orbital','hibridación','cromátidas hermanas','replicación','síntesis'].includes(term)&&!/Ciencias|Biología|Física|Química/.test(subject))return false;
      if(term==='normal'&&!/ópt|refracci|reflexi|lente|espejo/i.test(concept(q)))return false;
      if(term==='dominio'&&!/M1|M2|matem/i.test(subject))return false;
      if(term==='frecuencia'&&!/onda|sonido|Doppler|espectro|frecuencia.*período/i.test(concept(q)))return false;
      if(term==='solución'&&!/Ciencias|Química/.test(subject))return false;
      if((term==='numerador'||term==='denominador')&&/se llama denominador|es el numerador/i.test(text))return false;
      return new RegExp('(^|[^\\p{L}])'+term+'(?:s|es)?(?=$|[^\\p{L}])','iu').test(text);
    }).slice(0,2).map(([term,meaning])=>({term,meaning}));
  }
  // One teaching sequence for the daily tutor in every subject. Easy mode must
  // reconnect the analogy to the actual task and finish with a check.
  function lessonCards(q, mode = 'steps') {
    const t=q?.teaching||{}, example=t.example||{};
    const cards=mode==='intro'?[...lessonOpening(q),t.aim,...(t.foundation||[]),example.problem?'Otro ejemplo: '+example.problem:'',...(example.steps||[]),example.bridge,t.check]:
      mode==='easy'?[...(t.intuition||[]),...(t.application||[]),t.check]:
      mode==='example'?[example.problem,...(example.steps||[]),example.bridge]:
      [t.aim,...(t.foundation||[]),...(t.application||[]),t.check];
    return cards.filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim()).filter((value,index,all)=>index===0||value!==all[index-1]);
  }
  function lesson(q, mode) {
    const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    if(mode==='basic')mode='easy';
    const t=q.teaching,e=q.editorial||q;
    const paragraphs=values=>values.flatMap(value=>readingChunks(value)).map(value=>'<p>'+esc(value)+'</p>').join(' ');
    const steps=values=>'<ol>'+values.map(value=>'<li>'+esc(value)+'</li>').join('')+'</ol>';
    if(!t)return mode==='steps'?steps(e.steps):paragraphs(String(mode==='easy'?e.easy:e.example).split('\n\n'));
    const section=(heading,body,kind='')=>'<section class="teaching-section '+kind+'"><h4>'+heading+'</h4>'+body+'</section>';
    if(mode==='steps')return section('Entendamos qué buscamos',paragraphs([t.aim]))+section('Partamos con una idea',paragraphs(lessonOpening(q)))+section('El concepto desde cero',paragraphs(t.foundation))+section('Resolvamos tu pregunta',steps(t.application))+section('Comprobemos el resultado',paragraphs([t.check]),'teaching-check');
    if(mode==='easy')return section('Imagínalo así',paragraphs(t.intuition))+section('Conectémoslo con tu ejercicio',steps(t.application))+section('Comprobemos el resultado',paragraphs([t.check]),'teaching-check');
    return section('Un problema distinto',paragraphs([t.example.problem]),'teaching-example')+section('Vamos a resolverlo',steps(t.example.steps))+section('Qué puedes llevar a tu pregunta',paragraphs([t.example.bridge]));
  }
  global.CachasteLearning = { friendlyText, polishTeaching, readingChunks, lessonOpening, wordsFor, contentHash, priorAssessment, freezeSession, restoreSession, assessmentVersion, assessmentSnapshot, archivedSessionQuestions, verifiedAssessmentQuestion, sessionVersionStatus, compatibleAttempt, bindPassages, lessonCards, lesson, concept, profile, skillStars, select, transfer, validSession, cleanRows, cleanAssessment, summary };
})(typeof window !== 'undefined' ? window : globalThis);
