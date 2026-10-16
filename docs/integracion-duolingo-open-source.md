# ¿Cachaste? — Integración incremental desde referencias Duolingo open source

## Fuente comprobada y licencia
- Repositorio: https://github.com/mohannadofficial/duolingo-nextjs
- Autor: Mohanad AL Faleet, © 2024.
- Licencia: MIT (ver aviso reproducido al final).
- Archivos estudiados: `src/app/lesson/_components/quiz.tsx`, `footer.tsx`, `header.tsx` y `src/app/(main)/learn/_components/lesson-button.tsx`.

## Qué se aprovechó
1. **Reproductor por desafíos.** Del patrón de `Quiz` y `Footer`: separar respuesta, comprobación, explicación y continuación. Se añadió indicador de progreso y señal clara del siguiente paso, sin cambiar de framework.
2. **Mapa de aprendizaje.** Se adaptó la función de desplazamiento cíclico de 8 posiciones de `lesson-button.tsx` a nuestra ruta de nodos. Se mantiene el gato original, los colores, la escala y los recursos de ¿Cachaste?.
3. **Seguimiento con propósito pedagógico propio.** Nuestra selección adaptativa incorpora la certeza del estudiante (seguro, duda, azar), los errores y el uso de ayudas. Se agenda un refuerzo offline y se muestra al estudiante por qué se recomienda. Esta política **es original de ¿Cachaste?**; no se atribuye al clon.
4. **Prueba de unidad.** La certeza no revela respuestas ni cambia el umbral de aprobación. Una vez terminada la prueba, se muestran diferencias entre seguridad y acierto y se programan refuerzos de respuestas falladas o dudosas.

## Qué NO se importó
- Bases de datos, Next.js, Clerk, Stripe, ElevenLabs, corazones de pago, conexión permanente o membresías.
- Imágenes, texto, logos ni mascota de Duolingo. El gato aprobado y el material PAES se preservan.
- Restricciones que castiguen o bloqueen estudiar por equivocarse.
- Datos falsos: los puntos de habilidad deben estar probados con ejercicios distintos, no porcentajes iniciales inventados.

## Limitaciones y validación
- El clon es una referencia de código y patrón de UX, **no** un tutor pedagógico completo ni código oficial de Duolingo.
- Esta integración sigue siendo una rama separada para revisión y pruebas móviles antes de fusionar.
- El banco PAES, el material de Drive y el sistema de persistencia conservan su estructura.

## Aviso de licencia de la porción de código adaptada
MIT License

Copyright (c) 2024 Mohanad AL Faleet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
