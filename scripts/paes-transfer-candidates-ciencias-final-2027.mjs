/* Transferencias candidatas para los dos objetivos de Ciencias todavía sin evidencia suficiente. */
export const scienceRemainingCandidates=[
 {base:'Ciencias:SCI-122',id:'TR-SCI-095',
 question:'Dos grupos de plantas reciben distinta cantidad de horas de luz cada día, pero la misma agua y suelo. Tras 21 días se mide el aumento de altura en centímetros. ¿Qué variable dependiente permite contrastar la pregunta sobre el efecto de la luz?',
 options:['Horas de luz por día asignadas a cada grupo','Cantidad de agua igual para ambos grupos','Aumento de altura medido al terminar los 21 días','Tipo de suelo conservado en todas las macetas'],answer:2,
 steps:['La variable independiente es la condición que se modifica intencionadamente: el número de horas de luz diaria que recibe cada grupo.','El agua y el tipo de suelo permanecen constantes para evitar que sus diferencias expliquen los resultados; son variables controladas.','La variable dependiente es la respuesta medida frente al cambio de luz: el aumento de altura en centímetros durante los 21 días.'],
 errors:['Las horas de luz son el tratamiento que se modifica y, por lo tanto, corresponden a la variable independiente.','El agua se mantiene igual para ambos grupos; al no variar intencionadamente, actúa como variable controlada.','','El tipo de suelo es una condición que se procura mantener constante, no el resultado de crecimiento que se mide.'],
 transferDesign:{baseTask:'Identificar medición en un estudio de polinizadores',newTask:'Separar tratamiento, controles y crecimiento medido en un ensayo de plantas'},
 sourceTrace:{subject:'Biología',officialEje:'Habilidades científicas · variables experimentales',reviewStatus:'pendiente-cotejo-demre-y-drive'}
 },
 {base:'Ciencias:SCI-096',id:'TR-SCI-096',
 question:'Dos parlantes emiten sonidos en el mismo salón. El sonido A tiene frecuencia de 200 Hz y el B de 400 Hz, pero ambos se reproducen con igual nivel de intensidad sonora. ¿Qué percibirá normalmente un oyente?',
 options:['B será más agudo que A, aunque no necesariamente más intenso','B será dos veces más intenso solo por duplicar la frecuencia','Ambos tendrán el mismo tono porque viajan por el mismo aire','B viajará al doble de rapidez en el mismo aire'],answer:0,
 steps:['La frecuencia describe cuántas oscilaciones ocurren por segundo y está vinculada con el tono que percibimos.','Al comparar 400 Hz con 200 Hz, el sonido B presenta mayor frecuencia y por ello corresponde a un tono más agudo.','La intensidad se indicó igual para ambos sonidos y, en el mismo aire, la rapidez de propagación no se duplica por aumentar la frecuencia.'],
 errors:['','La frecuencia determina principalmente el tono; no permite afirmar por sí sola que la intensidad de B se haya duplicado.','Compartir el medio de propagación no obliga a tener el mismo tono si las frecuencias son diferentes.','En el mismo medio y condiciones, la rapidez del sonido no cambia de esa manera por duplicar la frecuencia.'],
 transferDesign:{baseTask:'Relacionar frecuencia con tono',newTask:'Comparar tono, intensidad y velocidad en dos sonidos del mismo medio'},
 sourceTrace:{subject:'Física',officialEje:'Ondas · frecuencia, tono e intensidad',reviewStatus:'pendiente-cotejo-demre-y-drive'}
 }
];