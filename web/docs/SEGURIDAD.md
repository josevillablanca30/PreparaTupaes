# Alcance de protección comercial

## Controles implementados

La distribución web protege cada archivo de `/app/` mediante Auth, sesión viva y permiso de servidor. La administración de perfil, privacidad y eliminación sigue disponible para una cuenta autenticada sin Premium; eso no abre los bancos ni permite competir. Los archivos privados de Pages se cifran con AES-256-GCM y cada ruta forma parte de los datos autenticados del cifrado. La compilación de Cloudflare se detiene si falta la clave; nunca se publica una copia clara del banco en la salida web.

La cookie de acceso es HttpOnly, Secure en HTTPS y SameSite Lax. Los cambios de sesión, pagos y progreso comprueban origen y un encabezado explícito. El progreso se vincula al UUID autenticado del servidor, no a `userId`, metadatos o indicadores Premium del navegador. RLS y privilegios impiden acceso directo a tablas; las RPC de pagos son solo para service role. El progreso local no concede puntos competitivos.

CSP mantiene scripts de origen propio y hashes de bloques originales. Los controles antiguos M1, Ciencias y Lectora se adaptan en el empaquetado a atributos de datos y una lista explícita de llamadas educativas; no se habilita `eval`, `Function` ni eventos inline. El contenido y los motores originales de Android no cambian.

Los permisos de lectura de recursos pueden reutilizarse como máximo 30 segundos para limitar consultas; entradas HTML, cuenta y escrituras validan la sesión y permiso nuevamente. La práctica offline requiere una licencia ES256 de servidor, vinculada a identidad, origen y revisión, con máximo de 12 horas. Cerrar sesión, cambiar de identidad o perder el permiso elimina la licencia y el caché privado anteriores. Eliminar la cuenta borra su espacio local y documentos sincronizados, y desvincula el ledger contable privado.

Google utiliza PKCE S256 con el SDK compartido por cuenta y competencia. Los retornos no se almacenan en el caché PWA ni envían referentes; los códigos se retiran del historial antes del canje. La existencia del botón no habilita el proveedor: el servidor comprueba también su configuración real. La renovación de sesión conserva los borradores de cada UUID y el servidor rechaza una escritura enviada con la identidad de otro estudiante.

La competencia conserva resultados calculados en servidor, mismos formularios, tiempos de servidor, reintentos idempotentes, límite de estrellas cero, bloqueos, denuncias y revisión de soluciones una vez liquidado el duelo. Los webhooks Mercado Pago exigen HMAC, antigüedad limitada y consulta canónica de recursos; un retorno del checkout no habilita Premium.

## Límites que deben quedar claros

**El repositorio original es público.** Sus fuentes e historial ya contienen bancos y respuestas. La nueva puerta de acceso y el cifrado protegen la distribución comercial web, pero no pueden retirar copias previamente públicas. Antes de vender contenido como exclusivo, el titular debe resolver la visibilidad y distribución autorizada del repositorio, sin reescribir ni borrar la candidata Android. No se ha cambiado esa visibilidad sin su decisión.

Una persona autorizada para descargar contenido educativo y usarlo offline puede copiar lo que recibe; ningún permiso de navegador equivale a DRM absoluto. Las validaciones competitivas impiden falsificar un resultado o el tiempo enviado por un cliente, pero no garantizan que un participante no consulte material externo. Para un nivel superior de integridad competitiva se necesitaría un banco reservado de variantes y controles adicionales, sin reducir el material educativo existente.

WebKit y Chromium automatizados con tamaños móviles no sustituyen pruebas físicas en Safari de iPhone y Chrome de Android. La preview Pages sí fue desplegada y comprobada por HTTPS en la revisión `3889274`: 202/202 controles correctos. La cuenta de Mercado Pago del titular, las notificaciones reales del proveedor, el checkout sandbox autenticado, Google real, la prueba de carga de 200 alumnos, DNS/certificado .cl y correo SMTP siguen pendientes. [Evidencia y límites actuales](../reports/lanzamiento-20261025/README.md).

Los avisos Supabase `rls_enabled_no_policy` son informativos y esperados: los esquemas privados deniegan acceso directo y operan mediante funciones con privilegios controlados. No se deben agregar políticas públicas para ocultar ese aviso. Los índices nuevos todavía sin uso tampoco se borran para ocultar avisos informativos. Consulta de seguridad tras la migración: sin errores ni advertencias de seguridad; 29 tablas privadas con RLS.

Esta revisión incluye pruebas automatizadas y verificación de configuración; no se presenta como una auditoría de seguridad independiente.
