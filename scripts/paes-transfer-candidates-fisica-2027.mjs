/* Candidatos originales de Física para revisión pedagógica. No se integran automáticamente al banco comercial. */
const design=(baseTask,newTask)=>({baseTask,newTask,review:'Se evalúa una aplicación nueva y no la simple reproducción de datos del ítem base.'});
export const scienceCandidates=[
 {
  base:'Ciencias:SCI-092',id:'TR-SCI-088',
  question:'Un carro avanza 6 m horizontalmente mientras una persona ejerce sobre él una fuerza constante de 20 N que forma 60° con la dirección del desplazamiento. Si cos 60° = 0,5, ¿cuánto trabajo realiza esa fuerza?',
  options:['120 J, porque basta multiplicar fuerza por distancia','60 J, porque solo contribuye la componente paralela al desplazamiento','12 J, porque hay que dividir la fuerza entre la distancia','0 J, porque la fuerza no es horizontal'],answer:1,
  steps:['El trabajo mecánico de una fuerza constante depende de la componente de la fuerza que actúa paralelamente al desplazamiento: W = F·d·cos(θ).','La fuerza vale 20 N, el desplazamiento 6 m y el ángulo es 60°, de modo que la componente útil corresponde a 20 × 0,5 = 10 N.','Entonces W = 10 N × 6 m = 60 J. La fuerza oblicua puede realizar trabajo, pero menos que una fuerza del mismo módulo totalmente paralela.'],
  errors:['El cálculo de 120 J omite el ángulo y supone incorrectamente que toda la fuerza es paralela al movimiento.','','Dividir fuerza por distancia no entrega trabajo mecánico y además produce unidades incompatibles con el joule.','Una fuerza oblicua tiene componente paralela distinta de cero cuando el ángulo no es recto respecto del desplazamiento.'],
  transferDesign:design('Identificar trabajo y desplazamiento','Determinar el trabajo de una fuerza oblicua usando su componente paralela'),
  sourceTrace:{subject:'Física',officialEje:'Energía · Trabajo de una fuerza',reviewStatus:'pendiente-cotejo-demre-y-drive',sourceUse:'Problema numérico original'}
 },
 {
  base:'Ciencias:SCI-152',id:'TR-SCI-089',
  question:'Una estudiante grita hacia una pared y escucha el eco 0,8 s después. Si el sonido se propaga aproximadamente a 340 m/s, ¿a qué distancia está la pared?',
  options:['272 m, porque el tiempo corresponde solo al viaje de ida','136 m, porque el sonido recorre ida y vuelta antes de escucharse el eco','425 m, porque hay que dividir la rapidez por el tiempo','68 m, porque se divide el tiempo por cuatro'],answer:1,
  steps:['El eco se produce cuando una onda sonora se refleja y regresa al punto de emisión, de modo que el tiempo observado incluye tanto ida como vuelta.','En 0,8 s el sonido recorre 340 × 0,8 = 272 m en total, no únicamente entre la estudiante y la pared.','La distancia a la pared es la mitad del trayecto total: 272 / 2 = 136 m. Esta interpretación evita confundir distancia de ida con recorrido completo.'],
  errors:['272 m es la distancia total del sonido durante ida y vuelta, no la separación de la pared.','','Dividir rapidez entre tiempo no corresponde a la relación distancia = rapidez × tiempo y tampoco contempla el recorrido del eco.','El trayecto contiene dos tramos equivalentes, no cuatro; la distancia a la pared requiere dividir entre dos.'],
  transferDesign:design('Reconocer reflexión del sonido','Aplicar rapidez de propagación a la distancia de ida y vuelta en un eco'),
  sourceTrace:{subject:'Física',officialEje:'Ondas · Reflexión del sonido',reviewStatus:'pendiente-cotejo-demre-y-drive',sourceUse:'Problema numérico original'}
 }
];
