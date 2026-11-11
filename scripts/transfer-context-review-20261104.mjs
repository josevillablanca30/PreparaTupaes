import {readFileSync} from 'node:fs';

// Explicit editorial decisions. A new item must own its stimulus; sharing a
// curricular concept does not make the source question's data interchangeable.
export const previousTransferAssessments=JSON.parse(readFileSync(new URL('../pedagogy/content-before-20261104.json',import.meta.url),'utf8'));
export const transferContextReview={
 'M1:TR-M1-007':{
  visual:{type:'bar',kind:'map-scale',labels:['1 cm','2 cm'],values:[2,4],caption:'Escala del plano: cada centímetro representa 2 km'},
  teaching:{
   intuition:['La escala es una equivalencia entre dos medidas: una sobre el plano y otra sobre el terreno. No son longitudes que se sumen entre sí.','Si duplicas la medida en el mismo plano, también se duplica la distancia real. Usa la misma razón para toda la ruta.'],
   foundation:['Una escala gráfica relaciona longitudes del dibujo y del terreno. Aquí 2 cm en el plano equivalen a 4 km reales: la razón es 4 km ÷ 2 cm = 2 km por centímetro.','Multiplica la longitud medida en el plano por esa razón. Las unidades de centímetros se cancelan y el resultado queda en kilómetros. El esquema en pantalla representa la equivalencia; no se mide con una regla sobre el celular.'],
   example:{problem:'En otro mapa, 3 cm representan 12 km. Un sendero mide 5 cm en ese mapa. ¿Cuál es su longitud real?',steps:['Dividimos 12 km entre 3 cm y obtenemos 4 km por cada centímetro del mapa.','La longitud del sendero es 5 cm × 4 km/cm = 20 km.','Comprobamos que 20/12 = 5/3: ambas longitudes mantienen la misma proporción.'],bridge:'Vuelve a la equivalencia del plano de tu pregunta; otro mapa puede usar una escala distinta.'}
  }
 },
 'M1:TR-M1-022':{
  visual:{type:'bar',labels:['Fútbol','Dibujo','Música','Lectura'],values:[12,15,15,8],caption:'Preferencias de 50 estudiantes'},
  teaching:{
   intuition:['Compara la cantidad de estudiantes de cada preferencia. Dos categorías pueden alcanzar la misma cantidad mayor sin que una deje de ser máxima.','El nombre de cada preferencia identifica una categoría; la altura de su barra representa cuántas personas la eligieron.'],
   foundation:['La frecuencia absoluta cuenta cuántas observaciones pertenecen a una categoría. Si cada estudiante da una respuesta, las frecuencias de las preferencias suman el total encuestado.','La frecuencia máxima es el mayor conteo. Si varias categorías lo alcanzan, hay empate: no corresponde elegir una sola como máxima.'],
   example:{problem:'En otra encuesta, 6 estudiantes eligen teatro, 9 ajedrez y 9 danza. ¿Hay una única preferencia máxima?',steps:['Comparamos las frecuencias 6, 9 y 9: el mayor valor es 9.','Ajedrez y danza alcanzan 9 cada una.','Ambas comparten el máximo; no hay una única preferencia modal.'],bridge:'Compara todas las categorías de tu encuesta antes de decidir si el máximo es único.'}
  }
 },
 'M1:TR-M1-021':{
  question:'Un algoritmo combina factores mediante la expresión (5⁴ × 5²) ÷ 5⁵. ¿Cuál es el factor simplificado?',
  teaching:{
   intuition:['Cuenta cuántos factores iguales hay en el numerador y cuántos se cancelan al dividir. Mantén la base: lo que cambia es la cantidad de factores.','El resultado puede ser mayor que uno; un factor 5 no describe una reducción de tamaño. Primero simplifica la expresión y después interpreta su valor.'],
   foundation:['Para una misma base a, el producto cumple aᵐ × aⁿ = aᵐ⁺ⁿ. Al dividir por aᵖ, con a distinto de cero, se obtiene aᵐ⁺ⁿ⁻ᵖ.','Multiplicar las bases o sumar el exponente del denominador cambia la operación. Con exponentes enteros positivos, cancelar factores permite comprobar la regla.'],
   example:{problem:'Simplifica (2⁵ × 2³) ÷ 2⁶ sin cambiar la base.',steps:['El numerador reúne cinco y tres factores 2: 2⁵ × 2³ = 2⁸.','Al dividir por seis factores 2, quedan dos: 2⁸ ÷ 2⁶ = 2².','Comprobamos 32 × 8 ÷ 64 = 4, que coincide con 2².'],bridge:'Aplica las operaciones del enunciado; un producto seguido de un cociente no se resuelve sumando todos los exponentes.'}
  }
 },
 'Ciencias:TR-SCI-097':{
  teaching:{
   intuition:['Cuando el pez nada con mayor esfuerzo, sus músculos requieren reponer más ATP y eliminar el CO₂ que produce su metabolismo.','Las branquias intercambian gases con el agua y la sangre los transporta. El ATP que usan los músculos se obtiene mediante procesos celulares, no se fabrica en las branquias para enviarlo al músculo.'],
   foundation:['Las branquias ofrecen una superficie de intercambio entre agua y sangre: contribuyen al ingreso de O₂ y a la salida de CO₂. La circulación conecta ese intercambio con los tejidos.','La respiración celular permite obtener ATP a partir de nutrientes. Una mayor demanda metabólica puede acompañarse de más consumo de O₂ y producción de CO₂; esto no implica que el agua o la sangre fabriquen oxígeno.'],
   example:{problem:'En dos períodos comparables, un pez nada lentamente y luego con más intensidad. Con oxígeno disponible, aumenta su consumo de O₂. ¿Cómo se relaciona esto con sus músculos?',steps:['El trabajo muscular requiere ATP y las células deben reponerlo mediante su metabolismo.','Las branquias favorecen el aporte de O₂ desde el agua, y la sangre lo distribuye hacia los tejidos.','El CO₂ producido se transporta para eliminarlo. Intercambio, circulación y respiración celular cumplen funciones distintas y coordinadas.'],bridge:'Distingue el órgano que intercambia gases de las células que obtienen y utilizan ATP.'}
  }
 }
};
