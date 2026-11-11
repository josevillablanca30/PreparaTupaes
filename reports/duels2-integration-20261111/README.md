# Revisión de integración de Duelos 2.0

Esta candidata combina el PR [#7](https://github.com/josevillablanca30/PreparaTupaes/pull/7), cabeza `16efda616452f4d28c6e5ec75ed4c77171b7092b`, con la rama de lanzamiento en `89b71fbc8f19750afaefd5fe15f068c521179a82`. La combinación fue limpia. La rama de Work 2 no se modificó y esta candidata no se publicó en Pages.

## Comprobado en esta revisión

- **182/182 pruebas locales** de backend web, pagos, seguridad, compatibilidad, Duelos 2 y transformación web/Android. Ejecución completa en [local-regression.txt](local-regression.txt). La referencia Android se recuperó antes de repetir la suite completa; no se atribuye aprobación al primer intento con esa referencia ausente.
- Build de las cinco materias y **124 archivos cifrados autenticados**, sin bancos educativos públicos ni clave dentro del Worker.
- Permiso `wss://jmobinmdwrmdqrxtcruj.supabase.co` incorporado tanto a la CSP del Worker como a la etiqueta CSP del HTML empaquetado. El Worker lo permite únicamente en `/app/competencia.html`, sin comodines ni permisos WebSocket nuevos en acceso, recuperación o materias.
- La comprobación descifra y autentica el documento construido, verifica su etiqueta CSP y la contrasta con la política real del gateway. No modifica el HTML Android de referencia.
- La CI de esta rama repite los tests combinados, PostgreSQL concurrente, dos sesiones móviles de navegador, empaquetado web y APK debug. Sus resultados se documentarán al terminar; no se declaran aprobados anticipadamente.

## Requisitos antes de habilitar públicamente

La lectura de Supabase a las **21:45 del 10 de noviembre de Chile** confirmó `duels2Installed=false`, `cronEnabled=false` y ninguna tabla Duelos 2 publicada. Pagos reales cerrados, cero pagos y diez beneficios anuales se mantienen.

1. El adaptador del PR enruta también el dashboard hacia `public.cachaste_duels2`. Publicar ese cliente antes de instalar la migración dejaría ese recorrido sin su RPC. La candidata no debe reemplazar la web estable todavía.
2. Revisar y aplicar exclusivamente `20261110130920_cachaste_duels2_isolated.sql`, según [la guía entregada](../../docs/duels2-integration.md). Confirmar RLS, revocación de sesiones y publicación únicamente de la proyección pública sanitizada.
3. Instalar el mantenimiento dedicado mediante `duels2/operations.sql` y comprobar su ejecución sin clientes abiertos. La disponibilidad de `pg_cron` no equivale a tenerlo habilitado.
4. Ejecutar Realtime alojado con dos cuentas reales de prueba. La prueba local de navegador del PR sustituye Auth y usa consultas; no demuestra WebSocket alojado.
5. Instalar y probar el APK en Android antes de declarar validación en un dispositivo. Compilarlo no acredita esa prueba.

No se aplicaron migraciones, scheduler ni cambios de privilegios premium en el proyecto compartido durante esta revisión. No se habilitó ningún cobro real.
