# Traspaso web comercial de ¿Cachaste?

Verificado el 12 de noviembre de 2026, hora de Chile.

- Rama de trabajo `work/cachaste-web-comercial-cierre-20261112`.
- [PR #17](https://github.com/josevillablanca30/PreparaTupaes/pull/17) abierto, en borrador y fusionable al momento de la verificación. Base `work/cachaste-web-unificada-20261106` en `62b64ebb95d62b470729b3c8bb5584edf8db0ed0`.
- Último commit técnico verificado `5f67b617232ce26c486d10c50d441a9972f94161`. El commit de este traspaso agrega solo documentación. Consulta la punta remota en [los commits del PR](https://github.com/josevillablanca30/PreparaTupaes/pull/17/commits) o con `git log -1 origin/work/cachaste-web-comercial-cierre-20261112`.
- [Sitecacho](https://sitecacho.cl/) sirve la revisión `8d209b8a9565a9989baecef17acc6cf2d09b4c9f` según [version.json](https://sitecacho.cl/version.json), con `paymentsEnabledByBuild: false`. Las pruebas del sitio publicado corresponden a esa revisión.

## CI y corrección

El commit inicial `a5d05625650064ca20678310ad5df478d825a1c6` pasó el [CI comercial del PR](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43293309714). La [auditoría de compilación de la rama](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43293297726) falló en `verify-android.mjs` con `fatal: bad object add8a5979d28cb1f7598767bb4bf1ad7b8328937`. El checkout de un solo commit omitía las revisiones históricas. Reproduje la falla con un clon superficial y confirmé que también se necesitan referencias de otras ramas para la verificación de contenido.

[La corrección](https://github.com/josevillablanca30/PreparaTupaes/commit/5f67b617232ce26c486d10c50d441a9972f94161) agrega `fetch-depth: 0` a `.github/workflows/web-unified-audit.yml`, como en el workflow comercial. Con las referencias completas pasaron el build local, la inspección de la distribución y las cuatro suites de CI. El guard de Android conserva sus comprobaciones.

| Prueba | Resultado en el commit corregido |
| --- | --- |
| Auditoría de la rama | Compilación de cinco asignaturas, resguardo de Android e inspección de la distribución aprobados. El build empaquetó 124 archivos privados detrás del worker. [Ejecución](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43294335879) |
| Guardrails comerciales del PR | 18/18 pruebas de navegador en 320 px, 390 px y escritorio. 26/26 pruebas de Node de seguridad del gateway, retorno de autenticación, progreso y resguardos comerciales. [Ejecución](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43294349152) |
| Guardrails comerciales de la rama | Aprobados. [Ejecución](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43294335894) |
| Auth, recuperación y sincronización en Node local | 15/15 pruebas adicionales en `web/tests/auth.test.mjs`, `web/tests/recovery-flow.test.mjs` y `web/tests/progress-runtime.test.mjs`. Usan respuestas simuladas. |
| Navegador adicional con backend local simulado | El Chromium del entorno terminó antes de las aserciones porque su socket local devolvió `Operation not permitted`. Los 10 casos seleccionados quedaron pendientes de reejecutar con un Chromium funcional. |

Las pruebas automatizadas verificaron el bloqueo del contenido privado sin sesión, el rechazo de identidad ajena y sesiones vencidas o sin acceso, la protección de recursos internos, la limpieza del retorno OAuth y el bloqueo de contratación en la vista de prueba. Los casos con respuestas simuladas cubren el comportamiento del código bajo esas condiciones.

## Verificación real en Sitecacho

| Flujo | Evidencia observada |
| --- | --- |
| Landing | Cargó con la mascota, el aviso de revisión y los precios semanal, mensual y anual. La página publicada incluye `noindex,nofollow`. |
| Acceso anónimo | Las solicitudes sin sesión a `/app/inicio.html` y `/app/daily-catalog.js` devolvieron HTTP 401. |
| Cuenta y preparación | La sesión de tester existente mostró acceso verificado y abrió `/app/inicio.html` con las cinco asignaturas. Quedó pendiente iniciar una sesión nueva y abrir una lección individual. |
| Registro | `/api/config` informó `signupEnabled: true`, `authReturnReady: false` y `googleAuthEnabled: false`. Quedó pendiente enviar y confirmar un registro real. |
| Recuperación | `/recuperar` mostró el campo de correo y el botón de envío. La respuesta incluyó `Cache-Control: private, no-store` y `Referrer-Policy: no-referrer`. Quedaron pendientes el correo, su enlace y el cambio de contraseña. |
| Rankings y duelos | La sesión abrió el ranking regional de M1, que mostró la categoría vacía, y el panel de duelos con desafío por apodo, código y rival aleatorio. Quedaron pendientes posiciones con datos y una partida completa. |
| Tutor, ensayos y persistencia | El selector de asignaturas cargó. Quedaron pendientes una sesión de tutor, ensayos Express y completo, y la verificación de avance en dos contextos de navegador. |

La comprobación en producción usó navegación y solicitudes de lectura con la sesión de tester existente. No se crearon cuentas, avances de prueba ni partidas, ni se solicitó un correo o un pago.

## Continuación por prioridad

1. **P0 · Confirmar la punta y CI.** Abre el PR #17 y revisa el último SHA. Comprueba `commercial-smoke` y `unified-web-build` en GitHub Actions, incluidas las ejecuciones por push. Si el build devuelve `bad object`, comprueba que checkout incluya el historial y las referencias de todas las ramas antes de tocar `verify-android.mjs`.
2. **P0 · Probar Auth real en un entorno de pruebas autorizado.** Usa una cuenta de QA habilitada y un correo de pruebas bajo control del usuario. En `/cuenta.html` comprueba ingreso con correo y contraseña, vuelta a la ruta solicitada y acceso habilitado. Para registro, usa solo una identidad de QA autorizada y verifica el código recibido. En `/recuperar` comprueba recepción, enlace, cambio de contraseña en esa cuenta de QA e ingreso posterior. Registra entorno, SHA y resultado, sin copiar contraseñas ni tokens. Mantén los flags y ajustes de producción.
3. **P1 · Validar aprendizaje y progreso.** En la misma cuenta de QA, desde `/app/inicio.html` abre una lección M1, ejecuta el Tutor y completa un Ensayo Express. Abre un ensayo completo y comprueba que el intento se pueda retomar. Comprueba que el avance se guarde en un segundo contexto autenticado con la misma cuenta y que otra cuenta de QA no lo herede.
4. **P1 · Validar competencia con dos cuentas de QA.** Abre `/app/competencia.html#rankings` y cambia ámbito y asignatura. En `/app/competencia.html#duelos` completa una partida y comprueba resultado, historial y tratamiento del tiempo agotado. Coordina cambios del motor con [PR #16](https://github.com/josevillablanca30/PreparaTupaes/pull/16) y sigue [docs/duels2-integration.md](duels2-integration.md).
5. **P0 para apertura comercial · Coordinar con el [PR #14](https://github.com/josevillablanca30/PreparaTupaes/pull/14).** Usa la evidencia del equipo de Mercado Pago para la validación sandbox. Mantén los cobros reales deshabilitados, el aviso de revisión y `noindex`. La fusión, el despliegue y los cambios de producción requieren autorización explícita.

Desde una copia nueva, clona con historial completo. Si ya tienes el repositorio, actualiza todas las referencias y cambia a la rama de trabajo.

```bash
git clone --branch work/cachaste-web-comercial-cierre-20261112 https://github.com/josevillablanca30/PreparaTupaes.git
cd PreparaTupaes
git fetch origin '+refs/heads/*:refs/remotes/origin/*' --tags
git log -1 --oneline
gh pr checks 17 --repo josevillablanca30/PreparaTupaes
gh run list --repo josevillablanca30/PreparaTupaes --commit "$(git rev-parse HEAD)" --limit 10
npm ci
node web/scripts/build.mjs
node --test tests/web-commercial-launch-guard.test.mjs tests/web-gateway-security.test.mjs tests/web-progress-merge.test.mjs tests/web-auth-return.test.mjs
npx playwright install chromium
npx playwright test --config playwright.web-commercial.config.mjs
```

Para reejecutar los casos adicionales con el servidor simulado del repositorio, tras compilar y con Chromium instalado:

```bash
npx playwright test registration.spec.mjs recovery.spec.mjs web-commercial.spec.mjs \
  --config web/playwright.config.mjs --project=Desktop-Chrome \
  --grep 'A closed registration|Email signup|The public recovery page|A recovery hash|login crosses|M1: real lesson interaction|M1: full PAES exam|M1: complete Express|two browser contexts|four independent rankings'
```

Tras cada corrección acotada, ejecuta la prueba pertinente y `git diff --check`. Guarda un commit, haz push a la rama del PR #17 y verifica el CI del nuevo SHA. Mantén los cambios de los PR #14 y #16 en sus ramas.

## Actualización de cierre — 12 noviembre 2026

- PR #17 permanece abierto en borrador; no se ha fusionado ni desplegado esta rama a producción.
- CI `Web commercial guardrails` #73 aprobado en `49d3c5fc0265c124b142c697e93fae262c6f8ce6`.
- Sincronización: pruebas de guardado durante solicitudes, reintentos de 503, expiración 401, conflictos entre dispositivos, resolución sin perder respuestas nuevas y recuperación local al reabrir; CI #71 y #73 aprobados.
- `f729bec36c7b66e4e4b9ebb23aaa55017d607ff1` añade al CI la prueba Playwright existente de M1 (lección, tutor, alternativas y recarga). **Comprobar su CI #75 antes de declararla aprobada.**
- Recuperación de contraseña: el usuario confirmó una recuperación real exitosa en el sitio; no equivale a verificación de registro nuevo o autenticación completa de QA.
- **Bloqueos externos pendientes:** flujo completo real de lección/ensayo con cuenta de QA, persistencia entre dos dispositivos reales, Auth nuevo, Duelos 2.0 PR #16, sandbox Mercado Pago PR #14 y autorización expresa de despliegue. No habilitar pagos reales ni quitar `noindex`.

### Evidencia nueva — CI #80 aprobado

- Commit `f00adc70e293e7723737cc1bb61a53381cf6ea4b`: [GitHub Actions #80](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43305603858) terminó **success**.
- Pasaron compilación, protección de recursos educativos privados, pruebas responsive 320/390/escritorio, controles Node y los casos Playwright seleccionados de M1: tutor y lección, Ensayo PAES completo, Express y sincronización entre contextos de navegador con aislamiento de otra identidad.
- La evidencia corresponde al servidor QA simulado del repositorio, **no** a una prueba end-to-end de producción con Supabase y Mercado Pago reales. Se mantienen pendientes Auth QA real, sandbox de pagos y duelos reales antes de lanzamiento.

### Validación transversal PAES — CI de `3a06fba`

- [Web commercial guardrails #82](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43307237386): **success**.
- [Web commercial guardrails #83](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43307252312): **success**.
- [Web unified non-payment audit](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43307237385): **success**.
- El flujo comercial ejecuta pruebas Playwright de tutor, mini práctica, alternativas y recarga a 390 px en M1, M2, Lectura, Historia y Ciencias (Biología, Física, Química, TP), junto con M1 completo, Express y sincronización entre navegadores.
- PR #14 (pagos), #16 (duelos) y #17 (web) permanecen abiertos y sin conflictos de fusión según GitHub; esto **no** acredita integración funcional entre los tres. No fusionar ni activar cobros sin autorización.

### Autenticación QA validada — commit `ee593198`

- [Guardrails #85](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43308699171): **success**.
- [Guardrails #86](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43308709002): **success**.
- [Auditoría web sin pagos](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43308699245): **success**.
- Pasaron pruebas de registro y recuperación de contraseña mediante el servidor QA simulado, además de todas las pruebas comerciales, educativas, ensayos y sincronización.
- **No equivale** a prueba real con correo, Supabase de producción o cobros; estos siguen como criterios de publicación pendientes. No desplegar, fusionar ni activar cobros sin aprobación.

### Puerta de integración Duelos 2.0 — verificación del 12 de noviembre

- PR #16, commit `b0460b8b4e252b95f2aecf2d87ee58b21d1142c2`: [Actions 43273490300](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43273490300) confirma **success** en `isolated-tests`, `realtime-qa` y `android-candidate`.
- PR #17, commit `bb6b219c4c243588ddd57f99f3aa9698c7e9e734`: [guardrails 43310236210](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43310236210), [guardrails 43310243980](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43310243980) y [auditoría 43310236196](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43310236196) **success**.
- Las validaciones son **por rama**; todavía no prueban una combinación fusionada de #16 y #17. Antes de integrar, validar en rama temporal la compilación web, duelos entre dos cuentas, migración y compatibilidad Android; coordinar despliegue frontend/backend para evitar clientes antiguos con temporizadores nuevos.
- No aplicar migración a producción, fusionar ni desplegar sin aprobación explícita. Mercado Pago real continúa desactivado.


### Integración web comercial + Duelos 2.0 — PR #18 (12 de noviembre)

- Rama: `work/cachaste-integracion-duelos-web-20261112`, basada en PR #17 (`c4866bad816d74719611c71de0b11b298d658c46`), con cuatro archivos de temporizadores y QA provenientes del PR #16.
- [PR #18](https://github.com/josevillablanca30/PreparaTupaes/pull/18): **borrador, sin fusionar**; GitHub informó `mergeable_state: clean` antes del último commit de documentación.
- [Duelos 2 CI 43311886050](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43311886050): **success** en `isolated-tests`, `realtime-qa`, `android-candidate` y APK debug generado (artifact `cachaste-duels2-android-debug`, vence 2026-11-26).
- [Guardrails comerciales 43314852783](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43314852783): **success**.
- [Guardrails comerciales 43314838552](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43314838552): **success**.
- **Alcance:** CI de integración sobre una misma rama; no acredita prueba real entre dos cuentas/dispositivos ni despliegue con migración Supabase productiva. No implica aprobación para publicar.
- **Pendientes:** QA real de duelo (tiempos, desconexión, resultado y revancha), compatibilidad Android antiguo, ensayo de migración en staging, pagos sandbox reales, y autorización de merge/despliegue. Mantener cobros reales desactivados.


### Cierre verificado de integración Duelos 2.0 — 12 de noviembre (actualización)

- [PR #18](https://github.com/josevillablanca30/PreparaTupaes/pull/18) **fusionado** con autorización del responsable en la rama comercial. Commit de merge: `17cb2a6927efd283df26ac30ca4805e2775f2f1c`. Esta sección reemplaza el estado histórico de «borrador, sin fusionar» indicado arriba.
- CI **posterior al merge** del commit `17cb2a69`: [Duelos 2](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43327220066), [guardrails comerciales](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43327220045), [auditoría web sin pagos](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43326994486) y [guardrails push](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/43326994478), todos **success**.
- Pruebas SQL en Supabase local efímero: M1 vence a 120 segundos, Lectura a 90 segundos, respuesta tardía no sobrescribe error y Cron procesa vencimiento sin cliente conectado. Las pruebas automatizadas de Realtime y candidato Android pasaron.
- [PR #17](https://github.com/josevillablanca30/PreparaTupaes/pull/17) continúa **abierto como borrador** hacia `work/cachaste-web-unificada-20261106`. [PR #14](https://github.com/josevillablanca30/PreparaTupaes/pull/14) de Mercado Pago sigue **separado y sin fusionar**.
- **No se ha publicado la rama comercial**, no se ha aplicado la migración a Supabase de producción y no se han habilitado cobros reales. Faltan QA manual entre dos usuarios/dispositivos, prueba sandbox de suscripciones y decisión de despliegue coordinado. No confundir CI local con validación de producción.
