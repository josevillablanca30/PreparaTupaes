// Change platform-specific account copy only. Approved art, layout and competition rules stay identical.
export function adaptCompetitionUi(source){
 const changes=[
 ['Los cobros y la prueba de siete días se habilitarán con Google Play.','Las suscripciones web se administran en Mi cuenta mediante Mercado Pago.'],
 ['Se eliminarán tu cuenta y tus datos competitivos. Tu aprendizaje local seguirá en este teléfono. Eliminar la cuenta no cancela una suscripción de Google Play: cancélala allí si no quieres que se renueve. Las compras quedan vinculadas a esta cuenta. Para protegerte, vuelve a confirmar tu contraseña.','Se eliminarán tu cuenta, tu progreso web y tus datos competitivos. Cancela primero la renovación de Mercado Pago en Mi cuenta. Las compras de Google Play se administran allí. Los importes de pagos necesarios para obligaciones contables pueden conservarse sin el vínculo a tu cuenta. Para protegerte, vuelve a confirmar tu contraseña.']
 ];
 for(const[from,to]of changes){if(!source.includes(from))throw Error('Review web account copy: Android source changed');source=source.replace(from,to);}return source;
}
