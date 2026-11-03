# ¿Cachaste? · Publicación verificada del 3 de noviembre de 2026

**Cloudflare Pages publicó correctamente la web y la ruta de recuperación.** La recuperación completa de una cuenta continúa pendiente porque Supabase todavía utiliza `http://localhost:3000` como retorno predeterminado.

| Dato | Resultado verificado |
|---|---|
| Proyecto | `cachaste-sitecacho`, independiente de Servicios Villablanca |
| Entorno | Preview Pages Free, HTTPS público |
| Recuperación pública | https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/recuperar |
| Despliegue inmutable | https://9d43bdeb.cachaste-sitecacho.pages.dev |
| Commit desplegado | `1979a6baeb171d43b0eca3d3dd25dd59daee2268` |
| ID del despliegue | `9d43bdeb-d3b2-44d6-b6b2-444629d3d21b` |
| Workflow | [41562707568, intento 2, aprobado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41562707568) |
| Autenticación Cloudflare | Acceso aceptado con el secreto actualizado; errores 9106 y 6003 resueltos |

El commit posterior `cb669cb` solo agrega un diagnóstico de cuenta en GitHub Actions. No contiene una versión distinta de la página. Este informe tampoco cambia la aplicación desplegada ni inicia otro despliegue.

## Pruebas ejecutadas

- 117 pruebas web aprobadas en el workflow de publicación.
- QA completa del mismo commit: 168 recorridos aprobados, 42 por Chrome Android, WebKit iPhone, Chrome escritorio y pantalla de 320 px. [Ejecución](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41562707550).
- 204 de 204 comprobaciones HTTP sobre el despliegue real aprobadas: HTTPS, versión exacta, página y JavaScript de recuperación, no-store, no-referrer, CSP, bloqueo de contenido privado y cobros cerrados. [Resultado completo](pages-preview.json).
- Comprobación independiente de la dirección estable: `/version.json` devuelve el commit desplegado; `/recuperar` devuelve HTTP 200 con `recovery-root`; `/recovery.js` devuelve JavaScript y no la portada antigua.
- Navegador Chrome real sobre la web publicada: carga el formulario público sin suscripción; un hash sintético inválido es rechazado por Supabase Auth; se muestra «Pidamos un enlace nuevo» y se elimina el callback de la URL. No se envió un correo ni se cambió una contraseña real en esta comprobación.
- 94 archivos educativos cifrados, ningún banco en texto público y código Android intacto.

## Pendiente de Supabase y teléfono

Una solicitud GET al endpoint oficial de verificación de Supabase con un hash sintético inválido devolvió HTTP 303 hacia `http://localhost:3000`. Se conservó solo el origen y la ruta del retorno; no se guardaron tokens o mensajes privados. [Comprobación](supabase-return-check.json).

Para completar el recorrido real falta configurar el Site URL de Supabase con el origen HTTPS publicado y agregar la ruta `/recuperar` a los destinos permitidos. La plantilla chilena preparada en `web/auth/recovery.html` debe comprobarse/aplicarse en el proyecto alojado. Este despliegue no modificó Supabase Auth, la configuración SMTP ni las claves de Resend.

Después falta solicitar un correo nuevo desde Android, recibirlo en Gmail, abrirlo en el teléfono, elegir una contraseña propia, entrar con ella y comprobar el rechazo de la anterior. La comprobación de correo local previa no reemplaza esa validación humana. No se declara solucionada la clasificación de spam.

Servicios Villablanca permanece sin modificaciones. No se habilitaron pagos ni suscripciones. No se requiere ni se generó un nuevo AAB.

[Resumen estructurado](resumen.json).
