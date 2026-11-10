# Duelos 2.0 — integración aislada

Base web inspeccionada: `1b54a0789b81a120a3593af5ffbd32933360e3ee`.
Referencia Android inspeccionada: `e3a0434d70042afc40dccdbf6d57307a16c2e16e`.
Rama exclusiva: `work/cachaste-duelos-2-20261110`.

## Límites

No desplegar sitecacho.cl ni modificar pagos, acceso, suscripciones, configuración
de lanzamiento o migraciones de Work 1. La base remota se inspeccionó solo en lectura.
El motor existente está en el esquema privado `cachaste`, no en `public`.

## Diseño

API independiente `cachaste_duels2`, tablas privadas propias, banco PAES existente,
perfiles/fotografías existentes y saldo `cachaste.stats` compartido con el ranking
de duelos. Las partidas antiguas conservan su API y su repaso.

Diez preguntas iguales, orden diferente, 40 minutos desde la activación. Cada
acierto favorece al autor y cada error al rival. Sin desempate por tiempo.
Resultados humanos ±3; virtuales ±1; empate 0; saldo mínimo 0. Libro de movimientos
con clave única por duelo, persona y temporada. Dominio académico independiente.

Realtime publica exclusivamente participantes, identificador, estado y balance.
No publica respuestas, preguntas, aciertos, progreso del rival ni contador de eventos.
Los planes de bots se generan al activar la partida, sin mirar al estudiante.

## Aplicación de base de datos

La migración debe revisarse y aplicarse junto con el responsable del lanzamiento.
No se ha aplicado en producción. Requiere las migraciones competitivas existentes.
La publicación de Realtime y el mantenimiento periódico deben verificarse en el
entorno de integración antes de habilitar esta experiencia a estudiantes.

## Validación

Pendiente de implementar y ejecutar. Este documento se actualizará con resultados
reales, comandos reproducibles y limitaciones de la entrega.
