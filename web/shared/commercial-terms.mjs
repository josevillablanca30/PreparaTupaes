const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=240;
const html=value=>String(value).replace(/[&<>"']/g,char=>({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));

export function hasCommercialTerms(seller){
  return Boolean(seller&&seller.name==='Aconcanino SpA'&&
    typeof seller.taxId==='string'&&/^\d{1,2}\.?\d{3}\.?\d{3}-[0-9kK]$/.test(seller.taxId)&&
    text(seller.legalAddress)&&text(seller.representative)&&
    typeof seller.contactEmail==='string'&&/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(seller.contactEmail)&&
    text(seller.refundTerms)&&text(seller.taxDocumentTerms));
}

export function validTermsDate(date){
  return typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date))&&
    new Date(date).toISOString().slice(0,10)===date;
}

function replaceSection(document,section,content,seller,date){
  if(!hasCommercialTerms(seller)||!validTermsDate(date))throw Error('COMMERCIAL_TERMS_REQUIRED');
  const start='<!-- COMMERCIAL_'+section+'_START -->',end='<!-- COMMERCIAL_'+section+'_END -->';
  const from=document.indexOf(start),to=document.indexOf(end);
  if(from<0||to<from)throw Error('COMMERCIAL_TERMS_MARKERS_REQUIRED');
  const writtenDate=new Intl.DateTimeFormat('es-CL',{dateStyle:'long',timeZone:'UTC'}).format(new Date(date));
  return (document.slice(0,from)+content+document.slice(to+end.length))
    .replace(/<time datetime="[^"]+">[^<]+<\/time>/,`<time datetime="${date}">${writtenDate}</time>`);
}

export function renderCommercialTerms(document,seller,date){
  if(!hasCommercialTerms(seller))throw Error('COMMERCIAL_TERMS_REQUIRED');
  const content=`<h2>Vendedor y soporte</h2><p>${html(seller.name)} · RUT ${html(seller.taxId)}. Domicilio legal: ${html(seller.legalAddress)}. Representante legal: ${html(seller.representative)}. Contacto por correo electrónico en <a href="mailto:${html(seller.contactEmail)}">${html(seller.contactEmail)}</a>.</p>
<h2>Qué ofrece ¿Cachaste?</h2><p>Preparación en Matemática M1, Matemática M2, Competencia Lectora, Ciencias e Historia con lecciones, tutor, diagnósticos, ensayos, rankings y duelos. Las prácticas no entregan un puntaje oficial ni garantizan resultados de admisión.</p>
<h2>Acceso y suscripciones</h2><p>Crear una cuenta no inicia una suscripción. El acceso educativo se activa cuando el servidor verifica el pago o una autorización de acceso vigente. Las suscripciones web se contratan mediante Mercado Pago.</p>
<h2>Planes y renovación</h2><p>Los precios en pesos chilenos son $2.490 por semana, $7.990 por mes y $64.990 por año. El plan se renueva por el mismo período hasta que se cancele. Si está disponible y tu cuenta es elegible, la prueba de siete días se renueva en el plan mensual de $7.990 salvo que la canceles antes del primer cobro. Revisa el total y las fechas en el checkout antes de aceptar.</p>
<h2>Cancelaciones, devoluciones y documentos</h2><p>Administra tu renovación web desde Mi cuenta. El período pagado confirmado se conserva hasta su vencimiento. Las suscripciones contratadas por Google Play se administran en Google Play.</p><p>${html(seller.refundTerms)}</p><p>${html(seller.taxDocumentTerms)}</p>`;
  return replaceSection(document,'TERMS',content,seller,date)
    .replaceAll('Estas condiciones corresponden a ¿Cachaste? Prepara tu PAES y a su etapa actual de prueba.','Estas condiciones corresponden al servicio ¿Cachaste? Prepara tu PAES.');
}

export function renderCommercialPrivacy(document,seller,date){
  return replaceSection(document,'PRIVACY',
    '<h2>Datos de suscripciones</h2><p>Aconcanino SpA vende las suscripciones web. Mercado Pago procesa el pago. Al iniciar el checkout, le enviamos el correo de tu cuenta para vincular la suscripción. ¿Cachaste? guarda los identificadores de pago y suscripción, su estado, los montos y las fechas para verificar tu acceso, administrar la renovación y conciliar los cobros. Ingresa los datos de tarjeta en el checkout del proveedor.</p><p>Google Play procesa las compras contratadas desde Android y gestiona los datos del medio de pago.</p>',
    seller,date);
}
