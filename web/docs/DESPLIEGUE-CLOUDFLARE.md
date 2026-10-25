# Despliegue de prueba por API: sitecacho.cl

## Estado real

La primera preview ya está publicada y verificada. [Enlace, capturas, pruebas y DNS pendiente](../reports/cloudflare-20261025/README.md). Se usó QA de GitHub Actions y después Wrangler/API desde Work; la publicación automática sigue pendiente de guardar el único secreto en GitHub.

## Método elegido y alcance

Cloudflare Pages **Direct Upload** desde GitHub Actions y Wrangler, proyecto **`cachaste-sitecacho`**, en la cuenta Cloudflare que ya usa el titular. No requiere iniciar sesión desde Work ni instalar la integración GitHub de Cloudflare. La compilación y las pruebas ocurren en GitHub; la API oficial crea/configura el proyecto y Wrangler sube únicamente `web/dist`.

Direct Upload no se convierte posteriormente a Git integration en el mismo proyecto. El despliegue continuo lo administra este repositorio mediante Actions. La elección evita dos sistemas de compilación y permite exigir la QA del mismo commit antes de subir.

Rama autorizada: `work/cachaste-web-comercial-20261024`. Producción reservada: `production-requires-owner-approval`. No se crea esa rama ni se publica producción. El flujo rechaza proyectos con Git integration, un despliegue de producción previo, otra rama de producción o dominios ajenos. Si el nombre ya está ocupado en otra cuenta, se detiene: no sustituye el nombre por otro proyecto.

**No se modifica `somosvillablanca.cl`, su DNS ni Lovable.** El cliente API tiene únicamente métodos para el proyecto Pages indicado. No tiene métodos para zonas, DNS, planes, facturación, compras, migraciones a Workers ni eliminación de proyectos.

## Única autorización inicial del titular

1. En [Cloudflare > API Tokens](https://dash.cloudflare.com/profile/api-tokens), crear un **Custom Token**, nombre sugerido `Cachaste-Pages-Preview`.
2. Permiso único: **Account > Cloudflare Pages > Edit**. En Account Resources elegir **Include > Specific account**, la cuenta existente del titular. No seleccionar todas las cuentas ni permisos de DNS, zonas, facturación o Workers Scripts. No usar Global API Key.
3. El **Account ID** ya está configurado a partir de la captura del titular. Es un identificador público, no una credencial; el workflow y la guarda rechazan cualquier cuenta diferente. No hace falta guardarlo como secreto ni volver a copiarlo.
4. Abrir [GitHub > PreparaTupaes > Settings > Secrets and variables > Actions](https://github.com/josevillablanca30/PreparaTupaes/settings/secrets/actions). Con **New repository secret**, guardar un solo valor:

| Nombre exacto | Valor que introduce el titular directamente en GitHub |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | El token limitado recién creado. |

**No enviar contraseñas, tokens, claves privadas ni capturas de sus valores al chat.** Al terminar basta avisar que el secreto está guardado. No hacen falta un token personal de GitHub, una service role de Supabase, claves manuales del banco ni un proyecto Pages creado manualmente.

El permiso de Cloudflare Pages es de cuenta, no de un proyecto individual; por eso el código fija el nombre y los endpoints y comprueba el proyecto antes de escribir. El token no autoriza cambios DNS ni de la zona de Somos Villablanca. Si existieran otros proyectos Pages en la cuenta, el workflow tampoco los enumera ni modifica.

Se usan **repository secrets** para conservar compatibilidad con GitHub Free si el repositorio pasa a privado. No se depende de environment secrets, que GitHub Free limita a repositorios públicos. La ejecución solo acepta la rama web y los permisos de `GITHUB_TOKEN` son `contents: read` y `actions: read`.

## Lo que hace la ejecución autorizada

El responsable del código activa `web-pages-preview.yml` guardando una nueva solicitud en **`web/deploy-preview.request`**, dentro de la rama web. Esto funciona sin fusionar a `main`, aunque el botón Run workflow no aparezca mientras el workflow no exista en la rama predeterminada.

1. Comprueba el único secreto requerido, la cuenta confirmada y el destino fijo, sin escribir en Cloudflare.
2. Verifica que Android permanezca idéntico y ejecuta las pruebas de backend/pagos simulados.
3. Espera el resultado exitoso de `web-commercial.yml` para **el mismo SHA y rama**: motor original, banco completo, HTTP real con Auth/PostgREST y los cuatro perfiles de navegador.
4. Consulta el proyecto exacto. Si no existe, lo crea mediante la API oficial con producción reservada. Si existe y es compatible, prepara sus variables. No compra servicios ni cambia el plan de la cuenta.
5. Genera una clave AES-256-GCM y una clave de firma offline EC P-256 nuevas para ese despliegue, dentro del runner. Las guarda como `secret_text` en **preview**, las enmascara y entrega la clave AES al siguiente paso de compilación. Nunca guarda las claves en el repositorio ni en artefactos. No se suministran claves educativas a producción.
6. Verifica por API **Fail closed** tanto en preview como en producción, claves de ejecución secretas y registro/retornos Auth deshabilitados.
7. Compila `web/dist`, comprueba que no exista `/app` en claro, autentica el cifrado de los 94 archivos privados y exige las cinco materias. El marcador vacío `.nojekyll` es el único archivo sin contenido permitido.
8. Wrangler publica únicamente una preview de la rama web. La reserva de producción impide tratarla como despliegue de producción.
9. Lee la URL real de un despliegue exitoso de ese SHA por la API; no inventa el alias a partir del nombre de rama.
10. Comprueba por HTTPS landing, cuenta, manifest, versión, Worker real, sesión/progreso/checkout anónimos denegados, token fabricado rechazado, protección de origen y firma pública offline. Revisa **cada archivo privado** y **cada ruta del cifrado**; comprueba además que Mercado Pago continúe deshabilitado. Con los 94 archivos actuales son **202 verificaciones HTTP**.
11. Entrega el enlace y `pages-preview.json` en el resumen de Actions y el artefacto **`Cachaste-Pages-Preview`**. El artefacto solo contiene URL, SHA y resultados; no contiene bancos, secretos ni sesiones.

Las claves de preview se renuevan junto con cada compilación; no cambiar una clave suelta de un despliegue que ya está construido. Para recuperar una versión anterior se reconstruye el commit autorizado con una solicitud nueva. La configuración de secretos se aplica al nuevo despliegue; los despliegues previos no se usan como fuente para recuperar sus valores privados. Después de renovar la firma, un cliente conectado debe descargar el service worker actualizado; las licencias offline anteriores siguen limitadas por su vencimiento y revisión.

Una falta de credenciales, rechazo de API, QA incompleta, proyecto incompatible o comprobación HTTP fallida deja la ejecución sin una URL declarada como verificada. Los cuerpos de error de Cloudflare y sus variables no se imprimen. No se crea un usuario ficticio ni un permiso Premium de prueba en el Supabase compartido con Android.

## DNS: únicamente sitecacho.cl

Según las capturas de la zona nueva, Cloudflare asignó:

```text
johnny.ns.cloudflare.com
maxine.ns.cloudflare.com
```

Si aún no se hizo: en [NIC Chile](https://clientes.nic.cl/), abrir **sitecacho.cl > Modificar dominio > Servidores de nombre (DNS)**, dejar esos dos nombres, uno por campo, y guardar. Luego solicitar a Cloudflare que compruebe los servidores. No cambiar otro dominio. La delegación no basta para alojar la web: todavía debe existir y verificarse la preview.

Después de verificar `pages.dev`, asociar `sitecacho.cl` y `www.sitecacho.cl` desde **`cachaste-sitecacho > Custom domains`**. Para servir la rama de prueba, usar el alias exacto devuelto por Pages en un CNAME **proxied** de esta zona, siguiendo la guía oficial de dominios por rama. No inventar IP, CNAME ni subdominio, y no configurar únicamente DNS omitiendo la asociación en Pages.

El token inicial no tiene permisos DNS. La asociación del dominio y esos registros se completan en el panel por el titular, con los valores concretos del despliegue verificado. La herramienta prepara las instrucciones y verifica después DNS/HTTPS. No se piden permisos para otras zonas.

## Estado y límites antes de vender

- **Implementado y comprobable en código:** bootstrap por API, aislamiento, claves automáticas, cifrado antes de subir, puerta Premium y comprobación posterior del sitio real.
- **Probado sin credenciales Cloudflare:** contrato simulado de la API, guardas, generación/firma de claves y la comprobación HTTP sobre el Worker real en una fixture aislada. Los resultados de GitHub Actions identifican cada prueba y commit.
- **Despliegue real completado:** proyecto creado, preview subida y 202 comprobaciones HTTPS aprobadas. Para futuras publicaciones automáticas falta guardar un token nuevo directamente en GitHub.
- **Pendiente después:** ajustar CNAME/certificado del dominio asociado, retornos y correo Auth, prueba de acceso con una identidad autorizada y suscripción verificada, dispositivos físicos y flujo de compra sandbox aislado. Los nameservers de NIC ya están verificados. Los cobros reales continúan cerrados.
- **Repositorio actualmente público:** el contenido histórico está en el código original. Cifrar Pages protege la distribución web, pero no vuelve privado el historial de GitHub. Antes de vender exclusividad del banco, el titular debe cambiar la visibilidad o definir una fuente privada. No reescribir historia, borrar bancos ni tocar la candidata Android para ocultarlo.

## Fuentes oficiales

- [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) y [GitHub Actions con Wrangler](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).
- [Crear proyecto por API](https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/create/), [actualizar configuración](https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/edit/) y [secretos de Pages](https://developers.cloudflare.com/pages/functions/bindings/#secrets).
- [Dominio de una rama](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/) y [dominios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/).
- [Disponibilidad de environments de GitHub](https://docs.github.com/es/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).
