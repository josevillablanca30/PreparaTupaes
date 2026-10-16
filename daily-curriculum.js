/* Course organization is ours; the axes follow DEMRE Regular 2026 / Admisión 2027. */
(function(g){'use strict';
 const subjects={M1:{name:'Matemática M1',page:'index.html',key:'prepara-paes-demo-v1'},M2:{name:'Matemática M2',page:'m2.html',key:'cachaste-m2-v1'},Lectura:{name:'Competencia Lectora',page:'reading.html',key:'cachaste-reading-v1'},Ciencias:{name:'Ciencias',page:'science.html',key:'cachaste-science-v1'},Historia:{name:'Historia y Ciencias Sociales',page:'history.html',key:'cachaste-history-v1'}};
 function axis(s,q){
  if(s==='M1')return q.axis||(/Porcentajes|Potencias|Enteros|Racionales|Raíces/.test(q.skill)?'Números':/Ecuaciones|Proporcionalidad/.test(q.skill)?'Álgebra y funciones':q.skill==='Geometría'?'Geometría':'Probabilidad y estadística');
  if(s==='M2'){if(['Área de rectángulos','Área de cuadrados'].includes(q.concept))return'Geometría';if(/Logaritmos|Números reales|Interés|Porcentajes/.test(q.concept))return'Números';return q.area==='Geometría'?'Geometría':q.area==='Probabilidad'?'Probabilidad y estadística':'Álgebra y funciones';}
  if(s==='Lectura')return q.skill;
  if(s==='Ciencias')return q.subject;
  return q.area==='Formación ciudadana'?'Formación ciudadana':q.area==='Economía y sociedad'?'Sistema económico':'Historia';
 }
 function classify(s,q){const a=axis(s,q),unit=s==='M1'?q.skill:s==='M2'?(/Interés|Porcentajes/.test(q.concept)?'Matemática financiera':q.area):s==='Lectura'?(a==='Localizar'?'Información explícita':a==='Interpretar'?'Relaciones y sentido':'Lectura crítica'):q.area;return{axis:a,unit,objective:q.concept||q.skill,difficulty:q.difficulty||'orientativa',supplementary:q.examEligible===false};}
 function organize(items,s){const axes=[];for(const q of items.filter(q=>q.subjectKey===s)){let a=axes.find(a=>a.name===q.axis);if(!a)axes.push(a={name:q.axis,units:[]});let u=a.units.find(u=>u.name===q.unit);if(!u)a.units.push(u={name:q.unit,levels:[]});let l=u.levels.find(l=>l.objective===q.concept);if(!l)u.levels.push(l={id:q.levelId,objective:q.concept,ids:[],supplementary:true});l.ids.push(q.id);l.supplementary=l.supplementary&&q.supplementary;}const order=['Parte porcentual','Descuento porcentual','Variación porcentual','Cambios porcentuales sucesivos','Recuperar valor original'];for(const a of axes)for(const u of a.units)if(s==='M1'&&u.name==='Porcentajes')u.levels.sort((a,b)=>(order.indexOf(a.objective)<0?99:order.indexOf(a.objective))-(order.indexOf(b.objective)<0?99:order.indexOf(b.objective)));for(const a of axes){if(s==='M1'){const units=['Enteros','Racionales','Potencias','Raíces','Porcentajes'];a.units.sort((x,y)=>(units.includes(x.name)?units.indexOf(x.name):99)-(units.includes(y.name)?units.indexOf(y.name):99));}}if(s==='M1')axes.sort((a,b)=>['Números','Álgebra y funciones','Geometría','Probabilidad y estadística'].indexOf(a.name)-['Números','Álgebra y funciones','Geometría','Probabilidad y estadística'].indexOf(b.name));if(s==='Lectura')axes.sort((a,b)=>['Localizar','Interpretar','Evaluar'].indexOf(a.name)-['Localizar','Interpretar','Evaluar'].indexOf(b.name));return axes;}
 function prerequisites(s,objective){const map={'Cambios porcentuales sucesivos':['M1','Parte porcentual'],'Recuperar valor original':['M1','Parte porcentual'],'Descuento porcentual':['M1','Parte porcentual'],'Variación porcentual':['M1','Parte porcentual'],'Interés compuesto':['M1','Cambios porcentuales sucesivos'],'Interés simple':['M1','Parte porcentual'],'Logaritmos':['M1','Producto de potencias'],'Composición de funciones':['M1','Evaluación de función afín'],'Dominio de raíces':['M1','Raíz cuadrada principal'],'Modelo binomial':['M1','Eventos independientes'],'Probabilidad sin reposición':['M1','Extracción sin reposición'],'Ecuaciones exponenciales':['M1','Producto de potencias'],'Vértice de una cuadrática':['M1','Extremo de una cuadrática']};const p=map[objective];return p&&!(p[0]===s&&p[1]===objective)?[{subject:p[0],concept:p[1]}]:[];}
 function sciencePool(items,track){return items.filter(q=>q.subjectKey!=='Ciencias'||!track||q.module==='MC'||(track==='TP'?q.module==='MTP':q.module==='ME'&&q.subject===track));}
 function course(items,s){const units=organize(items,s).flatMap(a=>a.units.map(u=>({...u,axis:a.name})));if(s==='M1'){const order=['Enteros','Racionales','Potencias','Raíces','Álgebra','Ecuaciones','Inecuaciones','Sistemas 2×2','Proporcionalidad','Porcentajes','Función afín','Función cuadrática','Geometría','Pitágoras','Polígonos','Círculos','Cuerpos geométricos','Cilindros','Transformaciones','Semejanza','Tablas y gráficos','Estadística','Cuartiles','Probabilidad','Probabilidad compuesta'];units.sort((a,b)=>(order.includes(a.name)?order.indexOf(a.name):99)-(order.includes(b.name)?order.indexOf(b.name):99));}
 if(s==='Historia'){
   // CPECH Bitácoras XIX/XX: procesos mundo/América/Chile, análisis de fuentes,
   // Formación Ciudadana, Sistema Económico. DEMRE determina los ejes vigentes.
   const thematic=['Historia mundial','Historia de Chile','Interpretación de fuentes','Formación ciudadana','Economía y sociedad'];
   units.sort((a,b)=>thematic.indexOf(a.name)-thematic.indexOf(b.name));
   const chronology={
    'Historia mundial':['Razón y crítica ilustrada','Igualdad jurídica en 1789','Industrialización y urbanización','Imperialismo y dominio colonial','Detonante y causas de la Primera Guerra Mundial','Gran Depresión de 1929','Reconstrucción y Plan Marshall','Origen y propósito de la ONU','Guerra Fría','Descolonización y autodeterminación'],
    'Historia de Chile':['Junta de 1810 e independencia','Minería exportadora y urbanización','Cuestión social','Predominio parlamentario tras 1891','Secularización del Estado','Ampliación del sufragio femenino','Industrialización y fomento estatal','Reforma agraria y tenencia de tierra','Ruptura democrática de 1973','Transición democrática de 1988 a 1990'],
    'Formación ciudadana':['Estado de derecho y límites constitucionales','Funciones y separación de poderes','Secreto del sufragio','Participación ciudadana','Pluralismo político','Transparencia y rendición de cuentas'],
    'Economía y sociedad':['Costo de oportunidad','Precio y cantidad demandada','Desplazamientos de oferta','Inflación y poder adquisitivo','Desocupación y fuerza de trabajo','Bienes públicos y recursos comunes','Externalidades negativas']
   };
   for(const unit of units){const order=chronology[unit.name];if(order)unit.levels.sort((a,b)=>{const i=order.indexOf(a.objective),j=order.indexOf(b.objective);return(i<0?order.length:i)-(j<0?order.length:j)});}
 }
 if(s==='Ciencias'){
   const order=['Organización, estructura y actividad celular','Procesos y funciones biológicas','Herencia y evolución','Organismo y ambiente','Ondas','Mecánica','Energía – Tierra','Electricidad','Estructura atómica','Reacciones químicas y estequiometría','Química orgánica'];
   units.sort((a,b)=>order.indexOf(a.name)-order.indexOf(b.name));
 }
 if(s==='Lectura'){
   const order=['Información explícita','Relaciones y sentido','Lectura crítica'];
   units.sort((a,b)=>order.indexOf(a.name)-order.indexOf(b.name));
 }
 return units;}

 // Panorama escolar 1.º–4.º medio: líneas temáticas orientativas, no equivalencias de grado
 // ni declaración de que cada contenido ya tenga ejercicios suficientes.
 const secondaryScope={
  M1:[
   {title:'Números y operaciones',topics:'Enteros y racionales, porcentajes, potencias, raíces, números reales y aplicaciones'},
   {title:'Álgebra y funciones',topics:'Expresiones algebraicas, productos notables, ecuaciones, sistemas, proporcionalidad, funciones lineales y cuadráticas'},
   {title:'Geometría',topics:'Figuras y cuerpos, Pitágoras, semejanza, transformaciones y medición'},
   {title:'Datos y probabilidades',topics:'Lectura de gráficos, medidas estadísticas, variabilidad y probabilidades simples y combinadas'}
  ],
  M2:[
   {title:'Profundización numérica y algebraica',topics:'Números reales, expresiones, ecuaciones, logaritmos y modelación'},
   {title:'Funciones y cambios',topics:'Funciones y sus representaciones, composición, modelos y análisis de situaciones'},
   {title:'Geometría y razonamiento',topics:'Relaciones espaciales, modelación geométrica y suficiencia de datos'},
   {title:'Azar, datos y decisiones',topics:'Probabilidades, distribuciones, interpretación y evaluación de información'}
  ],
  Lectura:[
   {title:'Comprensión de textos',topics:'Ideas globales y locales, vocabulario en contexto, inferencias, conexiones y propósito'},
   {title:'Géneros y discursos',topics:'Textos narrativos, poéticos, dramáticos, expositivos y argumentativos'},
   {title:'Lectura crítica',topics:'Perspectiva del emisor, calidad de argumentos, evidencia, sesgos y credibilidad'},
   {title:'Integración de información',topics:'Comparación de fuentes, lectura de gráficos en textos y evaluación de conclusiones'}
  ],
  Ciencias:[
   {title:'Biología',topics:'Células, sistemas del organismo, reproducción, genética, evolución, salud y ecosistemas'},
   {title:'Física',topics:'Movimiento, fuerzas, energía, ondas, electricidad y fenómenos de la Tierra'},
   {title:'Química',topics:'Estructura de la materia, enlaces, reacciones químicas, estequiometría y química orgánica'},
   {title:'Investigación científica',topics:'Diseño experimental, variables, gráficos, evidencia y conclusiones; las menciones profundizan en su área'}
  ],
  Historia:[
   {title:'Historia mundial',topics:'Ilustración, transformaciones políticas e industriales del siglo XIX; guerras mundiales, crisis, Guerra Fría y cambios contemporáneos'},
   {title:'Historia de Chile y América',topics:'Independencia, organización republicana, cambios territoriales y económicos, cuestión social, transformaciones del siglo XX y democratización'},
   {title:'Interpretación de fuentes históricas',topics:'Pensamiento temporal, multicausalidad, continuidad y cambio, contraste de documentos y perspectivas'},
   {title:'Formación ciudadana',topics:'Diversidad, derechos humanos, Estado de derecho, instituciones, democracia, representación y participación'},
   {title:'Sistema económico',topics:'Escasez y distribución, funcionamiento de mercados, Estado, empleo, inflación y consumo responsable'}
  ]
 };

 g.CachasteCurriculum={subjects,classify,organize,prerequisites,sciencePool,course,secondaryScope};
})(typeof window==='undefined'?globalThis:window);
