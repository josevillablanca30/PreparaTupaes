# ¿Cachaste? — unificación web y Android (06-11-2026)

## Alcance aprobado
- Android es la referencia visual y funcional vigente; no reconstruir desde la web antigua.
- Mantener la web comercial en Cloudflare Pages y el dominio sitecacho.cl.
- Compartir cuentas, duelos, revanchas, rankings, historial y progreso entre PC, navegador móvil y Android.
- Conservar recuperación de contraseña y páginas /privacidad.html, /condiciones.html y /eliminar-cuenta.html.
- No alterar la aplicación Android publicada en prueba cerrada ni el proyecto Servicios Villablanca.
- Pagos web con Mercado Pago y Android con Google Play Billing, solo tras pruebas y verificación de titularidad Aconcanino SpA.

## Auditoría inicial de la rama web de origen
- web/scripts/build.mjs genera web/dist/app a partir del motor compartido, incorpora competition-client y competition-app.
- La configuración web de competencia apunta a Supabase; no asumir equivalencia con Android sin comparar ambos clientes y sus contratos.
- web/client/progress-runtime.mjs ya implementa persistencia por usuario, envío de cambios, resolución de conflictos y estados de sincronización.
- web/client/shell.mjs ya ofrece acceso a cuenta, estado de sincronización, PWA y enlaces legales.
- No reescribir estos componentes ni declarar duelos multiplataforma verificados sin prueba real.
- README.md contiene estado histórico del 18-10 y no representa necesariamente el estado comercial actual.

## Orden de implementación y aceptación
1. Inventariar pantallas, recursos y estilos Android actuales y mapearlos a las rutas web existentes.
2. Actualizar la presentación web sin sustituir la identidad vigente ni romper la versión móvil.
3. Validar mismo Supabase, autenticación y operaciones de competencia; pruebas cruzadas Android ↔ PC, revancha e historial.
4. Verificar progreso y ranking compartidos, con conflictos y reconexión.
5. Probar registro, login, recuperación, borrado de cuenta, acceso y páginas legales.
6. Preparar cobros web con credenciales de prueba, acceso premium del lado servidor y cancelación; no habilitar cobros reales sin verificación.
7. Desplegar a entorno de prueba, validar y luego publicar sitecacho.cl.

## Criterios de seguridad
- Nunca subir claves secretas de Supabase ni Mercado Pago al repositorio o al navegador.
- No modificar los permisos o AAB de Android como efecto lateral.
- Guardar cambios en commits pequeños y validar cada integración.
