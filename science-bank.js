/* Cachaste Ciencias — preguntas originales, práctica inicial PAES Regular 2026 / Admisión 2027.
   No reproducir material del Drive ni presentar como ítems oficiales. */
const SCIENCE_TOPICS={
 'Biología':['Organización, estructura y actividad celular','Procesos y funciones biológicas','Herencia y evolución','Organismo y ambiente'],
 'Física':['Ondas','Mecánica','Energía – Tierra','Electricidad'],
 'Química':['Estructura atómica','Química orgánica','Reacciones químicas y estequiometría']
};
const SCIENCE_SKILLS=['Observar y plantear preguntas','Planificar y conducir una investigación','Procesar y analizar evidencia','Evaluar','Comunicar'];
const SCIENCE_BANK=[];
function sciAdd(subject,area,question,options,answer,wrong,steps,easy,example,extra={}){
 const id='SCI-'+String(SCIENCE_BANK.length+1).padStart(3,'0');
 if(!SCIENCE_TOPICS[subject]?.includes(area)||options.length!==4||new Set(options).size!==4||wrong.length!==4||!Number.isInteger(answer)||answer<0||answer>3||steps.length<2)throw Error('Pregunta no válida: '+id);
 const explanations=wrong.map((reason,i)=>i===answer?'¡Cachaste! '+steps[steps.length-1]:reason);
 SCIENCE_BANK.push({id,subject,area,question,options,answer,explanations,steps,easy,example,module:extra.module||'MC',skill:extra.skill||'Procesar y analizar evidencia',difficulty:extra.difficulty||'inicial',review:'pendiente',origin:'original'});
}
// BIOLOGÍA — MÓDULO COMÚN
sciAdd('Biología','Organización, estructura y actividad celular','Una célula muscular utiliza mucha energía para contraerse. ¿Qué organelo es especialmente abundante en ella?',['Ribosomas','Mitocondrias','Retículo endoplasmático liso','Complejo de Golgi'],1,['Los ribosomas sintetizan proteínas; no son la principal fuente de ATP para la contracción.','','El retículo endoplasmático liso de células musculares regula el calcio, pero no genera la mayor parte del ATP.','El complejo de Golgi procesa y distribuye proteínas, no produce la energía necesaria para contraerse.'],['La contracción necesita ATP.','Las mitocondrias producen gran parte del ATP por respiración celular.'],'Piensa en una fábrica: las mitocondrias abastecen de energía a las máquinas.','Una célula cardíaca también requiere abundantes mitocondrias.');
sciAdd('Biología','Organización, estructura y actividad celular','¿Qué estructura regula de manera selectiva el paso de sustancias hacia el interior y exterior de una célula?',['Pared celular','Membrana plasmática','Envoltura nuclear','Citoesqueleto'],1,['La pared aporta soporte, pero no controla selectivamente el transporte como la membrana.','','La envoltura nuclear regula intercambios con el núcleo, no el paso entre toda la célula y el medio externo.','El citoesqueleto sostiene y organiza el interior celular, pero no es la barrera selectiva exterior.'],['Las células intercambian materia con su entorno.','La membrana plasmática presenta permeabilidad selectiva.'],'Imagínala como una puerta que permite pasar algunas sustancias y limita otras.','El oxígeno puede atravesar la membrana por difusión.');
sciAdd('Biología','Organización, estructura y actividad celular','Una célula fabrica muchas proteínas que serán secretadas. ¿Qué organelo interviene directamente en su modificación y empaquetamiento?',['Complejo de Golgi','Retículo endoplasmático rugoso','Ribosomas libres','Lisosomas'],0,['','El retículo rugoso participa en la síntesis y procesamiento inicial de proteínas secretadas, pero el Golgi las modifica y clasifica para su destino.','Los ribosomas fabrican proteínas; no realizan el empaquetamiento final de secreción.','Los lisosomas degradan componentes celulares, no empaquetan proteínas para exportarlas.'],['Las proteínas se sintetizan y procesan en distintas estructuras.','El complejo de Golgi modifica, clasifica y empaqueta sustancias destinadas a otros lugares.'],'Es como el centro de clasificación y despacho de paquetes de la célula.','Las células secretoras de enzimas tienen un aparato de Golgi desarrollado.');
sciAdd('Biología','Procesos y funciones biológicas','Durante una sinapsis química, ¿qué atraviesa el espacio sináptico para transmitir la señal?',['Neurotransmisores','Impulsos eléctricos propagados por el espacio sináptico','Vesículas sinápticas completas','Receptores de membrana postsinápticos'],0,['','El potencial de acción viaja por la membrana neuronal, pero la transmisión a través de una sinapsis química ocurre por mensajeros químicos.','Las vesículas liberan su contenido por exocitosis; no atraviesan normalmente completas el espacio sináptico.','Los receptores se encuentran en la membrana de la célula receptora y detectan neurotransmisores.'],['La señal llega al terminal de la neurona.','Se liberan neurotransmisores que se unen a receptores de otra célula.'],'Imagina mensajes químicos que pasan de una neurona a la siguiente.','La acetilcolina actúa como neurotransmisor en la unión neuromuscular.');
sciAdd('Biología','Procesos y funciones biológicas','En un arco reflejo simple, ¿cuál es su ventaja funcional?',['Permitir respuestas rápidas a estímulos','Exigir una decisión consciente antes de cada respuesta','Transmitir la señal únicamente por vías hormonales','Procesar siempre la información primero en la corteza cerebral'],0,['','El circuito reflejo puede generar una respuesta sin deliberación consciente previa.','La vía refleja es nerviosa; la señal hormonal es distinta y generalmente más lenta.','Muchos reflejos se integran a nivel medular o del tronco encefálico, sin requerir procesamiento cortical previo.'],['El receptor detecta un cambio en el ambiente.','El circuito nervioso coordina una respuesta rápida, a menudo antes de la percepción consciente completa.'],'Retirar la mano de una superficie caliente es un ejemplo clásico.','La respuesta motora puede iniciarse mediante circuitos de la médula espinal.');
sciAdd('Biología','Procesos y funciones biológicas','¿Cuál de las siguientes afirmaciones sobre el preservativo es correcta?',['Es un método de barrera que puede reducir el riesgo de ITS','Protege completamente de cualquier ITS en toda situación','Impide que ocurra el ciclo menstrual','Solo funciona si se usa después de la relación sexual'],0,['','La protección no es absoluta y depende, entre otros factores, del uso correcto.','El preservativo no detiene el ciclo menstrual.','Se utiliza durante el contacto sexual, no únicamente después.'],['El preservativo actúa como barrera física.','Su uso correcto disminuye la probabilidad de transmisión de diversas ITS y de embarazo.'],'El preservativo es una barrera física que reduce el intercambio de fluidos y el contacto con algunas zonas expuestas durante una relación sexual. Si se usa correctamente desde el inicio y durante todo el contacto sexual, disminuye el riesgo de muchas ITS, pero no lo elimina por completo.','Por ejemplo, el preservativo reduce considerablemente el riesgo de infecciones transmitidas por fluidos, como el VIH, si se usa correctamente. Sin embargo, infecciones como el VPH o el herpes también pueden transmitirse por contacto con piel no cubierta. Por eso la respuesta dice que reduce el riesgo y no que protege al cien por ciento.');
sciAdd('Biología','Herencia y evolución','En la mitosis de una célula somática, ¿qué sucede normalmente con el número de cromosomas de las células hijas?',['Se conserva respecto de la célula madre','Se reduce siempre a la mitad','Se duplica en cada célula hija','Desaparecen los cromosomas'],0,['','La reducción a la mitad es propia de la meiosis, no de la mitosis.','La replicación previa del ADN no duplica permanentemente el número cromosómico por célula hija.','Los cromosomas se distribuyen entre las nuevas células.'],['El ADN se replica antes de la división.','La mitosis reparte la información genética de modo que ambas células hijas conserven la dotación cromosómica.'],'Es como copiar un manual completo para cada célula nueva.','Una célula humana somática con 46 cromosomas origina normalmente dos células con 46.');
sciAdd('Biología','Herencia y evolución','¿Por qué la meiosis contribuye a la variabilidad genética?',['Porque permite recombinación y distribución de cromosomas','Porque impide cualquier intercambio de ADN','Porque produce solo células idénticas a la madre','Porque elimina todos los genes dominantes'],0,['','Durante la meiosis pueden recombinarse cromosomas homólogos.','Los productos de la meiosis no suelen ser genéticamente idénticos.','La meiosis no elimina de forma universal genes dominantes.'],['Durante la meiosis I se pueden intercambiar segmentos entre cromosomas homólogos.','La segregación y combinación de cromosomas contribuyen a gametos diferentes.'],'Piensa en barajar cartas genéticas y repartir combinaciones distintas.','Dos gametos de un mismo organismo pueden portar combinaciones genéticas diferentes.');
sciAdd('Biología','Herencia y evolución','En una población de insectos, algunos presentan resistencia heredable a un insecticida. ¿Qué resultado es esperable tras varias generaciones de exposición?',['Puede aumentar la proporción de resistentes','Todos los insectos se vuelven resistentes durante su vida','El insecticida crea por necesidad la mutación correcta en cada individuo','La resistencia deja de heredarse automáticamente'],0,['','La evolución de la población no requiere que cada individuo adquiera resistencia.','La selección natural favorece variantes existentes; no crea mutaciones dirigidas por necesidad.','Una característica heredable puede continuar transmitiéndose.'],['Ya existe variación heredable en la población.','Los resistentes sobreviven y dejan descendencia con mayor probabilidad, elevando su frecuencia.'],'La selección cambia proporciones a lo largo de generaciones, no por decisión de un individuo.','Las bacterias resistentes a antibióticos ilustran un principio semejante.');
sciAdd('Biología','Organismo y ambiente','En la fotosíntesis oxigénica, ¿cuál es la fuente directa del oxígeno molecular liberado?',['El agua','El dióxido de carbono','La glucosa','El nitrógeno atmosférico'],0,['','El carbono del CO₂ termina en compuestos orgánicos; no es la fuente directa del O₂ liberado.','La glucosa es un producto de la fijación de carbono.','El nitrógeno no es la fuente del oxígeno gaseoso fotosintético.'],['Durante las reacciones luminosas se separan moléculas de agua.','De ese proceso proviene el oxígeno molecular liberado.'],'El agua aporta el oxígeno que sale como gas durante la fotosíntesis.','La luz impulsa las reacciones fotosintéticas que liberan O₂.');
sciAdd('Biología','Organismo y ambiente','¿Cuál afirmación describe mejor el flujo de energía en una cadena alimentaria?',['La energía disponible disminuye hacia niveles tróficos superiores','La energía se recicla entre niveles del mismo modo que los nutrientes','La energía aumenta en cada nivel debido a la biomasa acumulada','Los descomponedores restituyen toda la energía al nivel de los productores'],0,['','La materia puede reciclarse, pero la energía fluye y parte se disipa como calor en cada transferencia.','La biomasa no implica que la energía utilizable aumente al ascender de nivel trófico.','Los descomponedores reciclan nutrientes, no devuelven toda la energía a los productores.'],['Los productores capturan parte de la energía disponible.','En cada transferencia, una porción se utiliza y se disipa como calor; queda menos disponible en niveles superiores.'],'La energía fluye; la materia, en cambio, puede reciclarse.','Una cadena planta → conejo → zorro dispone de menos energía para el zorro que para las plantas.');
sciAdd('Biología','Organismo y ambiente','En un experimento se cultivan plantas con igual agua, temperatura y suelo, pero diferente intensidad lumínica. ¿Cuál es la variable independiente?',['La intensidad lumínica','La cantidad de agua constante','El tipo de suelo constante','La cantidad final de biomasa'],0,['','El agua es una variable controlada.','El suelo es una condición mantenida constante.','La biomasa es una posible variable dependiente, que se mide como respuesta.'],['Identifica qué factor cambian los investigadores deliberadamente.','La intensidad lumínica es la variable manipulada; el crecimiento sería una respuesta.'],'Independiente es lo que cambias; dependiente es lo que observas.','Si modificas horas de luz y mides crecimiento, las horas son independientes.');
// FÍSICA — MÓDULO COMÚN
sciAdd('Física','Ondas','Una onda electromagnética se propaga por el vacío. ¿Qué relación vincula su rapidez c, su longitud de onda λ y su frecuencia f?',['c=λ×f','c=λ÷f','c=f÷λ','c=λ+f'],0,['','Dividir longitud por frecuencia no da unidades de rapidez.','Dividir frecuencia por longitud tampoco da dimensiones de rapidez.','No puedes sumar magnitudes con unidades distintas.'],['La rapidez de cualquier onda se relaciona con distancia entre crestas y ciclos por segundo.','Multiplica longitud de onda por frecuencia: c=λf.'],'Cuántas ondas pasan por segundo, multiplicadas por el largo de cada una, da rapidez.','Si λ=2 m y f=3 Hz, la rapidez es 6 m/s.');
sciAdd('Física','Ondas','Si una onda electromagnética aumenta su frecuencia mientras sigue en el vacío, ¿qué ocurre con su longitud de onda?',['Aumenta','Disminuye','Permanece constante porque la rapidez en el vacío no cambia','Se reduce en la misma proporción que aumenta la rapidez de propagación'],1,['Como c es constante, ambas magnitudes no pueden aumentar a la vez.','','La rapidez constante no implica longitud de onda constante: λ=c/f.','La rapidez en el vacío no aumenta; la longitud de onda disminuye por el aumento de frecuencia.'],['En el vacío, la rapidez c de la luz permanece constante.','Como c=λf, si f aumenta, λ debe disminuir.'],'Frecuencia y longitud se compensan cuando la velocidad permanece igual.','Las ondas de mayor frecuencia tienen menor longitud en el vacío.');
sciAdd('Física','Ondas','Al pasar oblicuamente de aire a vidrio, un rayo luminoso cambia de dirección. ¿Qué fenómeno describe este cambio?',['Reflexión','Refracción','Difracción','Interferencia'],1,['Reflexión es el rebote de la luz hacia el medio de origen.','','Difracción consiste en la extensión de ondas al pasar aberturas o bordes.','Interferencia se refiere a superposición de ondas.'],['La luz atraviesa el límite entre dos medios.','Al cambiar su velocidad de propagación puede cambiar de dirección: refracción.'],'La refracción ocurre cuando la luz pasa oblicuamente de un material a otro y cambia su velocidad de propagación. Ese cambio puede desviar su trayectoria. En cambio, la reflexión es cuando la luz rebota y permanece en el medio de origen.','Imagina un lápiz dentro de un vaso con agua: parece doblado justo donde entra al agua porque la luz que viene de la parte sumergida cambia de dirección al salir del agua hacia el aire. Algo parecido ocurre al entrar del aire al vidrio: la trayectoria se desvía por refracción.');
sciAdd('Física','Mecánica','Un ciclista recorre 120 metros en 20 segundos a rapidez constante. ¿Cuál es su rapidez?',['3 m/s','6 m/s','12 m/s','24 m/s'],1,['3 m/s resulta de dividir la distancia por 40 s, el doble del tiempo dado.','','12 m/s surge al dividir 120 entre 10 s, la mitad del tiempo indicado.','24 m/s corresponde a dividir 120 entre 5 s, no entre 20 s.'],['Rapidez media=distancia recorrida÷tiempo.','120 m÷20 s=6 m/s.'],'Pregúntate cuántos metros avanza cada segundo.','60 m en 10 s equivale a 6 m/s.');
sciAdd('Física','Mecánica','Un objeto de 2 kg acelera 3 m/s² por la acción de una fuerza neta. ¿Cuál es su magnitud?',['1,5 N','5 N','6 N','9 N'],2,['Dividir masa entre aceleración no aplica la segunda ley.','Sumar 2 y 3 no calcula la fuerza.','','9 requeriría masa 3 kg con esa aceleración.'],['Segunda ley de Newton: F_neta=m×a.','2 kg×3 m/s²=6 N.'],'Masa por aceleración da fuerza neta.','Si m=4 kg y a=2 m/s², la fuerza neta es 8 N.');
sciAdd('Física','Mecánica','Un auto avanza en línea recta a velocidad constante. ¿Qué afirma la primera ley de Newton sobre la fuerza neta?',['Debe apuntar siempre hacia adelante','Es cero','Aumenta continuamente','Debe ser igual a la masa'],1,['Una fuerza neta hacia adelante aceleraría el vehículo.','','Una fuerza neta creciente cambiaría su velocidad.','Masa y fuerza tienen unidades diferentes.'],['La velocidad constante significa aceleración igual a cero.','Por F_neta=m×a, la suma de fuerzas es cero.'],'No confundir movimiento con aceleración: para seguir a velocidad constante, las fuerzas se equilibran.','Una caja que se desliza sin cambiar velocidad tiene fuerza neta cero.');
sciAdd('Física','Energía – Tierra','¿Cuál es una evidencia utilizada para explicar el movimiento de placas tectónicas?',['Coincidencia de fósiles en continentes separados','La rotación diaria de la Luna','La existencia de las estaciones','Que todos los terremotos ocurren en la misma fecha'],0,['','Las fases o rotación lunar no indican desplazamiento continental.','Las estaciones dependen de la inclinación del eje terrestre y la traslación.','Los sismos no se producen todos en una fecha específica.'],['Se comparan fósiles, rocas y formas de costas de masas continentales separadas.','La coincidencia de evidencias apoya la idea de que estuvieron unidas y se movieron.'],'Al encontrar fósiles de organismos iguales y de la misma antigüedad en continentes hoy separados por océanos, se infiere que esas tierras estuvieron conectadas en el pasado. Esta coincidencia, junto con rocas y otras evidencias geológicas, apoya el desplazamiento de los continentes y la tectónica de placas.','Por ejemplo, se han encontrado fósiles del reptil Mesosaurus, que vivía en ambientes de agua dulce, tanto en Sudamérica como en África. Es difícil explicar esa distribución suponiendo que cruzó un océano amplio; resulta coherente con que ambas masas continentales estuvieron unidas.');
sciAdd('Física','Energía – Tierra','¿Dónde se concentra gran parte de los terremotos de origen tectónico?',['En límites entre placas','Solamente en el centro de océanos sin placas','Uniformemente en todos los lugares','Únicamente en los polos geográficos'],0,['','El océano también contiene límites de placas y actividad tectónica.','Los sismos no se distribuyen uniformemente sobre la superficie terrestre.','La posición geográfica de los polos no define todas las zonas sísmicas.'],['Las placas interactúan, acumulan tensiones y pueden desplazarse.','Muchos sismos se concentran en sus límites.'],'Chile se ubica cerca del contacto de placas, lo que explica su frecuente sismicidad.','La subducción frente a Chile genera sismos de diferentes profundidades.');
sciAdd('Física','Energía – Tierra','Un estudiante atribuye los sismos al movimiento de la atmósfera. ¿Qué explicación científica es más adecuada?',['El desplazamiento y la interacción de placas litosféricas','El calentamiento directo del aire por el Sol','La lluvia sobre el océano','La variación diaria de la luz'],0,['','El calentamiento del aire no explica por sí mismo terremotos tectónicos.','Lluvia oceánica no constituye la causa principal de rupturas tectónicas.','El ciclo día-noche tampoco representa el mecanismo de liberación de energía interna.'],['La litosfera está fragmentada en placas que interactúan.','Al liberarse energía acumulada en fallas se producen ondas sísmicas.'],'Piensa en rocas que acumulan tensión y luego se desplazan bruscamente.','La ruptura a lo largo de una falla genera ondas que se detectan en sismógrafos.');
sciAdd('Física','Electricidad','Una resistencia de 6 Ω está conectada a una fuente de 12 V. Según la ley de Ohm, ¿qué corriente circula?',['0,5 A','2 A','6 A','72 A'],1,['Dividir 6 entre 12 invierte la relación.','','Confundiste resistencia con corriente.','Multiplicar voltaje por resistencia no da corriente.'],['Ley de Ohm: V=I×R.','I=V÷R=12÷6=2 A.'],'Si conoces voltaje y resistencia, divide para encontrar corriente.','9 V sobre 3 Ω producen 3 A.');
sciAdd('Física','Electricidad','Dos resistencias de 3 Ω y 5 Ω se conectan en serie. ¿Cuál es su resistencia equivalente?',['1,875 Ω','2 Ω','8 Ω','15 Ω'],2,['Esta expresión corresponde a una combinación paralela, no serie.','Dos ohmios es menor que ambas y no corresponde a serie.','','Multiplicar ambas resistencias no calcula la equivalente en serie.'],['En serie, la corriente atraviesa ambas resistencias.','Se suman: 3 Ω+5 Ω=8 Ω.'],'Piensa en dos obstáculos uno tras otro: sus resistencias se suman.','2 Ω y 4 Ω en serie equivalen a 6 Ω.');
sciAdd('Física','Electricidad','Un artefacto de 100 W permanece funcionando durante 2 horas. ¿Qué energía eléctrica consume?',['50 Wh','100 Wh','200 Wh','2.000 Wh'],2,['Dividir potencia por tiempo no determina la energía consumida.','100 Wh correspondería a una hora de uso.','','Multiplicaste por veinte horas en lugar de dos.'],['Energía consumida=potencia×tiempo.','100 W×2 h=200 Wh=0,2 kWh.'],'Watts indican ritmo de consumo; multiplicarlos por horas da energía.','Un aparato de 500 W funcionando 2 h consume 1 kWh.');

// QUÍMICA — MÓDULO COMÚN
sciAdd('Química','Estructura atómica','¿Cuál ejemplo es una mezcla homogénea?',['Agua con sal completamente disuelta','Arena con piedras visibles','Agua y aceite en dos capas','Hielo formado solo por agua pura'],0,['','Se pueden distinguir los componentes de esa mezcla.','El agua y el aceite forman fases distinguibles.','Si solo contiene H₂O es una sustancia pura, no una mezcla.'],['Una mezcla homogénea presenta composición uniforme a simple vista.','La sal disuelta forma una sola fase con el agua.'],'Es como agua salada: no distingues sus componentes al observarla.','El aire es una mezcla homogénea de gases.');
sciAdd('Química','Estructura atómica','¿Qué método permite separar arena insoluble del agua?',['Filtración','Destilación simple','Decantación','Evaporación'],0,['','La destilación puede recuperar agua de una disolución, pero es innecesaria para separar arena insoluble.','La decantación puede separar parte de la arena sedimentada, pero no retiene tan directamente partículas suspendidas como un filtro.','La evaporación eliminaría el agua en vez de separarla y recuperarla directamente.'],['La arena permanece sólida y no se disuelve.','Un filtro deja pasar agua y retiene granos de arena.'],'Como colar fideos, pero con un filtro más fino.','El café de filtro utiliza separación sólido-líquido.');
sciAdd('Química','Estructura atómica','Un átomo neutro tiene número atómico Z=11. ¿Cuántos electrones posee?',['10','11','12','22'],1,['Un electrón menos produciría un catión de carga +1.','','Doce electrones corresponderían a una carga −1.','El número atómico cuenta protones; no se multiplica por dos para contar electrones.'],['Z indica el número de protones: 11.','En un átomo eléctricamente neutro hay igual cantidad de protones y electrones: 11.'],'Sin carga total, cargas positivas y negativas se equilibran.','Un átomo neutro de carbono con Z=6 tiene 6 electrones.');
sciAdd('Química','Estructura atómica','¿Qué partícula determina el número atómico de un elemento químico?',['Neutrones','Electrones de valencia','Protones','Moléculas'],2,['La cantidad de neutrones puede variar entre isótopos.','Los electrones de valencia afectan reactividad, no definen Z.','','Una molécula contiene átomos; no define el número atómico de cada elemento.'],['El número atómico Z caracteriza a cada elemento.','Z equivale al número de protones del núcleo.'],'Cambiar protones cambia de elemento; cambiar neutrones puede producir un isótopo.','Todos los átomos de oxígeno tienen ocho protones.');
sciAdd('Química','Química orgánica','¿Qué propiedad explica que un átomo de carbono pueda formar cuatro enlaces covalentes en muchos compuestos?',['Tetravalencia','Magnetismo permanente','Radiactividad universal','Ausencia de electrones'],0,['','El magnetismo permanente no explica sus cuatro enlaces covalentes.','La mayoría de átomos de carbono estables no requiere radiactividad.','El carbono sí tiene electrones que participan en enlaces.'],['El carbono tiene cuatro electrones en su capa de valencia.','Puede establecer cuatro enlaces covalentes compartiendo electrones.'],'Como una pieza con cuatro puntos posibles de unión.','En el metano CH₄, el carbono forma cuatro enlaces simples.');
sciAdd('Química','Química orgánica','¿Qué grupo funcional caracteriza al etanol (CH₃CH₂OH)?',['Alcohol, con grupo −OH','Ácido carboxílico, con −COOH','Cetona, con grupo C=O interno','Amina, con nitrógeno'],0,['','El etanol no contiene el grupo −COOH.','El etanol no posee un grupo carbonilo C=O de cetona.','Su fórmula no contiene un átomo de nitrógeno.'],['Identifica el grupo −OH unido a un carbono saturado.','Esa función caracteriza a los alcoholes.'],'Busca el grupo OH: en etanol indica un alcohol.','El metanol CH₃OH también es un alcohol.');
sciAdd('Química','Química orgánica','¿Cuál de los siguientes compuestos es un hidrocarburo?',['CH₄','CH₃OH','H₂O','NaCl'],0,['','CH₃OH contiene oxígeno y es un alcohol.','H₂O contiene hidrógeno y oxígeno, no carbono.','NaCl es una sal inorgánica.'],['Los hidrocarburos contienen solamente carbono e hidrógeno.','CH₄ contiene un carbono y cuatro hidrógenos.'],'Hidro = hidrógeno; carburo = carbono: solo esos dos elementos.','El eteno C₂H₄ también es un hidrocarburo.');
sciAdd('Química','Química orgánica','La molécula CH₂=CH₂ presenta un enlace entre carbonos de tipo…',['Simple','Doble','Triple','Iónico'],1,['Un enlace simple se representa con una línea entre carbonos.','','Un triple enlace se representa con tres líneas (≡).','Entre estos átomos de carbono se forma un enlace covalente.'],['Cuenta las líneas entre ambos átomos de carbono.','El signo igual (=) indica enlace covalente doble.'],'Dos líneas entre carbonos significa enlace doble.','CH≡CH contiene un enlace triple.');
sciAdd('Química','Reacciones químicas y estequiometría','Para balancear H₂ + O₂ → H₂O usando los menores coeficientes enteros, ¿cuál ecuación es correcta?',['2H₂ + O₂ → 2H₂O','H₂ + 2O₂ → H₂O','2H₂ + 2O₂ → H₂O','H₂ + O₂ → 2H₂O'],0,['','A la izquierda hay cuatro átomos de O y a la derecha uno.','A la izquierda hay cuatro átomos de H y cuatro de O, pero a la derecha dos H y un O.','A la izquierda hay dos H y dos O; a la derecha cuatro H y dos O.'],['Coloca 2 delante de H₂O para tener dos oxígenos a la derecha.','Coloca 2 delante de H₂ para equilibrar cuatro hidrógenos: 2H₂+O₂→2H₂O.'],'En una reacción deben conservarse los átomos de cada elemento.','La combustión de hidrógeno produce agua siguiendo esta relación.');
sciAdd('Química','Reacciones químicas y estequiometría','Una muestra contiene 18 g de agua (H₂O). Si su masa molar es 18 g/mol, ¿cuántos moles hay?',['0,5 mol','1 mol','18 mol','324 mol'],1,['Nueve gramos serían 0,5 mol con esa masa molar.','','Confundiste masa de muestra con cantidad en moles.','Multiplicar 18 por 18 no calcula los moles.'],['Número de moles n=masa÷masa molar.','18 g÷18 g/mol=1 mol.'],'Un mol pesa lo que indica la masa molar expresada en gramos.','36 g de agua corresponden a 2 moles.');
sciAdd('Química','Reacciones químicas y estequiometría','Se disuelven 10 g de sal y se completa a 100 mL de solución. ¿Cuál es su concentración porcentual masa/volumen?',['1 % m/v','10 % m/v','50 % m/v','100 % m/v'],1,['1 % serían 1 g por 100 mL de solución.','','50 % serían 50 g en 100 mL.','100 % serían 100 g por cada 100 mL.'],['% m/v=(masa de soluto en g÷volumen final de solución en mL)×100.','10÷100×100=10 % m/v.'],'Porcentaje m/v es gramos de soluto por cada 100 mL de solución.','5 g en 100 mL de solución equivalen a 5 % m/v.');
sciAdd('Química','Reacciones químicas y estequiometría','Al agregar agua a una solución sin perder soluto, ¿qué ocurre con su concentración?',['Aumenta necesariamente','Disminuye','Se convierte en cero de inmediato','La cantidad de soluto se duplica'],1,['Si agregas solvente, normalmente se diluye.','','Todavía existe soluto en la solución diluida.','Agregar solvente no crea más soluto.'],['La cantidad de soluto permanece constante.','El volumen de solución aumenta, por lo que su concentración disminuye.'],'El jugo concentrado se vuelve más suave al agregarle agua.','Si duplicas el volumen final manteniendo los moles, la molaridad se reduce a la mitad.');

// HABILIDADES CIENTÍFICAS TRANSVERSALES — MÓDULO COMÚN
sciAdd('Biología','Organismo y ambiente','Se cultivan plantas con diferentes cantidades de luz y se mide la tasa fotosintética. ¿Qué variable debe mantenerse constante para atribuir cambios a la luz?',['La intensidad lumínica','La tasa fotosintética medida','La cantidad de agua aportada','El resultado del experimento'],2,['La intensidad de luz es la variable independiente: se cambia a propósito para estudiar su efecto. Por eso no puede mantenerse constante en este experimento.','La tasa fotosintética es la variable dependiente: se mide para observar cómo responde a los cambios de luz, no se fija antes del experimento.','','El resultado no puede imponerse de antemano como condición controlada.'],['Primero identifica qué cambia intencionalmente: la cantidad de luz. Esa es la variable independiente.','Luego identifica qué se mide: la tasa fotosintética. Esa es la variable dependiente.','Para saber si los cambios se deben a la luz, las plantas deben recibir la misma cantidad de agua y mantener condiciones comparables de temperatura, suelo y especie.','Por eso la respuesta es C: el agua se mantiene constante como variable controlada.'],'Piensa en dos plantas: una recibe mucha luz y otra poca. Si además una recibe más agua, no sabrías si creció distinto por la luz o por el agua. Por eso cambias solo la luz y das la misma agua a ambas.','Ejemplo: planta A recibe 4 horas de luz y planta B recibe 8 horas. Ambas reciben 200 mL de agua, el mismo suelo y temperatura. Si cambia la fotosíntesis, puedes investigar el efecto de la luz sin confundirlo con diferencias de riego.',{skill:'Planificar y conducir una investigación',difficulty:'intermedio'});
sciAdd('Biología','Herencia y evolución','Un estudio describe diez plantas de una sola zona y concluye que todas las plantas de Chile tienen igual tasa de crecimiento. ¿Cuál crítica es válida?',['La muestra es insuficiente para generalizar a todas las plantas','Diez plantas siempre permiten concluir sobre todo un país','Los resultados no pueden analizarse si son numéricos','Una muestra pequeña garantiza mejores conclusiones'],0,['','No basta con un pequeño grupo para representar toda la diversidad.','Se pueden analizar resultados numéricos, pero su alcance debe evaluarse.','Tamaños pequeños no garantizan mayor representatividad.'],['La conclusión se refiere a una población muy amplia.','Una sola zona y diez plantas no permiten generalizar con esa certeza.'],'Una observación válida puede tener un alcance limitado.','Para estudiar variación nacional, conviene muestrear distintas regiones y condiciones.',{skill:'Evaluar',difficulty:'desafío'});
sciAdd('Física','Mecánica','Un investigador mide el tiempo de un objeto que recorre una pista de 10 m a rapidez constante. ¿Qué instrumento mide directamente el tiempo transcurrido?',['Termómetro','Cronómetro','Dinamómetro','Balanza'],1,['El termómetro mide temperatura.','','El dinamómetro mide fuerza.','La balanza mide masa.'],['Se necesita medir el intervalo entre salida y llegada.','Un cronómetro permite medir ese tiempo.'],'Cada pregunta científica necesita el instrumento de la variable correcta.','Para hallar rapidez con 10 m también necesitas medir el tiempo.',{skill:'Planificar y conducir una investigación'});
sciAdd('Física','Electricidad','Se repite cinco veces la medición de corriente en un mismo circuito. Los valores son muy distintos entre sí pese a mantener las condiciones. ¿Qué conviene revisar primero?',['La estabilidad del montaje y el instrumento','Eliminar las mediciones distintas a voluntad','Cambiar de circuito sin registrar la modificación','Anotar solo el mayor valor'],0,['','Descartar datos sin justificación sesga el análisis.','Cambiar el sistema sin dejar constancia dificulta la comparación.','Escoger solo el valor máximo no representa fielmente todas las mediciones.'],['Mediciones muy dispersas pueden revelar errores instrumentales o del montaje.','Se debe comprobar la confiabilidad y reproducibilidad del procedimiento.'],'La ciencia no consiste en escoger el número que más te guste.','Comprobar conexiones flojas puede explicar lecturas erráticas.',{skill:'Evaluar',difficulty:'desafío'});
sciAdd('Química','Reacciones químicas y estequiometría','Un equipo compara cuánto tarda en disolverse un sólido a dos temperaturas distintas. ¿Qué debería mantener igual?',['La temperatura','La masa de sólido utilizada','El tiempo obtenido','La velocidad de disolución'],1,['La temperatura es precisamente la variable que se desea modificar.','','El tiempo es resultado, no una condición elegida por adelantado.','La velocidad es la respuesta que se investiga.'],['Se modifica deliberadamente la temperatura.','Mantener igual la masa de sólido facilita comparar su efecto.'],'Si cambias temperatura y cantidad a la vez, no sabes cuál afectó el resultado.','También conviene controlar agitación y volumen del solvente.',{skill:'Planificar y conducir una investigación'});
sciAdd('Química','Estructura atómica','Un gráfico muestra masa y volumen de muestras de la misma sustancia a temperatura constante. ¿Qué es lo más apropiado para comunicar la relación?',['Un gráfico de dispersión masa versus volumen','Una lista de colores favoritos','Un dibujo sin valores ni escalas','Un único número sin unidades'],0,['','No describe cuantitativamente la relación.','Sin valores y escalas, la comparación es difícil.','Se necesitan las dos magnitudes y unidades para estudiar su relación.'],['Se dispone de pares de datos cuantitativos: masa y volumen.','Un gráfico de dispersión permite explorar su relación.'],'Si quieres ver cómo dos números cambian juntos, usa un gráfico apropiado.','Una relación lineal masa-volumen puede reflejar densidad constante.',{skill:'Comunicar'});
// PROFUNDIZACIÓN ELECTIVA — COBERTURA INICIAL, NO SIMULACRO ME COMPLETO
sciAdd('Biología','Herencia y evolución','En un cruce entre dos individuos heterocigotos Aa y Aa con dominancia completa, ¿qué proporción genotípica se espera?',['1 AA : 2 Aa : 1 aa','3 fenotipos dominantes : 1 recesivo','Todos Aa','Todos aa'],0,['','La relación 3:1 describe fenotipos bajo dominancia completa; la pregunta pide genotipos 1:2:1.','También pueden obtenerse AA y aa.','Ambos progenitores pueden aportar A o a.'],['Cada progenitor aporta A o a con probabilidad 1/2.','Las combinaciones son AA, Aa, aA y aa: 1:2:1.'],'Cada progenitor Aa puede aportar A o a. En un cuadro de Punnett de cuatro casillas se obtienen AA, Aa, Aa y aa: uno de cada cuatro AA, dos Aa y uno aa. La proporción genotípica es 1:2:1.','Dibuja un cuadro de Punnett: arriba escribe A y a, y al costado A y a. Las casillas resultan AA, Aa, Aa y aa. Tres presentan el fenotipo dominante, pero solo una es AA: no confundas la proporción fenotípica 3:1 con la genotípica 1:2:1.',{module:'ME',difficulty:'intermedio'});
sciAdd('Biología','Organización, estructura y actividad celular','Una célula deja de sintetizar proteínas en ribosomas. ¿Cuál efecto directo sería esperable?',['Disminuiría la producción de proteínas','Todas las proteínas se duplicarían','Aumentarían los cromosomas inmediatamente','Se iniciaría la fotosíntesis en una célula animal'],0,['','Los ribosomas son necesarios para traducción, no para duplicar todas las proteínas.','La duplicación cromosómica es otro proceso celular.','La ausencia de traducción no crea cloroplastos animales.'],['Los ribosomas traducen ARN mensajero para fabricar proteínas.','Si se detiene su funcionamiento, disminuye la síntesis proteica.'],'Los ribosomas son como máquinas que arman cadenas de aminoácidos.','Sin traducción se dificulta producir nuevas enzimas.',{module:'ME',difficulty:'intermedio'});
sciAdd('Biología','Herencia y evolución','Una pareja de cromosomas homólogos intercambia segmentos durante la profase I meiótica. ¿Qué proceso ocurre?',['Entrecruzamiento o crossing-over','Replicación del ADN durante la mitosis','Fisión binaria bacteriana','Traducción de proteínas'],0,['','La replicación ocurre antes de la meiosis, durante interfase.','La fisión binaria ocurre en procariontes.','La traducción ocurre en ribosomas.'],['En profase I los cromosomas homólogos se aparean.','Pueden intercambiar segmentos, generando nuevas combinaciones alélicas.'],'Es como intercambiar secciones equivalentes de dos barajas.','El entrecruzamiento contribuye a la variabilidad genética.',{module:'ME',difficulty:'desafío'});
sciAdd('Biología','Procesos y funciones biológicas','Un fármaco bloquea receptores postsinápticos para un neurotransmisor. ¿Qué efecto es posible?',['Disminuir la respuesta a ese neurotransmisor','Asegurar que todos los impulsos aumenten','Duplicar automáticamente todos los cromosomas','Convertir neuronas en glóbulos rojos'],0,['','Bloquear receptores no garantiza aumento universal de actividad.','La transmisión sináptica no duplica cromosomas.','La inhibición receptorial no transforma el tipo celular.'],['Los neurotransmisores actúan uniéndose a receptores específicos.','Al bloquearlos, puede reducirse la respuesta en la célula receptora.'],'Como tapar una cerradura para que la llave química no pueda abrirla.','Algunos medicamentos actúan como antagonistas de receptores.',{module:'ME',difficulty:'desafío'});
sciAdd('Física','Ondas','Una luz monocromática viaja del vacío a un vidrio transparente. ¿Qué magnitud conserva su valor al cruzar la interfaz?',['La frecuencia','La rapidez','La longitud de onda','La dirección en todos los ángulos'],0,['','La rapidez disminuye al entrar en vidrio común.','La longitud de onda cambia con la rapidez del medio.','La dirección puede cambiar si incide oblicuamente.'],['La frecuencia está determinada por la fuente y se mantiene al atravesar la interfaz.','Al variar la rapidez, la longitud de onda sí cambia.'],'El ritmo de vibración se conserva al cruzar de medio.','La luz roja mantiene su frecuencia cuando pasa del aire al vidrio.',{module:'ME',difficulty:'intermedio'});
sciAdd('Física','Mecánica','Un objeto parte del reposo y acelera constantemente a 2 m/s² durante 4 s. ¿Qué velocidad alcanza?',['2 m/s','4 m/s','8 m/s','16 m/s'],2,['Dos metros por segundo cuadrado corresponde a la aceleración.','Multiplicaste por dos segundos en lugar de cuatro.','','Duplicaste el producto aceleración-tiempo.'],['Para movimiento uniformemente acelerado, v=v₀+at.','Con v₀=0: v=2×4=8 m/s.'],'Aumenta su velocidad 2 m/s cada segundo.','Al cabo de 3 s alcanzaría 6 m/s.',{module:'ME',difficulty:'intermedio'});
sciAdd('Física','Electricidad','Dos resistencias iguales de 6 Ω se conectan en paralelo. ¿Cuál es la resistencia equivalente?',['3 Ω','6 Ω','12 Ω','36 Ω'],0,['','En paralelo, la resistencia equivalente es menor que cualquiera de las ramas.','Doce ohmios sería el total en serie.','Multiplicar las resistencias no corresponde a esta asociación.'],['Para dos resistencias idénticas R en paralelo, R_eq=R/2.','Al dividir la resistencia de 6 Ω por 2 se obtiene una resistencia equivalente de 3 Ω.'],'Dos caminos iguales para la corriente facilitan el paso conjunto.','Dos resistencias de 10 Ω en paralelo equivalen a 5 Ω.',{module:'ME',difficulty:'desafío'});
sciAdd('Física','Energía – Tierra','Dos placas tectónicas convergen y una se introduce bajo la otra. ¿Cómo se denomina el proceso?',['Subducción','Evaporación','Refracción','Fotosíntesis'],0,['','Evaporación es cambio de líquido a gas.','Refracción es cambio de propagación de una onda al pasar entre medios.','Fotosíntesis es un proceso biológico de fijación de carbono.'],['En un límite convergente, una placa puede descender bajo otra.','Ese movimiento se denomina subducción y puede asociarse a sismicidad y volcanismo.'],'Como una lámina que se desliza por debajo de otra.','La placa de Nazca subduce bajo la Sudamericana frente a Chile.',{module:'ME',difficulty:'intermedio'});
sciAdd('Química','Estructura atómica','Un átomo tiene número másico A=23 y número atómico Z=11. ¿Cuántos neutrones posee?',['11','12','23','34'],1,['Once corresponde a los protones.','','Veintitrés es el número másico, protones más neutrones.','Sumar A+Z no calcula neutrones.'],['Número másico A=protones+neutrones.','Neutrones=A−Z=23−11=12.'],'Resta protones del total de partículas nucleares.','Si A=14 y Z=6, hay 8 neutrones.',{module:'ME',difficulty:'intermedio'});
sciAdd('Química','Química orgánica','¿Qué función orgánica corresponde a la estructura CH₃COOH?',['Ácido carboxílico','Alcohol','Éter','Cetona'],0,['','Un alcohol tiene un grupo −OH unido a carbono saturado sin carbonilo vecino.','Un éter contiene enlace C−O−C.','Una cetona presenta C=O entre carbonos, sin grupo −COOH.'],['Identifica el grupo funcional −COOH.','Ese grupo caracteriza a los ácidos carboxílicos.'],'Busca COOH: es la marca de un ácido carboxílico.','El ácido acético es CH₃COOH.',{module:'ME',difficulty:'intermedio'});
sciAdd('Química','Reacciones químicas y estequiometría','La reacción es 2H₂ + O₂ → 2H₂O. Si se consumen 2 moles de H₂ y hay oxígeno suficiente, ¿cuántos moles de H₂O se forman?',['1 mol','2 mol','3 mol','4 mol'],1,['Los coeficientes indican proporción 2:2, no 2:1.','','La reacción no produce tres moles a partir de esa cantidad.','No se duplican los moles más allá de la relación 2:2.'],['Compara coeficientes estequiométricos H₂:H₂O = 2:2.','Por cada 2 moles de H₂ se forman 2 moles de H₂O.'],'Los coeficientes actúan como una receta de cantidades.','Cuatro moles de H₂ producen cuatro de H₂O con suficiente O₂.',{module:'ME',difficulty:'intermedio'});
sciAdd('Química','Reacciones químicas y estequiometría','¿Qué ocurre con la cantidad de soluto cuando se diluye una solución agregando solo solvente?',['Se conserva','Siempre se duplica','Desaparece completamente','Se transforma necesariamente en otro elemento'],0,['','Agregar agua no crea soluto nuevo.','Diluir no elimina químicamente el soluto.','La dilución no implica transmutación elemental.'],['Una dilución incorpora solvente sin añadir ni extraer soluto.','Los moles de soluto permanecen iguales, aunque disminuye la concentración.'],'Más agua, misma cantidad de azúcar.','La relación C₁V₁=C₂V₂ proviene de conservar soluto en una dilución.',{module:'ME',difficulty:'intermedio'});

// PRÁCTICA DE NIVEL TÉCNICO-PROFESIONAL — cobertura inicial, no módulo completo
sciAdd('Biología','Organización, estructura y actividad celular','Una célula vegetal tiene una estructura rígida externa a la membrana plasmática. ¿Cuál es?',['Pared celular','Nucléolo','Lisosoma','Mitocondria'],0,['','El nucléolo se encuentra dentro del núcleo.','El lisosoma es una vesícula intracelular.','La mitocondria participa en producción de ATP.'],['Las células vegetales presentan una estructura de sostén externa a la membrana.','La pared celular les da resistencia y forma.'],'Como una cubierta firme que sostiene a la célula.','La celulosa es un componente importante de las paredes vegetales.',{module:'MTP'});
sciAdd('Biología','Organismo y ambiente','En una cadena alimentaria, ¿qué organismo suele formar el primer nivel trófico?',['Un productor fotosintético','Un carnívoro de segundo orden','Un depredador superior','Un parásito de animales'],0,['','Los carnívoros obtienen energía al consumir otros organismos.','Los depredadores están en niveles de consumidores.','Los parásitos dependen de otros seres vivos como recurso.'],['Los productores incorporan energía al sistema al formar materia orgánica.','Un organismo fotosintético suele ocupar el primer nivel.'],'Una planta crea la base energética de muchas cadenas.','Las algas son productores en ecosistemas acuáticos.',{module:'MTP'});
sciAdd('Física','Mecánica','Un estudiante camina 50 m en 10 s. ¿Cuál es su rapidez media?',['0,2 m/s','5 m/s','10 m/s','500 m/s'],1,['Dividiste tiempo por distancia.','','Diez es el tiempo, no la rapidez.','Multiplicaste distancia por tiempo.'],['La rapidez media se calcula como distancia ÷ tiempo.','La rapidez se obtiene dividiendo 50 metros por 10 segundos: 5 m/s.'],'Cada segundo avanza en promedio cinco metros.','Diez metros en cinco segundos equivalen a dos m/s.',{module:'MTP'});
sciAdd('Física','Electricidad','¿Qué unidad del Sistema Internacional se utiliza para medir la corriente eléctrica?',['Volt','Ohm','Ampere','Watt'],2,['Volt mide diferencia de potencial eléctrico.','Ohm es unidad de resistencia eléctrica.','','Watt es unidad de potencia.'],['La corriente mide la cantidad de carga que pasa por unidad de tiempo.','Su unidad es el ampere (A).'],'Ampere es corriente; volt es voltaje; ohm es resistencia.','Un amperímetro mide corriente en amperes.',{module:'MTP'});
sciAdd('Química','Estructura atómica','¿Cuál de los siguientes casos corresponde a una transformación física de la materia?',['Derretir un cubo de hielo','Quemar madera','Oxidar un clavo','Cocinar un huevo'],0,['','Quemar madera forma nuevas sustancias.','Oxidar hierro implica reacción química.','La cocción produce cambios químicos complejos en proteínas.'],['En un cambio físico no se forma una sustancia nueva.','Al fundirse, el hielo continúa siendo H₂O.'],'Cambia el estado, no la identidad química del agua.','Congelar agua es otro cambio físico.',{module:'MTP'});
sciAdd('Química','Reacciones químicas y estequiometría','¿Qué principio exige conservar la cantidad de átomos de cada elemento al balancear una reacción?',['Conservación de la materia','Conservación del volumen en todos los gases','Desaparición de reactantes sin productos','Conversión de todos los elementos en carbono'],0,['','Los volúmenes gaseosos no tienen por qué ser iguales en ambos lados.','Los reactantes generan productos con la materia conservada.','Las reacciones químicas ordinarias no transforman elementos arbitrariamente.'],['En una reacción química, los átomos se reorganizan.','El balance respeta la conservación de cada elemento.'],'Los átomos cambian de pareja, no desaparecen.','Para formar agua se debe equilibrar H y O en ambos lados.',{module:'MTP'});

// Preguntas explícitas de formulación de hipótesis, para cubrir las cinco habilidades.
sciAdd('Biología','Organismo y ambiente','Un grupo desea investigar si la temperatura modifica la fotosíntesis. ¿Cuál hipótesis puede ponerse a prueba con mediciones?',['La tasa fotosintética puede diferir entre plantas a 15 °C y 25 °C, con la misma luz','Las plantas son bonitas por naturaleza','La fotosíntesis siempre es el proceso más importante','La temperatura jamás puede medirse'],0,['','No es una proposición experimental medible.','Un juicio de valor no establece una predicción contrastable.','La temperatura es una variable medible.'],['Una hipótesis científica relaciona variables observables.','La temperatura y la tasa fotosintética pueden medirse y compararse bajo condiciones controladas.'],'Una buena hipótesis dice qué cambiará y qué se medirá.','También podría investigarse el efecto de la luz manteniendo constante la temperatura.',{skill:'Observar y plantear preguntas',difficulty:'intermedio'});
sciAdd('Física','Ondas','¿Cuál pregunta permite diseñar una investigación sobre refracción de luz?',['¿Cómo cambia el ángulo de refracción al variar el ángulo de incidencia?','¿Cuál color de luz es más bonito?','¿La luz debería obedecer nuestros deseos?','¿Qué espejo prefiere una persona sin medir nada?'],0,['','La belleza es subjetiva y no proporciona una relación óptica medible.','Los deseos no son variables físicas definidas.','La preferencia personal no mide el fenómeno de refracción.'],['Una pregunta investigable identifica variables observables.','Los ángulos de incidencia y refracción pueden medirse al variar el primero.'],'Cambia el ángulo de entrada y mide el ángulo de salida.','Un prisma o una cubeta óptica permiten investigar refracción.',{skill:'Observar y plantear preguntas',difficulty:'intermedio'});
sciAdd('Química','Reacciones químicas y estequiometría','Un equipo investiga cuánto soluto se disuelve en agua a distintas temperaturas. ¿Cuál es una hipótesis comprobable?',['La masa disuelta de este sólido podría variar con la temperatura del agua','Todas las soluciones del mundo son exactamente iguales','El agua es siempre la mejor sustancia','La solubilidad no se puede medir'],0,['','Las sustancias y condiciones pueden dar solubilidades distintas.','Decir “mejor” sin criterio definido no es medible.','La masa disuelta se puede medir en condiciones controladas.'],['La temperatura es una variable manipulable.','La masa disuelta puede medirse para comprobar si cambia entre temperaturas.'],'Una hipótesis propone una relación que puedes probar.','Se puede medir masa disuelta a 20 °C y 40 °C manteniendo la cantidad de agua.',{skill:'Observar y plantear preguntas',difficulty:'intermedio'});


/* Ampliación editorial 2026: ítems originales; alternativas rotadas para evitar sesgos de posición. */
function sciExtra(subject,area,module,question,correct,distractors,why,clue,skill='Procesar y analizar evidencia'){
  const n=SCIENCE_BANK.length;
  const choices=[{text:correct,feedback:''},...distractors.map(item=>({text:item[0],feedback:item[1]}))];
  const offset=n%4;
  const arranged=choices.map((_,i)=>choices[(i+offset)%4]);
  const answer=arranged.findIndex(x=>x.text===correct);
  const explanations=arranged.map(x=>x.feedback);
  sciAdd(subject,area,question,arranged.map(x=>x.text),answer,explanations,
    [clue,why],clue+' '+why,'Aplica esta idea a la situación del enunciado: '+question+' La alternativa correcta es «'+correct+'» porque '+why+' Para descartar las otras opciones, compara qué dato o mecanismo describe cada una.',
    {module,skill,difficulty:'intermedio'});
}
const sciMoreCore=[
['Biología','Organización, estructura y actividad celular','Un glóbulo rojo se coloca en una solución muy concentrada de sales. ¿Qué sucede inicialmente con el agua de su interior?','Tiende a salir de la célula por ósmosis',[['Entra agua y aumenta su volumen','En un medio hipertónico, el agua no tiende a entrar.'],['No se mueve el agua en ningún sentido','Las membranas siguen permitiendo intercambio de agua.'],['La sal se convierte en agua','Un soluto no cambia químicamente a agua.']],'El agua se desplaza netamente hacia el entorno de mayor concentración de solutos.','Compara la concentración de solutos dentro y fuera de la célula.','Procesar y analizar evidencia'],
['Biología','Herencia y evolución','Tras varios años, una población de insectos presenta más individuos resistentes a un insecticida. ¿Qué explicación es consistente con selección natural?','Los individuos resistentes dejan más descendientes en ese ambiente',[['Cada insecto decide adquirir resistencia al entrar en contacto','La necesidad individual no produce por sí sola una mutación adaptativa dirigida.'],['El insecticida transforma a todos los insectos en resistentes','No todos adquieren igual resistencia por exposición.'],['Se extinguen primero todos los individuos resistentes','Esto contradice su ventaja reproductiva frente al insecticida.']],'La selección modifica la frecuencia de características heredables en generaciones, no la voluntad de cada organismo.','Busca diferencias heredables de supervivencia y reproducción.','Evaluar'],
['Biología','Organismo y ambiente','En una red trófica disminuyen drásticamente los productores. ¿Qué efecto es más probable para consumidores que dependen de ellos?','Disminuirá la energía disponible para los niveles superiores',[['Aumentará siempre la biomasa de herbívoros','La disminución del alimento suele restringir la biomasa herbívora.'],['Los consumidores producirán su propio alimento mediante fotosíntesis','La mayor parte de los consumidores no fotosintetiza.'],['La transferencia de energía entre niveles será perfecta','En cada nivel se disipa parte de la energía.']],'La energía ingresa a la red principalmente a través de los productores.','Identifica la base energética de la red alimentaria.','Interpretar relaciones'],
['Física','Ondas','Una onda realiza 12 oscilaciones en 3 segundos. ¿Cuál es su frecuencia?','4 Hz',[['36 Hz','Multiplicar ciclos por segundos no calcula frecuencia.'],['9 Hz','Restar los valores no da oscilaciones por segundo.'],['0,25 Hz','Este valor corresponde al período de la onda.']],'Frecuencia es cantidad de oscilaciones dividida por tiempo: 12/3 = 4 Hz.','Frecuencia indica ciclos por segundo.','Procesar y analizar evidencia'],
['Física','Mecánica','Un carro en una superficie sin roce recibe dos fuerzas horizontales iguales y opuestas. ¿Qué ocurre con su aceleración horizontal?','Es cero',[['Acelera hacia la derecha siempre','Las fuerzas se anulan, por lo que no hay fuerza neta hacia la derecha.'],['Acelera hacia la izquierda siempre','Sin fuerza neta no aparece aceleración hacia la izquierda.'],['Su rapidez tiene que ser cero','Puede continuar moviéndose con velocidad constante.']],'Según la segunda ley de Newton, una fuerza resultante de cero produce aceleración cero.','Suma las fuerzas con sus direcciones.','Procesar y analizar evidencia'],
['Física','Electricidad','Dos ampolletas idénticas están conectadas en serie a una pila ideal. Si una se desconecta y abre el circuito, ¿qué sucede con la otra?','Se apaga porque se interrumpe la corriente de toda la rama',[['Aumenta su brillo automáticamente','Un circuito abierto impide que la corriente continúe.'],['Sigue igual porque la pila permanece conectada','Sin trayectoria cerrada no hay corriente por esa rama.'],['Se transforma en una resistencia nula','Una ampolleta no cambia su resistencia por desconectar otra.']],'En una conexión en serie solo hay una trayectoria de corriente.','Dibuja si queda un camino cerrado desde la pila.','Procesar y analizar evidencia'],
['Química','Estructura atómica','Dos átomos del mismo elemento tienen diferente cantidad de neutrones. ¿Cómo se denominan?','Isótopos',[['Isóbaros obligatoriamente','Los isóbaros comparten número másico, no necesariamente número atómico.'],['Iones positivos necesariamente','Un ion se define por ganancia o pérdida de electrones.'],['Moléculas diatómicas','Una molécula involucra átomos unidos.']],'Los isótopos comparten protones y difieren en neutrones.','Para reconocer el elemento, cuenta protones.','Localizar'],
['Química','Reacciones químicas y estequiometría','Se mezclan reactivos en un recipiente completamente cerrado y ocurre una reacción. ¿Cómo cambia la masa total del sistema?','Permanece igual',[['Siempre aumenta por formación de enlaces','Formar enlaces no crea materia de la nada.'],['Disminuye porque se libera calor','El calor no equivale a pérdida de masa medible en este contexto escolar.'],['Se duplica cuando aparecen productos','Los átomos de los productos ya estaban en los reactivos.']],'En un sistema cerrado los átomos se conservan: la masa de los productos iguala la de los reactivos.','Fíjate si el sistema permite entrada o salida de materia.','Procesar y analizar evidencia'],
['Química','Química orgánica','¿Qué grupo funcional caracteriza a los alcoholes simples?','El grupo hidroxilo −OH unido a carbono saturado',[['Un grupo carbonilo C=O necesariamente','El carbonilo caracteriza otras familias como cetonas y aldehídos.'],['Un grupo carboxilo −COOH','El carboxilo caracteriza a ácidos carboxílicos.'],['Un enlace triple C≡C','El enlace triple caracteriza a alquinos.']],'En un alcohol típico se reconoce el grupo −OH unido a un carbono no carbonílico.','Busca primero el grupo funcional antes de nombrar la molécula.','Localizar']
];
for(const [s,a,q,c,d,w,cl,sk] of sciMoreCore)sciExtra(s,a,'MC',q,c,d,w,cl,SCIENCE_SKILLS.includes(sk)?sk:'Procesar y analizar evidencia');

const sciMoreBio=[
['Organización, estructura y actividad celular','Una célula eucarionte produce una proteína destinada al exterior. ¿En qué estructura se sintetiza inicialmente la cadena de aminoácidos?','En ribosomas asociados al retículo endoplasmático rugoso',[['En lisosomas','Los lisosomas participan en degradación, no en traducción.'],['En vacuolas de reserva','Una vacuola principalmente almacena sustancias.'],['En mitocondrias como vía principal de secreción','La maquinaria de secreción usa ribosomas ligados al retículo.']],'La traducción ocurre en ribosomas; las proteínas secretadas ingresan a la vía del retículo rugoso.','Distingue fabricar la proteína de modificarla y empaquetarla.'],
['Organización, estructura y actividad celular','En una célula vegetal, ¿qué estructura contiene directamente la clorofila que captura energía lumínica?','Membranas de los tilacoides de los cloroplastos',[['Matriz mitocondrial','La matriz mitocondrial participa en respiración celular.'],['Núcleo celular','El núcleo contiene material genético, no la mayor parte de clorofila fotosintética.'],['Pared celular','La pared celular da soporte, no contiene la maquinaria de captación de luz.']],'Los pigmentos fotosintéticos se organizan en complejos de las membranas tilacoidales.','Localiza la fase de captura de luz de la fotosíntesis.'],
['Procesos y funciones biológicas','Después de comer, aumenta la concentración de glucosa sanguínea. ¿Qué hormona favorece su ingreso a muchas células?','Insulina',[['Glucagón','El glucagón promueve aumentar glucosa sanguínea en situaciones de ayuno.'],['Adrenalina como regulador basal principal','La adrenalina participa en respuesta de alerta y movilización de energía.'],['Melatonina','La melatonina se relaciona con ciclos de sueño.']],'La insulina contribuye a disminuir la glicemia facilitando captación y almacenamiento de glucosa.','Relaciona aumento de glucosa con hormona de almacenamiento.'],
['Procesos y funciones biológicas','Si una enzima humana pierde actividad al exponerse a temperatura excesivamente alta, ¿cuál es una causa probable?','Se altera su conformación tridimensional',[['Aumenta para siempre su afinidad por todo sustrato','Temperaturas elevadas pueden desnaturalizarla.'],['Se convierte en una molécula de ADN','Una enzima proteica no se transforma en ADN por calor.'],['La reacción deja de necesitar energía de activación','Las reacciones continúan dependiendo de condiciones energéticas.']],'La función enzimática depende de la forma del sitio activo, que puede alterarse por calor.','Recuerda que la estructura de una proteína determina su actividad.'],
['Herencia y evolución','En un cruce Aa × Aa, donde A domina completamente sobre a, ¿qué probabilidad tiene cada descendiente de ser aa?','25 %',[['0 %','Los dos progenitores pueden aportar a.'],['50 %','De cuatro combinaciones equiprobables, solo una es aa.'],['75 %','Tres combinaciones muestran al menos un alelo A, pero no aa.']],'El cuadro de Punnett produce AA, Aa, Aa y aa; una de cuatro es aa.','Escribe los gametos A y a de cada progenitor.'],
['Herencia y evolución','Una especie tiene 2n = 12 cromosomas. ¿Cuántos cromosomas tendrá normalmente un gameto tras meiosis?','6',[['12','Los gametos son haploides, no diploides.'],['24','La meiosis no duplica el número cromosómico en gametos.'],['3','La reducción es a la mitad, no a un cuarto.']],'Meiosis reduce el número diploide 12 al número haploide 6.','Identifica primero qué significa 2n.'],
['Herencia y evolución','¿Cuál es una consecuencia importante del entrecruzamiento durante meiosis?','Nuevas combinaciones de alelos en cromátidas homólogas',[['Desaparece todo el ADN de los gametos','Los gametos conservan material genético.'],['Todos los descendientes pasan a ser clones','La recombinación aumenta diversidad, no produce clones.'],['Cada célula recibe necesariamente el doble de cromosomas','El entrecruzamiento intercambia segmentos, no duplica cromosomas.']],'Las cromátidas de cromosomas homólogos pueden intercambiar segmentos.','Busca el mecanismo que genera diversidad heredable.'],
['Herencia y evolución','Una mutación aparece en células de la piel de una persona adulta. ¿Qué afirmación es más adecuada?','Generalmente no se transmite a su descendencia por reproducción sexual',[['Siempre se hereda por todas las hijas e hijos','Las mutaciones somáticas no suelen alcanzar gametos.'],['Transforma automáticamente todos sus gametos','Una mutación local no cambia todas las células reproductivas.'],['Es necesariamente beneficiosa','Las mutaciones pueden ser neutras, perjudiciales o beneficiosas según contexto.']],'En reproducción sexual se heredan variantes presentes en la línea germinal, no necesariamente en células somáticas.','Diferencia células reproductivas de otras células corporales.'],
['Herencia y evolución','Una bacteria resistente se reproduce después de administrar un antibiótico. ¿Qué interpretación es compatible con evolución?','La selección favorece variantes resistentes preexistentes o surgidas por mutación',[['El medicamento enseña conscientemente a la bacteria','La evolución no depende de aprendizaje voluntario bacteriano.'],['Toda bacteria resistente proviene de una especie nueva','Resistencia puede variar dentro de una población.'],['El antibiótico crea siempre la misma mutación dirigida','La selección no requiere mutaciones orientadas por necesidad.']],'Las variantes resistentes sobreviven y pueden volverse más frecuentes.','Compara supervivencia diferencial con cambios dirigidos por voluntad.'],
['Organismo y ambiente','En un ecosistema aumenta la población de conejos y los zorros dependen de ellos. ¿Qué puede ocurrir inicialmente si otras condiciones se mantienen?','Puede aumentar la disponibilidad de alimento para los zorros',[['Siempre desaparecen los zorros inmediatamente','El incremento de presas no implica su desaparición inmediata.'],['Los conejos se vuelven productores','Los conejos siguen siendo consumidores.'],['Toda cadena trófica deja de transferir energía','El sistema puede seguir transfiriendo energía.']],'La disponibilidad de presas influye en la dinámica de las poblaciones de depredadores.','Evalúa el efecto directo sobre la disponibilidad de alimento.'],
['Organismo y ambiente','Una comunidad vegetal contiene tres especies; tras una sequía quedan solo dos. ¿Qué variable ha disminuido?','Riqueza de especies',[['Temperatura del ecosistema necesariamente','No hay datos de cambio de temperatura.'],['Cantidad de genes de toda la biosfera','No se pueden inferir los genes del planeta.'],['Número de niveles tróficos obligatoriamente','Una especie menos no determina niveles tróficos.']],'La riqueza de especies cuenta cuántas especies distintas hay en la comunidad.','No confundas número de especies con cantidad de individuos.'],
['Organismo y ambiente','En un experimento se comparan plantas con luz de distinta intensidad. ¿Qué condición conviene mantener constante para aislar el efecto de la luz?','La cantidad de agua suministrada',[['La intensidad lumínica','Es justamente la variable independiente que se modifica.'],['La altura final de las plantas','Es una posible variable dependiente.'],['El número de hojas producido','Es un resultado observable, no condición inicial fija.']],'Controlar agua permite atribuir con mayor certeza diferencias de crecimiento a la luz.','Identifica la variable manipulada y las que debes controlar.'],
['Procesos y funciones biológicas','Durante ejercicio intenso, la frecuencia respiratoria aumenta. ¿Qué función ayuda a satisfacer este ajuste?','Aumentar intercambio de O₂ y CO₂ con el ambiente',[['Transformar directamente aire en glucosa','La glucosa se obtiene por procesos metabólicos, no por aire inhalado.'],['Eliminar la necesidad de circulación sanguínea','Respiración y circulación trabajan juntas.'],['Detener completamente la respiración celular','El ejercicio demanda mayor producción de ATP.']],'El trabajo muscular eleva la demanda de O₂ y la producción de CO₂.','Vincula ejercicio con demanda energética.'],
['Procesos y funciones biológicas','Una vacuna estimula defensas del organismo sin provocar necesariamente la enfermedad completa. ¿Cuál es un objetivo principal?','Generar memoria inmunológica frente a un agente',[['Eliminar instantáneamente cualquier infección futura','La protección puede variar según agente y persona.'],['Reemplazar de forma permanente todos los leucocitos','La vacunación no requiere reemplazar todas esas células.'],['Provocar siempre una infección severa','Ese no es el objetivo de vacunarse.']],'Una respuesta adaptativa puede generar células de memoria que facilitan futuras respuestas.','Distingue memoria inmunológica de protección absoluta.'],
['Herencia y evolución','Dos especies comparten un ancestro relativamente reciente. ¿Qué tipo de evidencia suele apoyar esa relación?','Similitud en secuencias de ADN heredadas',[['Que tengan exactamente el mismo tamaño corporal','La talla puede evolucionar de forma independiente.'],['Que vivan obligatoriamente en el mismo lugar','La distribución no determina por sí sola parentesco.'],['Que usen siempre idéntico alimento','Las dietas parecidas pueden deberse a convergencia.']],'El parentesco evolutivo se investiga comparando caracteres heredables, incluidos segmentos de ADN.','Prefiere evidencias genéticas homologables a semejanzas superficiales.']
];
for(const [a,q,c,d,w,cl,sk] of sciMoreBio)sciExtra('Biología',a,'ME',q,c,d,w,cl,sk||'Procesar y analizar evidencia');


const sciMorePhysics=[
['Mecánica','Un móvil recorre 120 m en línea recta en 20 s a velocidad constante. ¿Cuál es su rapidez?','6 m/s',[['2.400 m/s','Multiplicar distancia y tiempo no es rapidez.'],['100 m/s','Restar tiempo de distancia no entrega rapidez.'],['0,17 m/s','Es la razón inversa tiempo/distancia.']],'La rapidez promedio es distancia dividida por tiempo: 120/20 = 6 m/s.','Escribe rapidez = distancia / tiempo.'],
['Mecánica','Un objeto de 3 kg experimenta una fuerza horizontal neta de 12 N. Sin otras fuerzas horizontales, ¿qué aceleración tiene?','4 m/s²',[['36 m/s²','Multiplicar fuerza por masa no aplica la segunda ley.'],['9 m/s²','Restar masa a fuerza no produce aceleración.'],['0,25 m/s²','Esta es la razón masa/fuerza.']],'De F = m·a se obtiene a = 12/3 = 4 m/s².','Divide fuerza neta por masa.'],
['Mecánica','Un objeto de 2 kg está en reposo cerca de la superficie terrestre. Si g ≈ 10 m/s², ¿cuánto vale aproximadamente su peso?','20 N',[['2 N','La masa numérica no es igual al peso.'],['0,2 N','Dividir masa por gravedad no entrega peso.'],['200 N','Se multiplicó por un factor adicional de diez.']],'El peso es fuerza gravitatoria: m·g = 2×10 = 20 N.','Recuerda que peso se mide en newtons.'],
['Mecánica','Un carrito aumenta su rapidez de 2 a 10 m/s en 4 s con aceleración constante. ¿Cuál es la aceleración?','2 m/s²',[['3 m/s²','La diferencia de velocidades es 8, no 12.'],['12 m/s²','Sumar velocidades no calcula la variación.'],['8 m/s²','8 m/s es cambio total, hay que dividir por 4 s.']],'La variación de velocidad es 8 m/s; dividida por 4 s resulta 2 m/s².','Calcula primero Δv y luego divide por Δt.'],
['Mecánica','Se levanta verticalmente una mochila de 5 kg una altura de 2 m a velocidad constante, con g≈10 m/s². ¿Qué trabajo realiza aproximadamente la fuerza que la eleva?','100 J',[['10 J','Es la gravedad aproximada y no el trabajo calculado.'],['25 J','Multiplicar masa y altura omite g.'],['250 J','Se introdujo un factor que no está en los datos.']],'W = fuerza×desplazamiento = m·g·h = 5×10×2 = 100 J.','Relaciona trabajo mecánico con fuerza y desplazamiento.'],
['Energía – Tierra','Una máquina recibe 500 J de energía y entrega 350 J de energía útil. ¿Cuál es su rendimiento energético?','70 %',[['150 %','La energía útil no puede superar la recibida en una máquina pasiva.'],['30 %','El 30 % corresponde a energía no aprovechada.'],['350 %','Confunde energía útil en julios con un porcentaje.']],'Rendimiento = energía útil / energía recibida ×100 = 350/500×100 = 70 %.','Compara salida útil con entrada total.'],
['Energía – Tierra','Una pelota desciende por una rampa sin fricción significativa. ¿Qué sucede con su energía potencial gravitatoria al bajar?','Disminuye mientras puede aumentar la energía cinética',[['Aumenta porque está más cerca del suelo','La energía potencial respecto al suelo disminuye con altura.'],['Desaparece toda la energía mecánica','Sin disipación apreciable, energía mecánica se conserva.'],['Permanece necesariamente constante','La altura cambia y también su energía potencial.']],'La energía gravitatoria depende de la altura; al perder altura puede transformarse en cinética.','Observa qué pasa con la altura y la rapidez.'],
['Ondas','El período de una onda es 0,2 s. ¿Cuál es su frecuencia?','5 Hz',[['0,2 Hz','Eso confunde período con frecuencia.'],['2 Hz','No corresponde al recíproco de 0,2 s.'],['20 Hz','Desplaza un decimal al invertir el período.']],'Frecuencia y período son inversos: f = 1/0,2 = 5 Hz.','Utiliza la relación f = 1/T entre frecuencia y período, cuidando las unidades.'],
['Ondas','Dos sonidos viajan por el mismo aire. Uno tiene frecuencia mayor. ¿Cuál característica suele percibirse diferente?','Un tono más agudo',[['Mayor rapidez de propagación por ser más agudo','En el mismo medio la rapidez sonora depende principalmente del medio.'],['Necesariamente mayor intensidad','Intensidad y frecuencia son magnitudes diferentes.'],['Mayor duración de cada nota','La duración no está determinada por la frecuencia.']],'La frecuencia está asociada con el tono; mayor frecuencia equivale a sonido más agudo.','Distingue frecuencia, amplitud y duración.'],
['Ondas','En una reflexión especular, un rayo de luz llega a un espejo plano con ángulo de incidencia de 35° respecto de la normal. ¿Cuál será el ángulo de reflexión?','35° respecto de la normal',[['55° respecto de la normal','Los 55° son complementarios respecto de la superficie, no el ángulo de reflexión normal.'],['70° respecto de la normal','No se duplica el ángulo de incidencia.'],['0° respecto de la normal','Solo incidiendo perpendicularmente la reflexión es 0°.']],'La ley de reflexión establece que ángulo de incidencia y reflexión son iguales respecto de la normal.','Ubica la normal perpendicular al espejo.'],
['Ondas','Al pasar desde aire al agua, un rayo de luz cambia de dirección. ¿Qué fenómeno se observa?','Refracción',[['Difracción','La difracción ocurre al rodear bordes o pasar rendijas.'],['Polarización','La polarización relaciona orientación de vibración luminosa.'],['Interferencia','La interferencia superpone ondas.']],'La luz puede desviarse al pasar entre medios donde cambia su rapidez.','Identifica si la luz cruzó una interfaz entre medios.'],
['Electricidad','Una resistencia de 6 Ω tiene una diferencia de potencial de 12 V. ¿Qué corriente circula por ella?','2 A',[['72 A','Multiplicar V por Ω no corresponde a ley de Ohm.'],['0,5 A','Es dividir 6 Ω por 12 V en orden inverso.'],['18 A','Sumar tensión y resistencia no calcula corriente.']],'Por ley de Ohm I = V/R = 12/6 = 2 A.','Escribe V = I·R antes de despejar.'],
['Electricidad','Dos resistencias de 3 Ω y 6 Ω se conectan en serie. ¿Cuál es su resistencia equivalente?','9 Ω',[['2 Ω','En paralelo sería 2 Ω; aquí están en serie.'],['3 Ω','Ignora la segunda resistencia.'],['18 Ω','Multiplicar resistencias no es la regla de serie.']],'En serie las resistencias se suman: 3+6=9 Ω.','Reconoce si existe una sola trayectoria para corriente.'],
['Electricidad','Dos resistencias de 6 Ω y 6 Ω se conectan en paralelo. ¿Cuál es su resistencia equivalente?','3 Ω',[['12 Ω','12 Ω corresponde a las mismas resistencias en serie.'],['6 Ω','En paralelo la resistencia equivalente es menor que cada rama idéntica.'],['36 Ω','Multiplicar valores no da resistencia equivalente.']],'Dos resistencias iguales en paralelo tienen una equivalente igual a la mitad: 3 Ω.','Cada rama permite una trayectoria adicional de corriente.'],
['Energía – Tierra','Una onda sísmica P llega antes que una onda S a una estación distante. ¿Qué permite inferir esa diferencia en tiempos?','Las ondas P se propagan generalmente más rápido que las S',[['Las S siempre fueron emitidas después','Ambas pueden originarse durante el mismo evento.'],['Las P solo viajan por el aire','Las P se propagan en materiales terrestres.'],['Las S tienen necesariamente más energía total','El tiempo de llegada por sí solo no determina energía total.']],'Las ondas P suelen ser más veloces, por eso se detectan primero.','Relaciona orden de llegada con rapidez de propagación.']
];
for(const [a,q,c,d,w,cl,sk] of sciMorePhysics)sciExtra('Física',a,'ME',q,c,d,w,cl,sk||'Procesar y analizar evidencia');


const sciMoreChemistry=[
['Estructura atómica','Un átomo neutro tiene número atómico 11. ¿Cuántos protones y electrones posee?','11 protones y 11 electrones',[['11 protones y 22 electrones','Un átomo neutro tiene igual número de protones y electrones.'],['22 protones y 11 electrones','El número atómico indica protones, no el doble.'],['11 neutrones y 11 protones necesariamente','El número de neutrones depende del isótopo.']],'Número atómico 11 significa 11 protones; al ser neutro también posee 11 electrones.','Distingue número atómico de masa atómica.'],
['Estructura atómica','Dos átomos con igual número de protones pero diferente número másico se comparan. ¿Cuál es la diferencia?','La cantidad de neutrones',[['La identidad del elemento','Con protones iguales pertenecen al mismo elemento.'],['La carga siempre es diferente','Pueden ser ambos neutros.'],['La ubicación periódica cambia a otra familia','Mismo número atómico conserva identidad periódica.']],'El número másico suma protones y neutrones: con protones fijos, cambia la cantidad de neutrones.','Recuerda A = Z + N.'],
['Estructura atómica','Un átomo neutro pierde un electrón. ¿En qué se transforma?','En un catión con carga positiva',[['En un anión con carga negativa','Perder carga negativa produce carga neta positiva.'],['En un isótopo más pesado','Los isótopos varían en neutrones, no electrones.'],['En otro elemento','La identidad del elemento depende de protones.']],'Pierde una carga negativa y queda con exceso neto de carga positiva.','Compara protones y electrones después de la pérdida.'],
['Estructura atómica','¿Qué tipo de enlace es más probable entre un metal alcalino y un halógeno como Na y Cl?','Enlace iónico con transferencia de electrones',[['Enlace metálico entre dos metales','El cloro es no metal.'],['Unión exclusivamente por puentes de hidrógeno','No es la interacción principal en NaCl sólido.'],['Enlace covalente idéntico al de H₂','NaCl se interpreta principalmente como compuesto iónico.']],'El sodio tiende a ceder un electrón y el cloro a captarlo, formando iones que se atraen.','Reconoce metal y no metal y sus tendencias electrónicas.'],
['Química orgánica','¿Cuál fórmula corresponde a un hidrocarburo saturado acíclico de tres carbonos?','C₃H₈',[['C₃H₆','Corresponde a fórmulas posibles de alqueno o cicloalcano.'],['C₃H₄','Tiene menos hidrógenos de los de un alcano saturado.'],['C₃H₁₂','Excede la valencia normal de los carbonos en un alcano.']],'Para alcanos acíclicos la fórmula general es CₙH₂ₙ₊₂, así que n=3 da C₃H₈.','Diferencia alcano saturado de alqueno y alquino.'],
['Química orgánica','La molécula CH₃−CH₂−OH se clasifica como:','Alcohol',[['Cetona','Una cetona tiene carbonilo C=O entre carbonos.'],['Ácido carboxílico','Un ácido tiene grupo carboxilo −COOH.'],['Éster','Un éster presenta un enlace característico −COO−.']],'El grupo −OH unido a un carbono saturado caracteriza al etanol, un alcohol.','Busca el grupo funcional, no solo la longitud de la cadena.'],
['Química orgánica','La cadena CH₂=CH₂ presenta un doble enlace entre carbonos. ¿A qué familia pertenece?','Alquenos',[['Alcanos','Los alcanos tienen enlaces simples carbono-carbono.'],['Alquinos','Los alquinos poseen triple enlace carbono-carbono.'],['Alcoholes','Requieren un grupo hidroxilo característico.']],'El enlace C=C es el rasgo distintivo de un alqueno.','Localiza si hay enlace simple, doble o triple.'],
['Química orgánica','En una molécula orgánica, ¿qué grupo permite identificar un ácido carboxílico?','−COOH',[['−OH aislado','Por sí solo puede corresponder a un alcohol.'],['−NH₂','Es característico de aminas simples.'],['−C≡C−','Indica un enlace triple de alquinos.']],'El grupo carboxilo combina carbonilo e hidroxilo unidos al mismo carbono.','Busca −C(=O)OH.'],
['Reacciones químicas y estequiometría','¿Qué coeficientes equilibran H₂ + O₂ → H₂O en su forma entera mínima?','2, 1, 2',[['1, 1, 1','No conserva el número de átomos de oxígeno.'],['2, 2, 1','Deja más átomos de oxígeno en reactivos que en productos.'],['1, 2, 2','No conserva ni hidrógeno ni oxígeno.']],'2 H₂ + O₂ → 2 H₂O contiene cuatro H y dos O en ambos lados.','Cuenta por separado cada elemento en reactivos y productos.'],
['Reacciones químicas y estequiometría','Si la masa molar de una sustancia es 20 g/mol, ¿cuántos moles hay en 40 g?','2 mol',[['800 mol','Multiplicar masa por masa molar no da moles.'],['0,5 mol','Es la razón inversa 20/40.'],['20 mol','Confunde masa molar con cantidad de sustancia.']],'La cantidad en moles es n = m/M = 40/20 = 2 mol.','Escribe unidades para cancelar gramos correctamente.'],
['Reacciones químicas y estequiometría','Se disuelven 0,5 mol de soluto hasta completar 2 L de solución. ¿Cuál es la concentración molar?','0,25 mol/L',[['1 mol/L','Multiplicar cantidad de sustancia por volumen no calcula molaridad.'],['4 mol/L','Es la operación inversa 2/0,5.'],['2,5 mol/L','Sumar los datos no representa concentración.']],'M = n/V = 0,5/2 = 0,25 mol/L.','Recuerda que el volumen debe expresarse en litros.'],
['Reacciones químicas y estequiometría','Se toman 100 mL de una solución 2 mol/L y se diluyen hasta 200 mL. ¿Cuál será la nueva concentración?','1 mol/L',[['4 mol/L','Al diluir a mayor volumen, la concentración disminuye.'],['2 mol/L','La concentración no queda igual al duplicar volumen.'],['0,1 mol/L','Se disminuyó demasiado la concentración sin proporcionalidad.']],'La cantidad de soluto se conserva: M₁V₁=M₂V₂; 2×100=M₂×200.','Comprueba que diluir no aumenta la cantidad de soluto.'],
['Reacciones químicas y estequiometría','En una reacción A + B → productos, hay 3 moles de A y 1 mol de B y reaccionan 1:1. ¿Qué reactivo es limitante?','B',[['A','A está en exceso relativo, ya que hay más moles disponibles.'],['Ambos exactamente','Las cantidades son distintas para proporción 1:1.'],['Ninguno porque nunca se agotan','Un reactivo se consume primero.']],'Cada mol de B requiere un mol de A; al agotarse 1 mol de B sobran 2 mol de A.','Compara moles disponibles con la proporción estequiométrica.'],
['Reacciones químicas y estequiometría','En un procedimiento se separan pigmentos de una hoja al desplazarse por papel con un disolvente. ¿Qué técnica se utiliza?','Cromatografía',[['Filtración por tamaño de partículas','La separación se debe a distintas afinidades con fases del sistema.'],['Decantación de líquidos inmiscibles','No se separan dos capas líquidas.'],['Destilación por ebullición','No se están evaporando componentes para condensarlos.']],'La cromatografía separa componentes por diferentes interacciones con fase móvil y estacionaria.','Observa si los componentes avanzan distancias diferentes sobre un soporte.']
];
for(const [a,q,c,d,w,cl,sk] of sciMoreChemistry)sciExtra('Química',a,'ME',q,c,d,w,cl,sk||'Procesar y analizar evidencia');


/* Cierre de cobertura electiva: 26 por mención para ensayos de 80 sin repeticiones. */
const sciMoreBioFinal=[
['Herencia y evolución','Una célula diploide tiene pares de cromosomas homólogos. ¿Qué ocurre con los homólogos durante la primera división meiótica?','Se separan hacia células hijas diferentes',[['Se duplican nuevamente después de anafase I','La replicación ocurre antes de la meiosis y no durante esa separación.'],['Siempre quedan juntos en la misma célula hija','En meiosis I los homólogos se distribuyen a células diferentes.'],['Pierden todos sus genes','Conservan su ADN al segregarse.']],'La meiosis I es reduccional: separa cromosomas homólogos.','Distingue homólogos de cromátidas hermanas.'],
['Organización, estructura y actividad celular','¿Qué molécula transporta desde el ADN hacia los ribosomas la información que será traducida a proteína?','ARN mensajero',[['ARN de transferencia exclusivamente','El ARNt aporta aminoácidos durante la traducción, no copia completa el mensaje.'],['Fosfolípido de membrana','Los fosfolípidos forman parte de las membranas.'],['Glucógeno','El glucógeno es una reserva de glucosa.']],'La transcripción genera ARN mensajero que porta la secuencia codificante hasta la traducción.','Ubica cuál producto resulta de transcribir un gen.'],
['Herencia y evolución','Un organismo heterocigoto Bb produce gametos mediante meiosis. Sin ligamiento ni distorsión, ¿qué proporción se espera de gametos con el alelo b?','50 %',[['0 %','Un heterocigoto sí porta el alelo b.'],['25 %','La mitad de los gametos recibe b en segregación simple.'],['100 %','También se forman gametos que llevan B.']],'Durante segregación mendeliana cada gameto recibe una de las dos variantes con igual probabilidad.','Separa los alelos B y b en los gametos.'],
['Organismo y ambiente','En una cadena trófica se estima que solo una parte de la energía pasa de un nivel al siguiente. ¿Qué fenómeno explica gran parte de esa pérdida?','Disipación de energía como calor durante procesos metabólicos',[['Creación espontánea de energía en productores','La energía no aparece desde la nada.'],['Transformación completa en ADN heredable','La energía no se conserva toda en moléculas hereditarias.'],['Desaparición de toda la materia orgánica','La materia puede seguir circulando en redes tróficas.']],'Los organismos consumen energía para mantener funciones y parte se disipa como calor.','Piensa en respiración celular y gasto energético.'],
['Procesos y funciones biológicas','Una persona sana presenta glucosa baja tras varias horas de ayuno. ¿Qué hormona contribuye a elevar la glucosa sanguínea?','Glucagón',[['Insulina','En general favorece disminuir glucosa circulante.'],['Melatonina','Se relaciona principalmente con ciclos de sueño.'],['Oxitocina','Tiene funciones diferentes en reproducción y comportamiento.']],'El glucagón estimula liberación de glucosa desde reservas, elevando la glicemia.','Diferencia las respuestas hormonales al ayuno y a la comida.'],
['Organismo y ambiente','En dos parcelas, una con diversidad de flores y otra con un solo cultivo, se registran visitas de polinizadores. ¿Qué variable dependiente debe medir el equipo?','Número de visitas de polinizadores por período',[['Tipo de parcela elegido','Corresponde a la condición comparada, no al resultado.'],['Variedad de flores sembradas','Es parte de la variable manipulada por parcela.'],['Duración prefijada de observación','Debe controlarse para comparar justamente.']],'Se mide el efecto de la diversidad floral sobre las visitas observadas.','La variable dependiente es el resultado que se cuantifica.'],
['Procesos y funciones biológicas','¿Cuál cambio es compatible con una respuesta inflamatoria local luego de una herida superficial?','Mayor flujo sanguíneo y llegada de células defensivas al tejido',[['Ausencia definitiva de respuesta inmune','Una herida puede activar defensas innatas.'],['Desaparición instantánea de todas las bacterias','La eliminación de microorganismos requiere procesos, no es automática.'],['Transformación de glóbulos rojos en neuronas','Los eritrocitos no se convierten en neuronas por inflamación.']],'La inflamación recluta componentes defensivos y suele provocar enrojecimiento y calor local.','Relaciona vasos sanguíneos, células inmunes y señales de daño.']
];for(const [a,q,c,d,w,cl] of sciMoreBioFinal)sciExtra('Biología',a,'ME',q,c,d,w,cl);
const sciMorePhysicsFinal=[
['Mecánica','Un ascensor se mueve hacia arriba con velocidad constante. ¿Cuál es la fuerza neta vertical sobre una persona en su interior?','Cero',[['Siempre igual al doble de su peso','Velocidad constante implica aceleración vertical cero.'],['Dirigida necesariamente hacia arriba','Subir no implica que exista aceleración hacia arriba.'],['Dirigida necesariamente hacia abajo','No hay aceleración vertical con velocidad constante.']],'Si la velocidad no cambia, la aceleración es cero y las fuerzas netas se equilibran.','Distingue dirección del movimiento y de la aceleración.'],
['Ondas','En el mismo medio, una onda mecánica duplica su frecuencia y su rapidez se mantiene. ¿Qué ocurre con su longitud de onda?','Se reduce a la mitad',[['Se duplica','Con rapidez fija v=fλ, al subir f disminuye λ.'],['Permanece idéntica','Frecuencia y longitud de onda cambian inversamente si v no cambia.'],['Se vuelve cero','Una frecuencia finita no implica longitud de onda nula.']],'De v=fλ y v constante, λ=v/f disminuye al duplicar frecuencia.','Mantén fija la rapidez del medio.'],
['Electricidad','Un dispositivo funciona a 12 V y consume 2 A. ¿Qué potencia eléctrica utiliza?','24 W',[['6 W','Dividir tensión por corriente no calcula potencia.'],['14 W','Sumar 12 y 2 no representa trabajo por tiempo.'],['144 W','Elevar el voltaje al cuadrado no es suficiente sin resistencia.']],'La potencia eléctrica es P=V·I=12×2=24 W.','Identifica tensión y corriente y multiplica.'],
['Electricidad','Dos resistencias, una de 4 Ω y otra de 12 Ω, están en paralelo. ¿Cuál es la equivalente?','3 Ω',[['16 Ω','La suma se usa en serie, no en paralelo.'],['8 Ω','La media aritmética no calcula la conexión en paralelo.'],['48 Ω','Multiplicar sin dividir por la suma da un resultado excesivo.']],'En paralelo 1/R=1/4+1/12=1/3, de modo que R=3 Ω.','La resistencia equivalente debe ser menor que 4 Ω.'],
['Energía – Tierra','Durante un terremoto se registran ondas P y S. ¿Qué propiedad impide a las ondas S propagarse por el núcleo externo líquido?','Su naturaleza de onda transversal de cizalla',[['Su frecuencia es siempre cero','Las ondas S tienen frecuencias y transportan perturbaciones.'],['Son ondas exclusivamente luminosas','Se trata de ondas sísmicas mecánicas.'],['No pueden propagarse en ningún sólido','Las ondas S se propagan en sólidos.']],'Un fluido no sostiene esfuerzos de cizalla como un sólido y no transmite ondas S.','Relaciona el tipo de deformación con el medio atravesado.'],
['Mecánica','Una persona realiza 600 J de trabajo mecánico en 20 s. ¿Cuál es la potencia media?','30 W',[['12.000 W','Multiplicar trabajo y tiempo no es potencia.'],['0,033 W','Es la razón inversa del cálculo requerido.'],['620 W','Sumar trabajo y tiempo mezcla unidades.']],'Potencia media = trabajo/tiempo = 600/20=30 J/s=30 W.','Recuerda que un watt equivale a un joule por segundo.'],
['Ondas','Se escucha una sirena con tono más agudo cuando una ambulancia se acerca que cuando se aleja. ¿Cuál fenómeno explica el cambio?','Efecto Doppler',[['Reflexión total interna','Este fenómeno describe propagación de luz en interfaces.'],['Electrólisis','La electrólisis es un proceso químico.'],['Inducción magnética solamente','No explica por sí sola el cambio de frecuencia percibida.']],'El movimiento relativo entre fuente y observador modifica la frecuencia que se percibe.','Compara sonido al acercarse y alejarse la fuente.']
];for(const [a,q,c,d,w,cl] of sciMorePhysicsFinal)sciExtra('Física',a,'ME',q,c,d,w,cl);
const sciMoreChemFinal=[
['Reacciones químicas y estequiometría','Para la reacción 2H₂ + O₂ → 2H₂O, si reaccionan 2 mol de H₂ con oxígeno suficiente, ¿cuántos moles de agua pueden formarse?','2 mol',[['1 mol','La relación de H₂ a H₂O es de 2 a 2.'],['4 mol','No se produce el doble de moles de agua con esa relación.'],['0,5 mol','No corresponde a los coeficientes estequiométricos.']],'La proporción 2:2 equivale a 1 mol de agua por 1 mol de H₂ consumido.','Usa coeficientes balanceados como razón entre moles.'],
['Estructura atómica','Un átomo de carbono tiene número atómico 6 y número másico 14. ¿Cuántos neutrones posee?','8',[['6','6 es número de protones.'],['14','14 corresponde a protones más neutrones.'],['20','Sumar Z y A no entrega neutrones.']],'Neutrones = A−Z =14−6=8.','Diferencia masa A de número atómico Z.'],
['Química orgánica','Una cadena CH₃−CH₂−CH₃ corresponde a:','Propano',[['Propeno','El propeno requiere al menos un doble enlace C=C.'],['Propino','El propino tiene un triple enlace C≡C.'],['Etano','Etano posee solo dos carbonos.']],'Hay tres carbonos y enlaces simples: un alcano llamado propano.','Cuenta carbonos y revisa los tipos de enlace.'],
['Reacciones químicas y estequiometría','Se mezclan 10 g de reactivo A con 15 g de reactivo B en un recipiente cerrado. Si reaccionan por completo, ¿qué masa total tendrán los productos?','25 g',[['5 g','Restar masas no representa conservación.'],['150 g','Multiplicar masas no calcula masa total.'],['15 g','Ignorar A viola conservación de materia.']],'La masa total se conserva: 10+15=25 g en recipiente cerrado.','Suma las masas iniciales si todo queda dentro del sistema.'],
['Química orgánica','¿Cuál de las siguientes moléculas contiene un grupo aldehído?','CH₃−CHO',[['CH₃−CO−CH₃','Esta molécula contiene un grupo cetona.'],['CH₃−CH₂−OH','Esta es un alcohol.'],['CH₃−COOH','Esta contiene un ácido carboxílico.']],'Un aldehído presenta el grupo terminal −CHO, como en CH₃−CHO.','Busca un carbonilo al extremo de cadena ligado a hidrógeno.'],
['Estructura atómica','Un elemento tiene electrones distribuidos en 2, 8 y 1 por niveles simplificados. ¿Cuántos electrones de valencia tiene?','1',[['2','2 corresponde al primer nivel interno.'],['8','8 corresponde al segundo nivel, no el externo.'],['11','11 es total de electrones, no los de valencia.']],'El nivel externo contiene 1 electrón; corresponde a su valencia simplificada.','Busca la cantidad del último nivel ocupado.'],
['Reacciones químicas y estequiometría','Se tienen 0,2 mol de soluto en 0,5 L de solución. ¿Cuál es la molaridad?','0,4 mol/L',[['0,1 mol/L','Multiplicar moles por litros da otro valor.'],['2,5 mol/L','Dividir volumen por moles invierte la relación.'],['0,7 mol/L','Sumar cantidades no calcula concentración.']],'M = 0,2/0,5=0,4 mol/L.','Divide cantidad de soluto en moles entre volumen total en litros.'],
['Química orgánica','Dos moléculas tienen la misma fórmula molecular, pero sus átomos están conectados en distinto orden. ¿Qué relación presentan?','Isomería estructural',[['Isotopía','Isótopos difieren en neutrones, no en conectividad molecular.'],['Identidad completa de estructura','Conexiones distintas implican estructuras distintas.'],['Ionización obligatoria','La conectividad no implica cambio de carga.']],'Los isómeros estructurales comparten fórmula molecular y difieren en conectividad.','Separa fórmula global de forma de enlace entre átomos.']
];for(const [a,q,c,d,w,cl] of sciMoreChemFinal)sciExtra('Química',a,'ME',q,c,d,w,cl);


const sciMoreTPBio=[
['Organización, estructura y actividad celular','Al observar una célula al microscopio se identifica una pared celular rígida, cloroplastos y una gran vacuola central. ¿Cuál es la clasificación más probable?','Célula vegetal',[['Neurona animal','Las neuronas no poseen cloroplastos ni pared celular.'],['Glóbulo rojo humano','Los glóbulos rojos maduros no tienen esas estructuras.'],['Bacteria fotosintética con núcleo definido','Las bacterias carecen de núcleo y cloroplastos eucariontes.']],'La combinación de cloroplastos, pared y gran vacuola es característica de muchas células vegetales.','Identifica organelos específicos antes de clasificar.'],
['Organización, estructura y actividad celular','Un equipo observa al microscopio células de una raíz en división. ¿Qué proceso permite formar dos células hijas con la misma cantidad de cromosomas?','Mitosis',[['Meiosis exclusivamente','La meiosis reduce cromosomas en formación de gametos.'],['Fecundación','La fecundación fusiona gametos, no divide una célula en dos.'],['Digestión celular','La digestión degrada moléculas y no distribuye cromosomas.']],'La mitosis conserva el número cromosómico durante la proliferación celular.','Distingue división de células corporales de formación de gametos.'],
['Procesos y funciones biológicas','Después de subir escaleras, el pulso y la respiración aumentan. ¿Cuál necesidad explica mejor ambos cambios?','Llevar más oxígeno y nutrientes a músculos activos y retirar CO₂',[['Detener la producción de energía celular','El ejercicio requiere más ATP.'],['Evitar toda circulación sanguínea','La circulación aumenta su trabajo en ejercicio.'],['Convertir directamente aire en proteína muscular','La respiración no transforma aire en proteína.']],'La demanda metabólica muscular requiere mayor transporte de gases y sustratos.','Relaciona actividad física con metabolismo.'],
['Organismo y ambiente','En un humedal se disminuye el número de insectos acuáticos. Si peces pequeños se alimentan de ellos, ¿cuál consecuencia directa es posible?','Menor disponibilidad de alimento para esos peces',[['Mayor cantidad automática de productores','La reducción de insectos no asegura aumentar plantas.'],['Desaparición inmediata de toda el agua','La población de insectos no controla por sí sola volumen de agua.'],['Transformación de peces en consumidores productores','Los peces no adquieren fotosíntesis al bajar su alimento.']],'La disponibilidad de presas influye en la alimentación de consumidores.','Localiza la relación entre insectos y peces en la cadena trófica.'],
['Herencia y evolución','Dos individuos de una especie difieren en color de pelaje. ¿Qué explicación es coherente con variación heredable?','Pueden tener diferentes combinaciones de alelos',[['El color depende únicamente de la voluntad','Un rasgo hereditario no se modifica por decisión consciente.'],['Todos los genes de la especie son idénticos','Las variantes genéticas pueden diferir entre individuos.'],['Las diferencias se originan siempre por falta de agua','No existe evidencia de esa causa exclusiva.']],'La variación genética incluye alelos diferentes que pueden influir en rasgos observables.','Distingue herencia de cambios circunstanciales del ambiente.'],
['Procesos y funciones biológicas','Una persona recibe una vacuna y desarrolla células de memoria inmunológica. ¿Qué facilita este proceso?','Una respuesta más rápida ante exposición futura al mismo agente',[['Que nunca vuelva a entrar un microorganismo','La vacunación no crea una barrera física absoluta.'],['Que desaparezcan todos los glóbulos blancos','La memoria depende de componentes del sistema inmune.'],['Que se elimine la circulación de sangre','La circulación sigue siendo necesaria.']],'Las células de memoria favorecen la respuesta inmunitaria ante contactos futuros.','Busca la ventaja de reconocer un agente ya conocido.'],
['Organismo y ambiente','Un curso compara el crecimiento de dos grupos de plantas con distinta cantidad de luz. ¿Qué debe medir para determinar el efecto del tratamiento?','La altura promedio ganada por las plantas',[['Solo el color de las macetas','El color no mide directamente crecimiento.'],['El número de etiquetas colocadas','Las etiquetas no representan respuesta biológica.'],['La cantidad de luz fijada previamente','Es la variable independiente y no la respuesta medida.']],'La altura ganada puede funcionar como variable dependiente del tratamiento luminoso.','Identifica qué resultado indica cuánto crecieron.']
];for(const [a,q,c,d,w,cl] of sciMoreTPBio)sciExtra('Biología',a,'MTP',q,c,d,w,cl);
const sciMoreTPPhysics=[
['Mecánica','Una ciclista recorre 45 km en 3 horas a rapidez media constante. ¿Cuál es su rapidez media?','15 km/h',[['135 km/h','Multiplicar distancia por tiempo no calcula rapidez.'],['42 km/h','Restar horas a kilómetros mezcla magnitudes.'],['0,067 km/h','Es la relación inversa 3/45.']],'Rapidez = distancia / tiempo = 45/3 =15 km/h.','Divide kilómetros recorridos por horas utilizadas.'],
['Mecánica','Un balón que rueda sobre el suelo va frenándose gradualmente. ¿Cuál interacción explica principalmente ese cambio?','El roce entre el balón y la superficie',[['La desaparición de toda su masa','La masa no desaparece por rodar.'],['Una fuerza que siempre acelera hacia adelante','No explica la pérdida de rapidez.'],['La ausencia total de fuerzas externas','Sin fuerza neta no se produciría la desaceleración observada.']],'El roce se opone al movimiento y contribuye a disminuir la rapidez.','Identifica la fuerza opuesta al desplazamiento.'],
['Ondas','Al golpear suavemente un tambor y luego con más fuerza, aumenta principalmente cuál característica del sonido?','Su intensidad sonora',[['Su velocidad en aire necesariamente','En el mismo medio, la rapidez no depende directamente del golpe.'],['Su frecuencia siempre se duplica','Mayor amplitud no implica necesariamente frecuencia doble.'],['Su duración se vuelve infinita','El sonido sigue decayendo con el tiempo.']],'Un golpe más fuerte suele producir mayor amplitud de vibración e intensidad.','Distingue fuerte y débil de agudo y grave.'],
['Electricidad','Un circuito sencillo necesita que una pila encienda una ampolleta. ¿Qué condición debe cumplirse?','Debe existir un camino conductor cerrado',[['La ampolleta debe estar desconectada','Sin camino cerrado no circula corriente.'],['Solo debe haber un cable suelto','Un cable sin conexión completa no cierra circuito.'],['Los terminales de la pila deben aislarse totalmente','Eso impide la circulación eléctrica.']],'La corriente necesita una trayectoria cerrada a través del circuito.','Traza el camino desde un terminal hasta el otro.'],
['Electricidad','¿Qué dispositivo protege una instalación al interrumpir el paso de corriente excesiva?','Un interruptor automático de protección',[['Un cable pelado','Un cable dañado aumenta el riesgo eléctrico.'],['Una extensión sobrecargada','Sobrecargar una extensión puede provocar calentamiento.'],['Una ampolleta sin casquillo','No es un elemento de protección eléctrica.']],'Los interruptores automáticos abren el circuito ante condiciones de sobrecorriente.','Busca un mecanismo que corte corriente por seguridad.'],
['Energía – Tierra','En una central hidroeléctrica, el movimiento del agua hace girar turbinas. ¿Qué transformación de energía se aprovecha?','De energía del agua en movimiento a energía eléctrica',[['De electricidad a energía química en el agua','No es el proceso generador principal.'],['De sonido del río a masa de metal','No describe una transformación útil de la central.'],['De calor ambiental directamente a petróleo','No se produce petróleo en la turbina.']],'Las turbinas transforman energía mecánica del agua y permiten generar electricidad.','Identifica qué mueve la turbina y qué energía sale de la central.'],
['Ondas','Cuando escuchas un eco en un túnel, ¿qué ocurrió con las ondas sonoras?','Se reflejaron en una superficie y regresaron',[['Se convirtieron en luz visible','El sonido no pasa a luz de forma ordinaria en ese fenómeno.'],['Desaparecieron antes de llegar al muro','Para oír eco deben regresar ondas reflejadas.'],['Se originaron solo en el oído','El eco proviene de la reflexión de un sonido real.']],'Un eco es una repetición perceptible producida por reflexión de sonido.','Busca una superficie donde la onda pueda rebotar.']
];for(const [a,q,c,d,w,cl] of sciMoreTPPhysics)sciExtra('Física',a,'MTP',q,c,d,w,cl);


const sciMoreTPChem=[
['Estructura atómica','¿Qué partícula subatómica tiene carga eléctrica negativa?','Electrón',[['Protón','Los protones tienen carga positiva.'],['Neutrón','Los neutrones no poseen carga neta.'],['Núcleo como partícula simple','El núcleo contiene varias partículas y carga total positiva.']],'Los electrones poseen carga negativa y ocupan regiones alrededor del núcleo.','Relaciona protón, neutrón y electrón con sus cargas.'],
['Estructura atómica','La tabla periódica agrupa elementos con propiedades relacionadas en columnas. ¿Cómo se llaman esas columnas?','Grupos o familias',[['Períodos','Los períodos corresponden a filas horizontales.'],['Isótopos','Los isótopos son variantes de un mismo elemento.'],['Mezclas heterogéneas','Las mezclas no son categorías de columnas periódicas.']],'Las columnas verticales son grupos o familias con patrones de electrones de valencia.','Distingue filas de columnas en una tabla periódica.'],
['Reacciones químicas y estequiometría','Se combinan 8 g de A y 12 g de B en un recipiente cerrado sin residuos. ¿Qué masa tendrán los productos formados?','20 g',[['4 g','La diferencia de masas no representa masa total conservada.'],['96 g','El producto de masas no es una ley de conservación.'],['12 g','No se puede ignorar la masa del reactivo A.']],'La masa total se conserva: 8+12 = 20 g.','Suma materia inicial si toda permanece dentro del recipiente.'],
['Química orgánica','Una molécula contiene únicamente carbono e hidrógeno. ¿Cómo se clasifica de forma general?','Hidrocarburo',[['Sal inorgánica obligatoriamente','Las sales contienen especies iónicas y no se definen solo por C e H.'],['Ácido carboxílico necesariamente','Un ácido carboxílico incluye oxígeno en −COOH.'],['Alcohol necesariamente','Los alcoholes necesitan el grupo hidroxilo con oxígeno.']],'Los hidrocarburos contienen solo átomos de carbono e hidrógeno.','Busca cuáles elementos aparecen en la fórmula.'],
['Reacciones químicas y estequiometría','Una solución tiene 10 g de sal disueltos en 100 g de agua. ¿Cuál es la masa total de la solución?','110 g',[['90 g','Restar la masa de sal no da el total.'],['10 g','Ignora la masa del solvente.'],['1.000 g','Multiplicar las masas no corresponde.']],'La masa de la solución es la suma del soluto y el solvente: 110 g.','Distingue cantidad de sal de masa total de solución.'],
['Reacciones químicas y estequiometría','Un estudiante compara dos vasos de agua a igual volumen. Uno contiene más azúcar disuelta que el otro. ¿Qué afirmación es razonable?','El vaso con más azúcar tiene mayor concentración de soluto',[['Ambos tienen concentración idéntica siempre','La cantidad de soluto difiere con igual volumen.'],['El azúcar se transforma en agua al disolverse','La disolución no implica esa reacción.'],['El vaso menos dulce contiene necesariamente más azúcar','Contradice la comparación de cantidad disuelta.']],'Con igual volumen de solución, mayor masa de soluto implica mayor concentración.','Compara la cantidad disuelta manteniendo fijo el volumen.']
];for(const [a,q,c,d,w,cl] of sciMoreTPChem)sciExtra('Química',a,'MTP',q,c,d,w,cl);


const sciNervousSystem2027=[
['Procesos y funciones biológicas','Una neurona recibe señales en sus dendritas y transmite un potencial de acción. ¿Qué estructura suele conducir ese impulso desde el cuerpo celular hacia otras células?','El axón',[['Las dendritas','Las dendritas reciben principalmente señales hacia el cuerpo celular; no son la vía típica de salida del potencial de acción.'],['La hendidura sináptica','La hendidura es el espacio entre células; no es una prolongación que conduzca el impulso dentro de la neurona.'],['El núcleo','El núcleo contiene ADN, pero no conduce el potencial de acción hasta la terminal neuronal.']],'Distingue las regiones que reciben información de la prolongación que conduce la señal hacia otras células.','El axón conduce el potencial de acción desde la región de inicio hasta sus terminales.'],
['Procesos y funciones biológicas','Dos axones de diámetro similar conducen impulsos. Uno tiene mielina intacta y el otro perdió gran parte de ella. ¿Qué resultado es más probable?','El axón mielinizado conduce más rápidamente',[['Ambos conducen necesariamente a idéntica rapidez','La mielina modifica las propiedades eléctricas de la membrana y facilita la conducción saltatoria.'],['El axón sin mielina conduce más rápido porque expone toda su membrana','La exposición de membrana no reemplaza la ventaja de la conducción saltatoria entre nodos.'],['La mielina transforma el impulso eléctrico en una hormona','La mielina facilita la propagación eléctrica; no convierte impulsos en señales hormonales.']],'Compara la propagación de un potencial de acción entre axones semejantes que difieren en mielina.','La mielina permite conducción saltatoria entre nodos de Ranvier y normalmente aumenta la velocidad.'],
['Procesos y funciones biológicas','En un experimento se bloquean canales de sodio dependientes de voltaje de un axón. ¿Qué efecto se espera sobre la fase ascendente del potencial de acción?','Se dificulta la despolarización rápida',[['Se acelera la entrada de sodio','El bloqueo impide la entrada de sodio por esos canales durante la fase ascendente.'],['Se produce una despolarización más intensa por salida de potasio','La salida de potasio suele contribuir a la repolarización, no explica la fase ascendente.'],['Aumenta la liberación de neurotransmisores sin necesidad de impulso','La liberación sináptica depende de procesos terminales y no compensa el bloqueo de la conducción axonal.']],'Identifica qué ion entra por los canales responsables de la fase ascendente del potencial de acción.','La apertura de canales de sodio permite una entrada rápida de Na+ y la despolarización.'],
['Procesos y funciones biológicas','Al tocar accidentalmente una superficie caliente, una persona retira la mano antes de reconocer conscientemente el dolor. ¿Qué explicación es la más adecuada?','Un circuito reflejo medular puede activar músculos antes de la percepción consciente',[['La percepción consciente debe preceder a toda contracción muscular','La respuesta refleja puede organizarse a nivel medular sin esperar el procesamiento consciente.'],['Los músculos detectan directamente el calor y deciden contraerse','Los receptores sensoriales detectan el estímulo y el circuito nervioso coordina la respuesta.'],['El cerebro deja de recibir información sensorial durante el reflejo','La información puede ascender al encéfalo aunque la respuesta motora se inicie antes.']],'Distingue el circuito que inicia la respuesta motora de la vía que permite percibir el dolor.','El arco reflejo puede activar una respuesta rápida en la médula espinal antes de la percepción consciente.'],
['Procesos y funciones biológicas','Se estimula una neurona presináptica, pero se bloquea la entrada de calcio en sus terminales. ¿Qué cambio se espera en una sinapsis química típica?','Disminuye la liberación de neurotransmisores',[['Aumenta la exocitosis de vesículas sinápticas','La entrada de calcio normalmente desencadena la fusión de vesículas con la membrana presináptica.'],['Los neurotransmisores cruzan la hendidura como impulsos eléctricos','En la sinapsis química cruzan moléculas mensajeras, no potenciales de acción propagados por el espacio.'],['Los receptores postsinápticos producen automáticamente más neurotransmisor presináptico','La activación de receptores postsinápticos no sustituye la entrada de calcio requerida para la liberación.']],'Relaciona la entrada de calcio presináptico con la exocitosis de vesículas.','La entrada de Ca2+ en la terminal facilita la fusión vesicular y la liberación del neurotransmisor.'],
['Procesos y funciones biológicas','Un estudio compara el tiempo de reacción antes y después de una noche de sueño insuficiente. ¿Qué diseño permite atribuir mejor un cambio al sueño?','Medir a las mismas personas en condiciones comparables y controlar otras variables',[['Comparar personas de distintas edades sin registrar horas de sueño','Las diferencias de edad y sueño impiden aislar el factor estudiado.'],['Medir solo a quienes durmieron poco y asumir que siempre reaccionan lento','Sin comparación adecuada no puede estimarse el cambio atribuible al sueño.'],['Preguntar únicamente si las personas creen reaccionar más rápido','La percepción subjetiva no sustituye una medición objetiva del tiempo de reacción.']],'Reconoce qué variables podrían alterar el tiempo de reacción además del sueño.','La comparación controlada y medidas repetidas permiten interpretar mejor la asociación entre sueño y desempeño.'],
['Procesos y funciones biológicas','Una persona consume alcohol y presenta peor coordinación motora. ¿Cuál inferencia es científicamente más razonable?','El alcohol puede alterar la actividad del sistema nervioso central y la coordinación',[['El alcohol acelera de manera uniforme la conducción de todas las neuronas','Sus efectos sobre circuitos nerviosos no implican una aceleración uniforme de todos los impulsos.'],['La coordinación depende exclusivamente de la fuerza muscular','La coordinación requiere integración de señales en el sistema nervioso, además de músculos funcionales.'],['Una disminución de coordinación demuestra daño irreversible en cada neurona','El cambio observado no permite concluir que todas las neuronas sufran daño irreversible.']],'Relaciona la coordinación motora con el funcionamiento de circuitos nerviosos.','El alcohol afecta funciones del sistema nervioso central y puede perjudicar coordinación y tiempo de reacción.'],
['Procesos y funciones biológicas','Se registra actividad eléctrica en una neurona sensorial después de aplicar presión sobre la piel. ¿Qué interpretación explica mejor el inicio de la señal?','Un receptor mecanosensible convierte el estímulo físico en una señal eléctrica',[['La presión viaja intacta por el axón como una fuerza mecánica','La información se codifica eléctricamente; la presión no se transporta como fuerza por el axón.'],['El axón fabrica hormonas cada vez que se comprime la piel','La detección de presión utiliza transducción sensorial, no requiere fabricar hormonas.'],['La médula espinal genera primero la presión que detecta la piel','El estímulo físico ocurre en la piel antes de la transmisión de información al sistema nervioso central.']],'Distingue el estímulo externo del tipo de señal que conduce la neurona.','Los mecanorreceptores convierten deformaciones mecánicas en cambios eléctricos que pueden generar impulsos.']
];
for(const [a,q,c,d,w,cl] of sciNervousSystem2027)sciExtra('Biología',a,'ME',q,c,d,w,cl);

window.SCIENCE_TOPICS=SCIENCE_TOPICS;
window.SCIENCE_SKILLS=SCIENCE_SKILLS;
window.SCIENCE_BANK=SCIENCE_BANK;

const SCIENCE_EDITORIAL_LOTE_1={"SCI-121":{"steps":["Tras ayuno, la glucosa sanguínea tiende a bajar.","El páncreas libera glucagón, que favorece la liberación de glucosa por el hígado.","La insulina suele actuar en sentido opuesto cuando la glicemia aumenta."],"easy":"El glucagón ayuda a elevar la glucosa cuando llevas horas sin comer.","example":"El hígado puede degradar glucógeno y liberar glucosa en respuesta al glucagón."},"SCI-122":{"steps":["La diversidad floral es la condición que se compara entre parcelas.","El resultado observado es la frecuencia de visitas de polinizadores.","Cuenta visitas por un mismo período y con procedimientos comparables."],"easy":"Lo que se mide es cuántas visitas reciben las flores.","example":"Registrar visitas durante 20 minutos en cada parcela permite comparar el resultado."},"SCI-123":{"steps":["Una lesión activa señales locales del sistema inmune innato.","La vasodilatación aumenta el flujo sanguíneo y facilita llegada de células defensivas.","Enrojecimiento y calor pueden acompañar esa respuesta."],"easy":"La zona puede ponerse roja y caliente porque llega más sangre.","example":"Tras un raspón leve, células inmunitarias acuden al tejido dañado."},"SCI-124":{"steps":["Velocidad constante significa aceleración igual a cero.","Por F_neta=m×a, la fuerza neta vertical es cero.","Eso no significa ausencia de fuerzas: peso y fuerza normal se equilibran."],"easy":"Aunque suba, si no acelera la fuerza neta es cero.","example":"La fuerza del piso del ascensor sobre la persona equilibra su peso."},"SCI-125":{"steps":["La rapidez de propagación permanece constante en el mismo medio.","Aplica v=λf: si f se duplica, λ debe dividirse por dos.","No confundas frecuencia con amplitud."],"easy":"El doble de ciclos por segundo implica la mitad de distancia por ciclo.","example":"Si inicialmente λ=4 m, al duplicar f con la misma rapidez pasa a 2 m."},"SCI-126":{"steps":["La potencia eléctrica se calcula como P=VI.","Sustituye V=12 V e I=2 A.","Al multiplicar 12×2 se obtiene una potencia de 24 W."],"easy":"Multiplica voltaje por corriente para obtener potencia.","example":"Un equipo de 24 W consume 24 joules de energía cada segundo."},"SCI-127":{"steps":["En paralelo, 1/R_eq=1/4+1/12.","Suma fracciones: 3/12+1/12=4/12=1/3.","Invierte el resultado: R_eq=3 Ω."],"easy":"Dos caminos en paralelo reducen la resistencia equivalente.","example":"La equivalente de 3 Ω es menor que ambas resistencias individuales, como debe ocurrir en paralelo."},"SCI-128":{"steps":["Las ondas S producen deformación de cizalla transversal.","Un líquido no sostiene esfuerzos cortantes elásticos como un sólido.","Por eso no atraviesan el núcleo externo líquido de la Tierra."],"easy":"Las ondas S necesitan un medio que resista deformación de cizalla.","example":"La ausencia de ondas S directas a través del núcleo externo ayuda a inferir su estado líquido."},"SCI-129":{"steps":["Potencia media es trabajo dividido por tiempo.","Sustituye los datos: P=600 J divididos por 20 s.","P=30 W, ya que 1 W=1 J/s."],"easy":"Se hicieron 30 joules de trabajo por segundo, en promedio.","example":"Realizar 600 J en 20 s equivale a una potencia media de 30 W."},"SCI-130":{"steps":["El movimiento relativo entre fuente y oyente cambia la frecuencia percibida.","Cuando la ambulancia se acerca, los frentes de onda llegan más frecuentemente.","Cuando se aleja, la frecuencia percibida disminuye: efecto Doppler."],"easy":"La sirena se oye más aguda al acercarse y más grave al alejarse.","example":"El tono cambia aunque la sirena emita una frecuencia aproximadamente constante."},"SCI-131":{"steps":["La ecuación balanceada es 2H₂+O₂→2H₂O.","La relación molar H₂:H₂O es 2:2, equivalente a 1:1.","Con oxígeno suficiente, 2 mol de H₂ producen 2 mol de H₂O."],"easy":"Dos moles de hidrógeno producen dos de agua según los coeficientes.","example":"Los coeficientes de una ecuación balanceada indican proporciones de moles."},"SCI-132":{"steps":["El número másico A es protones más neutrones.","El número atómico Z indica protones: Z=6.","Neutrones=A−Z=14−6=8."],"easy":"Resta número atómico al número másico.","example":"Carbono-14 tiene seis protones y ocho neutrones."},"SCI-133":{"steps":["CH₃−CH₂−CH₃ tiene tres átomos de carbono.","Solo contiene enlaces simples entre carbonos: es un alcano.","El alcano de tres carbonos se llama propano."],"easy":"Tres carbonos con enlaces simples forman propano.","example":"Su fórmula molecular es C₃H₈."},"SCI-134":{"steps":["La reacción ocurre en recipiente cerrado sin pérdida de materia.","La masa total se conserva aunque cambien las sustancias.","Masa final=10 g+15 g=25 g."],"easy":"Los productos pesan lo mismo que los reactivos consumidos.","example":"Si entran 25 g de reactivos y todo reacciona sin pérdidas, salen 25 g de productos."},"SCI-135":{"steps":["Un aldehído contiene un carbonilo terminal −CHO.","CH₃−CHO presenta ese grupo al final de la cadena.","No lo confundas con cetonas, que tienen el carbonilo entre carbonos."],"easy":"El grupo −CHO al extremo identifica un aldehído.","example":"CH₃CHO es etanal, un aldehído de dos carbonos."},"SCI-136":{"steps":["La distribución simplificada es 2, 8, 1.","El último nivel ocupado tiene un electrón.","Por eso posee un electrón de valencia."],"easy":"Mira el último número de la distribución por capas.","example":"La distribución 2,8,1 corresponde a un átomo neutro de sodio con un electrón externo."},"SCI-137":{"steps":["Molaridad M=n/V con V expresado en litros.","Sustituye n=0,2 mol y V=0,5 L.","M=0,2/0,5=0,4 mol/L."],"easy":"Divide los moles por los litros de solución.","example":"Medio litro con 0,2 mol equivale a 0,4 mol por litro."},"SCI-138":{"steps":["Ambas moléculas comparten la fórmula molecular.","Sus átomos están enlazados en un orden distinto.","Eso define isomería estructural o constitucional."],"easy":"Misma fórmula, distinta conexión entre átomos.","example":"Etanol y dimetil éter comparten C₂H₆O, pero sus átomos están conectados de manera diferente."},"SCI-139":{"steps":["La pared celular aporta soporte rígido.","Los cloroplastos permiten fotosíntesis y la vacuola central suele ser grande.","La combinación es característica de células vegetales fotosintéticas."],"easy":"Pared, cloroplastos y gran vacuola apuntan a célula vegetal.","example":"Una célula de hoja suele presentar esas estructuras."},"SCI-140":{"steps":["Las células de raíz somática se dividen para crecimiento.","La mitosis conserva normalmente el número cromosómico en las células hijas.","La meiosis, en cambio, forma células con dotación cromosómica reducida."],"easy":"La mitosis genera dos células con igual número de cromosomas.","example":"En una raíz diploide, las nuevas células somáticas suelen seguir siendo diploides."},"SCI-141":{"steps":["Al subir escaleras aumenta la demanda energética de músculos.","Aumenta el transporte de oxígeno y nutrientes y la eliminación de CO₂.","Por eso suelen elevarse frecuencia cardíaca y respiratoria."],"easy":"El cuerpo acelera circulación y respiración para abastecer músculos.","example":"La respiración elimina CO₂ producido por actividad metabólica intensa."},"SCI-142":{"steps":["Los peces pequeños se alimentan de insectos acuáticos.","Si disminuyen esas presas, se reduce su alimento disponible.","El efecto poblacional posterior depende de otras fuentes de alimento y condiciones."],"easy":"Menos insectos significa potencialmente menos comida para esos peces.","example":"La disminución de presas puede obligar a peces a cambiar dieta o reducir su crecimiento."},"SCI-143":{"steps":["El color del pelaje puede depender de variantes genéticas heredables.","Distintas combinaciones de alelos pueden contribuir a diferencias observadas.","El ambiente también puede influir; no toda diferencia visible es genética."],"easy":"Dos animales pueden heredar alelos distintos para un rasgo.","example":"Si los padres transmiten variantes de un gen pigmentario, sus crías pueden mostrar pelajes diferentes."},"SCI-144":{"steps":["La vacuna activa una respuesta adaptativa específica.","Se pueden formar linfocitos de memoria.","Ante exposición futura, la respuesta suele iniciarse con mayor rapidez."],"easy":"La vacuna entrena defensas para reconocer antes un agente.","example":"Una segunda exposición puede activar células de memoria sin partir desde cero."},"SCI-145":{"steps":["La cantidad de luz es la variable independiente.","El crecimiento medido es la variable dependiente.","Comparar altura ganada promedio permite estimar el efecto entre grupos."],"easy":"Hay que medir cuánto crecieron, no solo cuánto sol recibieron.","example":"Medir altura inicial y final de cada planta permite calcular su crecimiento."},"SCI-146":{"steps":["Rapidez media=distancia total/tiempo total.","Sustituye 45 km/3 h.","El resultado es una rapidez media de 15 km/h."],"easy":"Divide kilómetros recorridos por horas empleadas.","example":"En una hora, a esa rapidez media, recorrería 15 km."},"SCI-147":{"steps":["Si el balón pierde rapidez, existe aceleración opuesta al movimiento.","El roce con el suelo contribuye a frenarlo.","La resistencia del aire también puede intervenir, según las condiciones."],"easy":"La fricción se opone al movimiento y reduce la rapidez.","example":"Un balón sobre una superficie rugosa suele detenerse antes que en una muy lisa."},"SCI-148":{"steps":["Golpear más fuerte suele generar mayor amplitud de vibración.","Mayor amplitud se relaciona con mayor intensidad sonora.","No significa necesariamente mayor frecuencia ni tono más agudo."],"easy":"El golpe más fuerte hace que el sonido se escuche más intenso.","example":"Un tambor puede sonar más fuerte sin cambiar sustancialmente de nota."},"SCI-149":{"steps":["La corriente necesita una trayectoria conductora completa.","Si hay un corte, la corriente no circula por la ampolleta.","El circuito debe estar cerrado para encenderla."],"easy":"La electricidad necesita un camino cerrado entre los terminales.","example":"Un interruptor abierto impide el paso de corriente y apaga la ampolleta."},"SCI-150":{"steps":["Una corriente excesiva puede sobrecalentar conductores.","Un interruptor automático abre el circuito ante una sobrecorriente según su diseño.","No debe confundirse con un interruptor común sin función de protección."],"easy":"El automático corta la corriente cuando supera un límite de protección.","example":"Ante una sobrecarga, un interruptor termomagnético puede desconectar el circuito."},"SCI-151":{"steps":["El agua posee energía por su altura y movimiento.","El flujo hace girar una turbina acoplada a un generador.","El generador transforma energía mecánica en eléctrica."],"easy":"El movimiento del agua termina produciendo electricidad.","example":"En una central, el agua mueve turbinas que accionan un generador eléctrico."},"SCI-152":{"steps":["El sonido se propaga desde la fuente.","Al chocar con una superficie distante, parte se refleja.","El sonido reflejado regresa y puede oírse como eco."],"easy":"El eco es sonido que rebota y vuelve.","example":"Una voz en un túnel puede regresar tras reflejarse en paredes lejanas."},"SCI-153":{"steps":["Las partículas subatómicas tienen cargas distintas.","El electrón posee carga negativa; protón positiva y neutrón neutra.","La respuesta es electrón."],"easy":"El electrón es la partícula con carga negativa.","example":"Al perder electrones, un átomo puede quedar con carga neta positiva."},"SCI-154":{"steps":["Las columnas verticales de la tabla periódica se llaman grupos.","Elementos del mismo grupo suelen compartir patrones de electrones de valencia.","Por eso muestran propiedades químicas relacionadas."],"easy":"Las columnas son grupos o familias.","example":"Los metales alcalinos aparecen en el grupo 1 de la tabla."},"SCI-155":{"steps":["La masa de los reactivos es 8 g+12 g=20 g.","El recipiente está cerrado y no quedan residuos.","La conservación de masa exige 20 g de productos."],"easy":"La materia se reorganiza, no desaparece.","example":"Si todos los reactivos se convierten en productos, la masa total sigue siendo 20 g."},"SCI-156":{"steps":["Un hidrocarburo contiene únicamente carbono e hidrógeno.","La molécula cumple esa condición.","No requiere tener enlaces simples: puede ser alcano, alqueno o alquino."],"easy":"Si solo hay carbono e hidrógeno, es hidrocarburo.","example":"CH₄ y C₂H₄ son hidrocarburos aunque tengan estructuras diferentes."},"SCI-157":{"steps":["La solución combina soluto y solvente.","Masa total=10 g de sal+100 g de agua.","Resulta 110 g, sin pérdidas."],"easy":"Suma la masa del azúcar o sal y la del agua.","example":"10 g de sal disueltos en 100 g de agua producen 110 g de solución."},"SCI-158":{"steps":["Ambos vasos tienen el mismo volumen.","El que contiene mayor masa de azúcar disuelta tiene más soluto por volumen.","Por ello tiene mayor concentración."],"easy":"A igual volumen, más azúcar disuelta significa solución más concentrada.","example":"Si ambos vasos tienen 200 mL, el que contiene 20 g tiene mayor concentración que uno con 5 g."},"SCI-159":{"steps":["Las dendritas suelen recibir señales.","El axón conduce potenciales de acción desde la región de inicio hacia terminales.","Por eso la estructura indicada es el axón."],"easy":"El axón transporta la señal eléctrica hacia otras células.","example":"Una motoneurona conduce impulsos por su axón hasta terminales cercanos al músculo."},"SCI-160":{"steps":["La mielina favorece conducción saltatoria en axones mielinizados.","Con diámetro comparable, esa conducción suele ser más rápida.","La pérdida de mielina puede enlentecer o bloquear señales."],"easy":"La mielina ayuda a que el impulso viaje más rápido.","example":"Los potenciales de acción se regeneran principalmente en nodos de Ranvier."},"SCI-161":{"steps":["Los canales de sodio dependientes de voltaje permiten entrada rápida de Na⁺.","Esa corriente contribuye a la fase ascendente del potencial de acción.","Si se bloquean, la despolarización rápida se dificulta."],"easy":"Sin entrada de sodio, el impulso nervioso puede fallar.","example":"Bloquear canales de Na⁺ puede impedir la propagación normal del potencial de acción."},"SCI-162":{"steps":["Un estímulo doloroso activa receptores sensoriales.","La médula espinal puede coordinar un reflejo motor antes de la percepción consciente.","Por eso la mano se retira rápidamente."],"easy":"La médula puede activar la retirada antes de que seas consciente del dolor.","example":"Tocar una superficie muy caliente puede provocar un reflejo de flexión."},"SCI-163":{"steps":["En sinapsis química, el potencial de acción abre canales de calcio.","La entrada de Ca²⁺ favorece fusión de vesículas y liberación de neurotransmisor.","Si se bloquea el calcio, suele disminuir esa liberación."],"easy":"El calcio ayuda a que la neurona libere mensajeros químicos.","example":"Sin entrada presináptica de Ca²⁺, se reduce la exocitosis de vesículas."},"SCI-164":{"steps":["El estudio busca relacionar sueño y tiempo de reacción.","Medir a las mismas personas reduce diferencias individuales; controlar horario y condiciones limita confusores.","Comparar resultados antes y después permite evaluar el cambio, aunque no elimina todos los sesgos."],"easy":"Usa condiciones equivalentes y compara a las mismas personas.","example":"Un diseño contrabalanceado con descanso y sueño insuficiente puede mejorar la comparación."},"SCI-165":{"steps":["El alcohol actúa sobre el sistema nervioso central.","Puede alterar procesamiento de información, coordinación y reflejos.","La observación no permite concluir un mecanismo único ni un efecto idéntico en todos."],"easy":"El alcohol puede empeorar la coordinación al afectar el cerebro.","example":"El deterioro del equilibrio y del tiempo de reacción es compatible con sus efectos nerviosos."},"SCI-166":{"steps":["La presión deforma estructuras mecanosensibles en la piel.","Los receptores convierten ese estímulo mecánico en cambios de potencial eléctrico.","Si se alcanza umbral, se pueden generar impulsos nerviosos."],"easy":"La piel convierte presión en señales eléctricas para el sistema nervioso.","example":"Presionar un dedo activa receptores que codifican la intensidad del estímulo."}};
for(const q of window.SCIENCE_BANK){if(SCIENCE_EDITORIAL_LOTE_1[q.id]){Object.assign(q,SCIENCE_EDITORIAL_LOTE_1[q.id]);q.review='revisado_conceptualmente';}}
/* Revisión individual: precisión conceptual, transferencia y alcance curricular 2027. */
{
const by=n=>window.SCIENCE_BANK.find(q=>q.id==='SCI-'+String(n).padStart(3,'0'));
by(3).question='Después de pasar por el retículo endoplasmático rugoso, una proteína de secreción debe clasificarse y empaquetarse para su destino. ¿Qué organelo realiza principalmente esa función?';
by(26).question='Se necesita retener arena insoluble en una barrera porosa y dejar pasar el agua. ¿Qué método de separación corresponde?';
by(64).question='Un glóbulo rojo se coloca en una solución hipertónica con solutos que no atraviesan su membrana. ¿Qué sucede inicialmente con el agua de su interior?';
by(73).question='Una proteína destinada a la secreción ingresa a la vía del retículo rugoso. ¿Qué estructuras continúan ensamblando su cadena de aminoácidos mientras se incorpora a esa vía?';
by(93).question='Un dispositivo eléctrico recibe 500 J de energía eléctrica y entrega 350 J de energía útil. ¿Cuál es su eficiencia energética?';by(93).area='Electricidad';
by(125).question='En el vacío, una onda electromagnética duplica su frecuencia. ¿Qué ocurre con su longitud de onda?';
by(125).steps=['La rapidez de propagación en el vacío permanece en c.','Aplica c=λf: si f se duplica, λ debe dividirse por dos.','No confundas frecuencia con amplitud: la relación usa frecuencia y longitud de onda.'];
by(158).question='Dos soluciones de azúcar tienen el mismo volumen final. Una contiene mayor masa de azúcar disuelta. ¿Qué afirmación es razonable?';
by(13).example='Una señal de radio en el vacío tiene f=100 MHz=10⁸ Hz. Con c=3×10⁸ m/s, su longitud es λ=c/f=3 m. No puede propagarse a 6 m/s en el vacío.';
by(38).area='Organismo y ambiente';
// These older items remain addressable for historical results, but are excluded from new PAES sessions.
const supplemental=new Set([43,75,76,77,83,85,86,92,94,96,106,116,118,119,121,122,123,129,130,141,144,148,151,152,154]);
for(const q of window.SCIENCE_BANK){const n=Number(q.id.slice(4));q.examEligible=!supplemental.has(n);q.curricularStatus=q.examEligible?'temario_demre_2027':'complementario_fuera_del_listado_explicito';q.review='revision_individual_asistida';q.reviewStatus='revision_individual_2026-10-14';}
const examples=`
1|En una célula renal que transporta activamente muchas sustancias, abundan mitocondrias. El transporte consume ATP; la respiración celular ayuda a reponerlo.
2|Una célula puede dejar entrar oxígeno por difusión y usar proteínas para transportar glucosa. La membrana selecciona rutas distintas; no es una pared impermeable.
3|En una célula que produce anticuerpos, el retículo rugoso participa en la síntesis y el Golgi clasifica las proteínas para enviarlas en vesículas. Son etapas diferentes de una misma ruta.
4|En la unión entre neurona motora y músculo se libera acetilcolina. Esta cruza la hendidura y se une a receptores; la vesícula permanece del lado emisor.
5|Al golpear el tendón bajo la rodilla se desencadena un reflejo de estiramiento. La respuesta rápida se organiza en un circuito nervioso sin esperar una decisión voluntaria.
7|Una célula somática de una especie con 20 cromosomas origina por mitosis dos células de 20. Duplicar ADN antes de dividir no deja a cada hija con 40 cromosomas.
8|Dos cromosomas homólogos pueden intercambiar segmentos en profase I. Así, un gameto puede reunir variantes que antes estaban en homólogos distintos, sin crear alelos por necesidad.
9|En un ambiente seco, plantas con una variante heredable que mejora supervivencia pueden dejar más semillas. La frecuencia de esa variante puede aumentar; cada planta no decide transformarse.
10|Si se marca el oxígeno del agua en un experimento fotosintético, la marca puede aparecer en el O₂ liberado. Marcar solo el carbono del CO₂ permite seguir otra parte del proceso.
11|Si productores fijan 10.000 unidades de energía y solo 10% pasa al nivel siguiente en un modelo, los herbívoros reciben 1.000 y el siguiente nivel 100. El 10% es un supuesto ilustrativo, no una constante universal.
12|Para investigar el efecto del riego, se cambian los mililitros de agua y se mide biomasa. Agua es independiente y biomasa dependiente; luz y suelo se mantienen comparables.
14|Una señal de radio de 50 MHz tiene longitud de 6 m en el vacío. Otra de 100 MHz tiene 3 m: duplicar la frecuencia reduce a la mitad la longitud, conservando c.
16|Una corredora recorre 150 m en 30 s. Su rapidez media es 150/30=5 m/s: divide distancia por tiempo y conserva las unidades.
18|Un ascensor que desciende con velocidad constante tiene fuerza neta cero. Su movimiento no exige una fuerza neta descendente; el peso y la fuerza de soporte se equilibran.
20|En una dorsal oceánica las placas se separan y pueden ocurrir sismos. En un borde de subducción también: se concentran en límites aunque la interacción sea distinta.
21|Al trabarse dos bloques de una falla, pueden deformarse y acumular energía elástica. Su ruptura libera energía en ondas; el cambio de tiempo atmosférico no explica ese mecanismo.
25|El agua con sal totalmente disuelta es una mezcla homogénea: se observa una fase. El agua con aceite separado presenta más de una fase y es heterogénea.
27|Si un líquido hierve antes que otro en una mezcla, una destilación permite enriquecer el vapor en el más volátil y luego condensarlo. Filtrar no separa dos líquidos miscibles.
28|El carbono-12 y el carbono-14 tienen ambos seis protones. Cambian los neutrones, pero Z=6 conserva la identidad del elemento.
29|En CH₃−CH₃, cada carbono forma tres enlaces con hidrógeno y uno con el otro carbono. Cada uno completa cuatro enlaces covalentes, no cuatro vecinos de carbono.
30|El propan-1-ol CH₃CH₂CH₂OH presenta −OH en un carbono saturado. Cambiar la longitud de la cadena no cambia que pertenezca a los alcoholes.
31|C₃H₈ solo contiene C y H, por lo que es hidrocarburo. C₃H₈O contiene oxígeno y no pertenece a esa categoría, aunque también tenga carbono e hidrógeno.
32|En CH₃−C≡CH, los dos últimos carbonos comparten un enlace triple. Cuenta las líneas del enlace; no confundas el triple enlace con tres carbonos unidos por enlaces simples.
33|Para N₂+H₂→NH₃, coloca 2 ante NH₃ y 3 ante H₂: N₂+3H₂→2NH₃. Así conservas dos N y seis H a ambos lados sin cambiar subíndices.
38|Para describir a estudiantes de toda una región, entrevistar solo a un curso deja fuera edades y localidades. Aumentar o diversificar la muestra responde al alcance de la conclusión.
39|Para medir la masa de una muestra usa una balanza y expresa el dato en gramos. Un cronómetro entrega tiempo; elegir instrumento depende de la magnitud.
40|Si una balanza entrega valores variables para una misma pesa, revisa nivelación, calibración y montaje antes de eliminar datos. Registrar el procedimiento permite interpretar la dispersión.
41|Para comparar disolución con y sin agitación, mantén igual masa de sólido, tamaño de partículas, temperatura y volumen. Aquí agitación es la variable que cambias.
42|Para estudiar la relación entre tiempo y distancia registra pares (t,d) y represéntalos con ambos ejes y unidades. Un promedio aislado pierde cómo se relacionan las variables.
43|En un cruce Bb×bb con dominancia completa, el primer progenitor aporta B o b y el segundo solo b: se esperan 1/2 Bb y 1/2 bb. Es un apoyo de genética fuera del listado explícito actual.
44|Si una célula necesita reponer una enzima, sus ribosomas ensamblan aminoácidos según el ARN. Bloquear esa maquinaria impide fabricar nueva enzima aunque otras moléculas sigan presentes.
45|Imagina dos homólogos con variantes AB y ab. Un intercambio entre cromátidas no hermanas puede producir combinaciones Ab y aB; esa recombinación cambia asociaciones, no el número de cromosomas.
46|Si una célula receptora tiene menos receptores disponibles, la misma cantidad de mensajero puede provocar menor respuesta. El cambio está en la recepción, no necesariamente en cuánto mensajero se libera.
47|Una luz de frecuencia 5×10¹⁴ Hz pasa a un medio donde viaja más lento. Su frecuencia permanece; λ=v/f disminuye con la rapidez. La fuente sigue marcando el ritmo de oscilación.
48|Un vehículo parte a 3 m/s y acelera a 2 m/s² durante 5 s. v=3+2×5=13 m/s; aquí debes incluir la velocidad inicial.
50|En una dorsal, dos placas se separan y se forma corteza oceánica: divergencia. En subducción convergen y una desciende; distinguir movimientos evita confundir límites.
52|El ácido propanoico CH₃CH₂COOH contiene −COOH. Un −OH dentro de ese grupo no lo convierte en alcohol: reconoce el conjunto carbonilo más hidroxilo.
54|Si tienes 0,4 mol de soluto en 1 L y diluyes hasta 2 L, conservas 0,4 mol y pasas de 0,4 M a 0,2 M. Cambia concentración, no cantidad de soluto.
55|Al comparar una célula de hoja con una muscular, ambas tienen membrana, pero la vegetal posee además pared celular. La pared sostiene y la membrana regula el intercambio.
56|En una laguna, el fitoplancton produce materia orgánica por fotosíntesis y alimenta al zooplancton. Es productor porque incorpora materia y energía al inicio de esa cadena.
58|Si pasan 6 coulomb en 3 segundos por un conductor, I=6/3=2 A. El volt mide diferencia de potencial; no intercambies esas unidades.
60|En C+O₂→CO₂ se conserva un carbono y dos oxígenos. La masa también se conserva aunque el producto tenga propiedades distintas de los reactivos.
61|Una hipótesis sobre germinación podría proponer que cambia su porcentaje a 15 y 25 °C con igual agua. Establece variables medibles y un resultado que podría refutarla.
62|Puedes investigar cómo cambia la posición de una imagen al mover un objeto frente a una lente. Distancias de objeto e imagen se miden; preferir una imagen por bonita es un juicio distinto.
63|Para un sólido dado, predice distinta masa máxima disuelta a 10 y 30 °C en 100 g de agua. Compruébalo sin cambiar también la cantidad de solvente.
64|Una célula vegetal en un medio externo hipertónico puede perder agua y disminuir su turgencia. La pared aporta soporte, pero no evita todo movimiento osmótico de agua.
65|En ratones con coloración heredable, un fondo oscuro puede favorecer a los más difíciles de ver para depredadores. Si dejan más crías, aumenta la frecuencia de ese rasgo; no se oscurecen por decisión.
66|Si disminuye el fitoplancton, puede bajar la energía incorporada a una red acuática. Los consumidores no compensan automáticamente produciendo su propio alimento.
67|Una señal realiza 30 ciclos en 5 s. Su frecuencia es 30/5=6 Hz y su período 1/6 s. Frecuencia cuenta ciclos por segundo; período mide tiempo por ciclo.
68|Una caja recibe 8 N a la derecha y 8 N a la izquierda. F_neta=0 y a=0; puede estar quieta o seguir con velocidad constante.
69|En una cadena de tres resistores en serie, abrir un cable interrumpe el único recorrido completo. Todos dejan de conducir, aunque la fuente conserve diferencia de potencial.
70|Cloro-35 y cloro-37 tienen 17 protones; sus neutrones son 18 y 20. Son isótopos porque cambia A, no la identidad dada por Z.
71|Si reaccionan 4 g y 6 g dentro de un recipiente sellado, el total sigue siendo 10 g. Que aparezca un gas no reduce la masa mientras no escape.
72|En CH₃CH₂CH₂OH hay un −OH unido a carbono saturado: es alcohol. En CH₃COOH el −OH integra un carboxilo y la función es otra.
73|Una célula que libera enzimas digestivas utiliza ribosomas asociados al retículo rugoso para continuar su síntesis. Más tarde, el Golgi modifica y dirige esas proteínas.
74|En una hoja, los pigmentos de los tilacoides absorben luz y alimentan reacciones luminosas. El ciclo de fijación de carbono se desarrolla en el estroma, otra región del cloroplasto.
75|Después de una comida, la insulina puede favorecer almacenamiento de glucosa como glucógeno. Eso ayuda a disminuir glucosa sanguínea; es un apoyo de fisiología, no un objetivo explícito del temario actual.
76|Si una proteína cambia su forma por calor, su sitio activo puede dejar de encajar con el sustrato. No se transforma en ADN: se altera la función de la misma proteína.
77|Con Bb×bb, cada descendiente tiene probabilidad 1/2 de ser bb. Calcula las combinaciones posibles de ese cruce en vez de memorizar 25% para todos los cruces.
78|En una especie 2n=18, una meiosis normal origina células n=9. No divides otra vez por dos después de la segunda división; allí se separan cromátidas.
79|Un cromosoma con variantes PQ y su homólogo pq pueden originar cromátidas Pq y pQ por intercambio. Se combinan alelos existentes; no se duplican todos los cromosomas.
80|Una mutación en una célula del hígado puede transmitirse a sus células hijas por mitosis, pero normalmente no pasa a un hijo por fecundación. Hay que distinguir linaje somático y germinal.
81|Al cambiar el ambiente, una variante heredable antes poco frecuente puede dar ventaja reproductiva. La selección actúa sobre diferencias; no anticipa qué mutación convendrá.
82|Si aumenta el zooplancton que comen ciertos peces, inicialmente hay más alimento disponible para ellos. No se garantiza un aumento proporcional de peces: otras condiciones también importan.
83|Un jardín con cinco especies y otro con tres difieren en riqueza. Contar cien plantas de una sola especie no equivale a tener cien especies.
84|Para estudiar el efecto de salinidad en plantas, usa igual luz, especie y riego, y cambia salinidad. No mantengas constante precisamente el factor que quieres comparar.
85|Al aumentar la respiración celular, crece la necesidad de intercambio de gases. Ventilar pulmones y producir ATP en células son procesos relacionados, pero distintos.
86|La memoria inmunológica permite reconocer con mayor rapidez un agente previamente encontrado. No implica que toda exposición posterior sea imposible ni protección universal contra otros agentes.
87|Las extremidades de ballenas y humanos comparten un patrón óseo heredado aunque tengan usos distintos. Esa homología aporta evidencia de ancestro común.
88|Si un tren recorre 300 m en 15 s, su rapidez media es 20 m/s. Cambiar las unidades exige convertirlas antes de comparar con km/h.
89|Para una masa de 5 kg con fuerza neta 15 N, a=15/5=3 m/s². El dato importante es la suma de fuerzas, no cualquiera de ellas aislada.
90|Con g≈10 m/s², una masa de 7 kg pesa unos 70 N. Los kilogramos expresan masa y los newtons expresan fuerza.
91|Si un móvil pasa de 12 a 4 m/s en 2 s en el mismo eje, a=(4−12)/2=−4 m/s². El signo representa el cambio de velocidad.
92|Elevar 2 kg a 3 m con g=10 y velocidad constante requiere trabajo de la fuerza elevadora 2×10×3=60 J. Es práctica complementaria de trabajo mecánico.
93|Una lámpara recibe 200 J y entrega 40 J de luz útil: eficiencia=40/200×100=20%. La energía restante no desaparece; se transforma en otras formas.
94|Un objeto que cae reduce su energía potencial gravitatoria. Sin roce, aumenta su energía cinética en la misma cantidad; esto es un apoyo de energía mecánica.
95|Una onda con período 0,05 s tiene frecuencia 1/0,05=20 Hz. No confundas el tiempo por ciclo con los ciclos por segundo.
96|Una cuerda que vibra 440 veces por segundo produce un tono más agudo que otra de 220 Hz. El volumen depende también de amplitud; es un ejemplo complementario de sonido.
97|Si la incidencia es 20° respecto de la normal, la reflexión también es 20°. Respecto del espejo, ese rayo forma 70°: importa desde dónde mides.
98|Un objeto bajo agua parece desplazado al observarlo oblicuamente desde el aire. La luz cambia de dirección al cruzar la superficie por refracción.
99|Una resistencia de 4 Ω conectada a 20 V conduce I=20/4=5 A. Multiplicar V por R no produce amperes.
100|Con resistores de 4 y 7 Ω en serie, R_eq=11 Ω. La misma corriente recorre ambos y las caídas de voltaje se suman.
101|Dos resistencias de 8 Ω en paralelo equivalen a 4 Ω. Añadir una segunda rama permite más corriente total para el mismo voltaje.
102|Si dos señales parten juntas y recorren aproximadamente la misma distancia, la que llega antes tiene mayor rapidez media. No infieras su energía solo por el orden de llegada.
103|Un átomo neutro de Z=8 tiene ocho protones y ocho electrones. Si pierde un electrón, sigue siendo oxígeno pero queda con carga +1.
104|Para dos átomos de Z=6 y A=12 y 13, N=A−Z da 6 y 7 neutrones. La identidad no cambia porque los protones siguen siendo seis.
105|Un átomo con nueve protones gana un electrón y queda con diez electrones: su carga neta es −1. Ganar y perder electrones tienen efectos opuestos.
106|Un catión +1 y un anión −1 se atraen eléctricamente en una red iónica. No son dos metales unidos por enlace metálico; es contenido complementario.
107|Un alcano acíclico de cuatro carbonos cumple CₙH₂ₙ₊₂: C₄H₁₀. La fórmula cambia si hay un ciclo o una insaturación.
108|CH₃CH₂CH₂OH es un alcohol porque tiene −OH en carbono saturado. CH₃OCH₃ es un éter: su oxígeno une dos grupos carbonados.
109|CH₃−CH=CH₂ es un alqueno de tres carbonos. La familia la determina el doble enlace; la longitud de la cadena aporta otra parte del nombre.
110|HCOOH tiene un grupo carboxilo y es ácido metanoico. El carbonilo y el −OH pertenecen al mismo carbono; reconocer solo uno de ellos sería incompleto.
111|Para Fe+O₂→Fe₂O₃, los coeficientes mínimos son 4,3,2: cuatro Fe y seis O en cada lado. No alteres las fórmulas de las sustancias.
112|Con masa 60 g y masa molar 30 g/mol, n=60/30=2 mol. El gramo se cancela y quedan moles.
113|Si disuelves 0,6 mol hasta 3 L de solución, M=0,6/3=0,2 mol/L. Usa volumen final de solución, no el del solvente antes de mezclar.
114|Diluir 50 mL de solución 4 M hasta 200 mL da M₂=4×50/200=1 M. La concentración se reduce a la cuarta parte porque el volumen final se cuadruplica.
115|Para 2A+B→productos, con 3 mol A y 2 mol B, A limita: alcanza para 1,5 veces la reacción, frente a 2 veces que permite B. Compara moles divididos por coeficientes.
116|En cromatografía, un componente que interactúa más con la fase estacionaria puede avanzar menos que otro. Es una técnica complementaria; el temario enumera otras separaciones básicas.
117|Si 2n=8, después de meiosis I cada célula tiene cuatro cromosomas todavía duplicados. En meiosis II se separan cromátidas hermanas sin volver a reducir a dos cromosomas.
118|El ARN mensajero puede compararse con una copia de instrucciones que llega al ribosoma. El ARN de transferencia trae aminoácidos; no cumple la misma función.
119|Un organismo Dd produce normalmente gametos D y d en proporciones esperadas iguales. No significa que toda muestra pequeña contenga exactamente la mitad de cada uno.
120|En un modelo, un herbívoro incorpora energía del alimento y usa parte al respirar y moverse. Esa energía se disipa como calor y no queda toda disponible para su depredador.
124|Un tren que avanza en línea recta sin cambiar velocidad tiene aceleración cero. Puede tener fuerzas de tracción y resistencia distintas de cero que se compensan.
126|Un dispositivo de 9 V consume 0,5 A: P=9×0,5=4,5 W. En 10 segundos utiliza 45 J de energía.
127|Resistencias de 6 y 12 Ω en paralelo dan 1/R=1/6+1/12=1/4, así que R=4 Ω. Debe ser menor que la rama de menor resistencia.
129|Un aparato eléctrico transforma 900 J en 30 s. Su potencia media es 900/30=30 W. La energía y la potencia no son la misma magnitud.
130|La luz de una fuente que se aleja puede observarse con menor frecuencia y mayor longitud de onda. Ese corrimiento cualitativo también es Doppler, ahora electromagnético.
131|En N₂+3H₂→2NH₃, 6 mol H₂ con N₂ suficiente producen 4 mol NH₃. Multiplica 6 por la relación 2/3, no por el coeficiente aislado.
132|Un átomo con Z=13 y A=27 tiene N=27−13=14 neutrones. La suma A+Z contaría protones dos veces.
133|CH₃−CH₂−CH₂−CH₃ tiene cuatro carbonos y enlaces simples: butano. El prefijo cambia con la longitud; la familia sigue siendo alcano.
134|Si reaccionan completamente 6 g y 9 g sin perder materia, los productos suman 15 g. Que cambien sus propiedades no crea masa.
135|CH₃CH₂CHO posee carbonilo terminal y es propanal. CH₃COCH₃ lo tiene entre carbonos y es una cetona.
136|En la distribución simplificada 2,8,7 hay siete electrones en el nivel externo. El total es 17; no confundas total con electrones de valencia.
137|Al disolver 0,9 mol hasta 1,5 L, M=0,9/1,5=0,6 mol/L. Un volumen menor que el numerador no es requisito: revisa la razón con unidades.
139|Una célula animal puede tener mitocondrias y núcleo, pero no cloroplastos ni pared vegetal. Usa la combinación de estructuras para clasificarla, no solo una estructura compartida.
140|Al reparar un tejido, células somáticas se dividen por mitosis conservando normalmente su dotación cromosómica. No se forman gametos haploides en esa reparación.
142|Menos algas disponibles pueden reducir el alimento del zooplancton herbívoro. La red conecta poblaciones, aunque el resultado final depende de otras fuentes de alimento.
143|Dos hermanos pueden heredar combinaciones distintas de variantes genéticas. Parecerse no implica ser genéticamente idénticos ni que todo rasgo dependa solo de genes.
145|Para comparar el efecto del abono, mide masa inicial y final de las plantas y calcula el aumento. La masa final aislada podría reflejar diferencias que ya existían.
146|Un bus recorre 72 km en 2 horas, incluyendo detenciones. Su rapidez media del viaje es 36 km/h, aunque su rapidez instantánea varíe.
147|Una caja que desliza sobre una mesa recibe roce cinético opuesto al deslizamiento relativo. Si no hay otra fuerza horizontal, disminuye su rapidez.
149|En un circuito en paralelo, abrir solo una rama no necesariamente apaga las otras. Comprueba qué trayectorias completas siguen conectadas a la fuente.
150|Si varios aparatos elevan demasiado la corriente de una instalación, una protección de sobrecorriente puede abrirla. Un interruptor común requiere accionamiento y no cumple la misma función automática.
153|Un ion con 12 protones y 10 electrones tiene carga +2. Cuenta cargas positivas y negativas; los neutrones no aportan carga neta.
155|Una mezcla inicial de 7 g y 11 g que reacciona completamente en un sistema cerrado produce 18 g totales. El número de sustancias puede cambiar sin variar la masa total.
156|C₆H₆ es un hidrocarburo aromático: contiene solo C y H aunque no sea un alcano. La categoría hidrocarburo es más amplia que enlaces simples.
157|Si disuelves 5 g de soluto en 45 g de agua sin pérdidas, la solución pesa 50 g. Su porcentaje m/m es 5/50×100=10%, no 5/45.
158|Dos soluciones con volumen final de 500 mL contienen 10 y 25 g de sal. Sus concentraciones son 2 y 5 % m/v: más masa en igual volumen implica mayor concentración.
159|Una neurona sensorial puede conducir señales desde un receptor hacia el sistema nervioso central por su axón. No confundas dirección funcional con una simple distancia al cuerpo celular.
160|Al comparar axones del mismo diámetro, la mielina permite que los potenciales se regeneren entre nodos separados. El impulso no «salta» por fuera del axón: así se describe la conducción saltatoria.
161|Si disminuye la entrada rápida de Na⁺, puede no alcanzarse una despolarización suficiente para propagar el potencial. La salida posterior de K⁺ cumple otro papel.
162|El reflejo rotuliano activa un circuito medular al estirar el músculo. La pierna responde sin que primero decidas moverla voluntariamente.
163|Una terminal que recibe el potencial, pero no permite entrada de Ca²⁺, puede liberar menos mensajero. La señal eléctrica y la exocitosis son pasos conectados, no equivalentes.
164|Para comparar dos condiciones de descanso en una investigación, alterna el orden y mantén horarios y tareas comparables. Así reduces efectos de práctica y diferencias de horario sin afirmar causalidad absoluta.
165|Si un grupo presenta menor coordinación después de alcohol, eso es compatible con alteración nerviosa. No identifica por sí solo un receptor específico: la conclusión debe respetar lo medido.
166|Un receptor de luz en la retina convierte energía luminosa en cambios eléctricos. Es otro ejemplo de transducción: cambia el estímulo, se conserva la idea de convertirlo en señal nerviosa.
`.trim().split('\n');
for(const line of examples){const [n,example]=line.split('|');by(+n).example=example;}
// Concepts are grouped more narrowly than an entire discipline and shared across transfer items.
const groups={
'Organelos y función celular':[1,2,3,44,55,64,73,74,118,139],
'Sistema nervioso':[4,5,46,159,160,161,162,163,164,165,166],
'Reproducción y prevención':[6],
'División celular':[7,8,45,78,79,80,117,140],
'Selección y evidencia evolutiva':[9,65,81,87,143],
'Fotosíntesis y energía':[10,11,56,66,82,120,142],
'Variables y evidencia experimental':[12,37,38,40,41,42,61,62,63,84,122,145],
'Ondas electromagnéticas':[13,14,15,47,62,67,95,97,98,125],
'Movimiento y fuerzas':[16,17,18,39,48,57,68,88,89,90,91,124,146,147],
'Tectónica y geosfera':[19,20,21,50,102,128],
'Circuitos y energía eléctrica':[22,23,24,49,58,69,93,99,100,101,126,127,149,150],
'Materia y modelos atómicos':[25,26,27,28,51,59,70,103,104,105,132,136,153],
'Carbono y grupos funcionales':[29,30,31,32,52,72,107,108,109,110,133,135,138,156],
'Balance y estequiometría':[33,34,53,60,71,111,112,115,131,134,155],
'Soluciones y concentración':[35,36,54,113,114,137,157,158]
};
for(const [concept,ids]of Object.entries(groups))for(const n of ids)by(n).concept=concept;
for(const q of window.SCIENCE_BANK)q.concept ||= q.subject+' · '+q.area;
}

/* Nuevas preguntas sobre objetivos faltantes del temario y reemplazos curriculares. */
window.SCIENCE_BANK.push(...[
 {
  "id": "SCI-167",
  "subject": "Biología",
  "module": "MC",
  "area": "Procesos y funciones biológicas",
  "concept": "Reproducción y prevención",
  "question": "En una fecundación humana normal se unen dos gametos haploides. ¿Qué ocurre con la dotación cromosómica del cigoto?",
  "options": [
   "Se forman cuatro células con la mitad de cromosomas",
   "Se restablece la dotación diploide",
   "Permanece haploide",
   "Cada gameto se divide por mitosis antes de fusionarse"
  ],
  "answer": 1,
  "explanations": [
   "Eso confunde fecundación con los productos de la meiosis.",
   "¡Cachaste! Cada gameto aporta una dotación n; al reunirse, el cigoto contiene 2n.",
   "El cigoto reúne dos dotaciones haploides, no una.",
   "La fecundación es la unión de gametos; esa mitosis previa no define el proceso."
  ],
  "steps": [
   "Distingue la reducción meiótica de la unión de gametos.",
   "Suma las dotaciones: n+n=2n.",
   "Cada gameto aporta una dotación n; al reunirse, el cigoto contiene 2n."
  ],
  "easy": "Cada gameto aporta una dotación n; al reunirse, el cigoto contiene 2n.",
  "example": "En una especie con n=10, cada gameto aporta diez cromosomas y el cigoto normalmente tiene veinte. La regla se aplica sin memorizar el número humano.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-168",
  "subject": "Biología",
  "module": "MC",
  "area": "Procesos y funciones biológicas",
  "concept": "Reproducción y prevención",
  "question": "¿Qué evento caracteriza a la ovulación dentro del ciclo ovárico?",
  "options": [
   "La liberación de un ovocito desde el ovario",
   "La descamación del endometrio",
   "La implantación del embrión en el útero",
   "La unión de los núcleos de los gametos"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! Ovulación es la liberación del ovocito desde el folículo; no debe confundirse con menstruación ni fecundación.",
   "La descamación corresponde a menstruación, un evento uterino.",
   "La implantación ocurre después de fecundación y no define ovulación.",
   "La unión de gametos corresponde a fecundación."
  ],
  "steps": [
   "Identifica el órgano: el ciclo ovárico ocurre en el ovario.",
   "Relaciona la salida del ovocito con la fase ovulatoria.",
   "Ovulación es la liberación del ovocito desde el folículo; no debe confundirse con menstruación ni fecundación."
  ],
  "easy": "Ovulación es la liberación del ovocito desde el folículo; no debe confundirse con menstruación ni fecundación.",
  "example": "Si un esquema muestra descamación del revestimiento uterino, representa menstruación. Reconocer órgano y cambio permite distinguirlo de ovulación.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-169",
  "subject": "Biología",
  "module": "MC",
  "area": "Organización, estructura y actividad celular",
  "concept": "Organelos y función celular",
  "question": "Un enterocito tiene numerosas microvellosidades en su superficie. ¿Qué relación estructura-función explica esta característica?",
  "options": [
   "Reducen la superficie de contacto intestinal",
   "Sustituyen a todos los ribosomas",
   "Almacenan la totalidad del ADN celular",
   "Aumentan la superficie disponible para absorción"
  ],
  "answer": 3,
  "explanations": [
   "Los pliegues aumentan, no disminuyen, superficie.",
   "Son especializaciones de superficie, no maquinaria de síntesis proteica.",
   "El ADN eucarionte está principalmente en el núcleo; no en microvellosidades.",
   "¡Cachaste! Las microvellosidades incrementan superficie de membrana, favoreciendo absorción de nutrientes."
  ],
  "steps": [
   "Reconoce que microvellosidades son prolongaciones de superficie.",
   "Más superficie permite mayor contacto con el contenido intestinal.",
   "Las microvellosidades incrementan superficie de membrana, favoreciendo absorción de nutrientes."
  ],
  "easy": "Las microvellosidades incrementan superficie de membrana, favoreciendo absorción de nutrientes.",
  "example": "Al plegar una lámina puedes disponer más superficie dentro de un volumen pequeño. La analogía ayuda a entender el aumento de contacto, sin confundir la lámina con una célula.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-170",
  "subject": "Biología",
  "module": "MC",
  "area": "Herencia y evolución",
  "concept": "División celular",
  "question": "Una célula detecta ADN dañado antes de entrar en fase S. ¿Qué efecto protector tiene detener el ciclo en ese punto?",
  "options": [
   "Convertir la célula somática en gameto",
   "Duplicar primero el daño para facilitar su corrección",
   "Evitar replicar el daño antes de repararlo",
   "Separar cromátidas antes de replicar ADN"
  ],
  "answer": 2,
  "explanations": [
   "Detener el ciclo no transforma el tipo de célula.",
   "El control busca impedir progresión con daño, no multiplicarlo.",
   "¡Cachaste! El punto de control G1–S puede impedir que se replique ADN dañado, dando oportunidad a reparación o a otras respuestas celulares.",
   "La separación ocurre durante división, no es la función del control G1–S."
  ],
  "steps": [
   "Ubica S como la fase de replicación del ADN.",
   "Detenerse antes de S limita transmitir copias dañadas.",
   "El punto de control G1–S puede impedir que se replique ADN dañado, dando oportunidad a reparación o a otras respuestas celulares."
  ],
  "easy": "El punto de control G1–S puede impedir que se replique ADN dañado, dando oportunidad a reparación o a otras respuestas celulares.",
  "example": "El control de metafase evita iniciar separación si los cromosomas no están unidos correctamente al huso. Distintos controles protegen etapas distintas.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-171",
  "subject": "Física",
  "module": "MC",
  "area": "Ondas",
  "concept": "Ondas electromagnéticas",
  "question": "¿Qué radiación tiene mayor frecuencia que la luz visible?",
  "options": [
   "Infrarrojo",
   "Ultravioleta",
   "Ondas de radio",
   "Microondas"
  ],
  "answer": 1,
  "explanations": [
   "El infrarrojo tiene menor frecuencia y mayor longitud que el visible.",
   "¡Cachaste! El ultravioleta está a frecuencias superiores al visible; radio, microondas e infrarrojo quedan por debajo.",
   "Las ondas de radio tienen menor frecuencia que la luz visible.",
   "Las microondas están por debajo del visible en frecuencia."
  ],
  "steps": [
   "Ordena el espectro de menor a mayor frecuencia.",
   "Relaciona mayor frecuencia con menor longitud en el vacío.",
   "El ultravioleta está a frecuencias superiores al visible; radio, microondas e infrarrojo quedan por debajo."
  ],
  "easy": "El ultravioleta está a frecuencias superiores al visible; radio, microondas e infrarrojo quedan por debajo.",
  "example": "Los rayos X tienen mayor frecuencia que el ultravioleta. Todas estas ondas viajan a c en el vacío; mayor frecuencia no significa mayor rapidez.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-172",
  "subject": "Física",
  "module": "MC",
  "area": "Mecánica",
  "concept": "Movimiento y fuerzas",
  "question": "Un resorte ideal de constante 200 N/m se estira 0,03 m dentro de su límite elástico. ¿Cuál es la magnitud de su fuerza elástica?",
  "options": [
   "6 N",
   "0,00015 N",
   "60 N",
   "200,03 N"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! La ley de Hooke da F=kx=200×0,03=6 N; la fuerza se opone a la deformación.",
   "Dividir extensión por constante no aplica F=kx.",
   "Ese valor corresponde a una extensión diez veces mayor.",
   "Sumar constante y extensión mezcla unidades diferentes."
  ],
  "steps": [
   "Usa extensión en metros, no longitud total del resorte.",
   "Multiplica k por x: N/m por m deja N.",
   "La ley de Hooke da F=kx=200×0,03=6 N; la fuerza se opone a la deformación."
  ],
  "easy": "La ley de Hooke da F=kx=200×0,03=6 N; la fuerza se opone a la deformación.",
  "example": "Si k=50 N/m y x=0,10 m, la fuerza elástica tiene magnitud 5 N. Duplicar la extensión duplica esa magnitud dentro del régimen ideal.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-173",
  "subject": "Física",
  "module": "MC",
  "area": "Energía – Tierra",
  "concept": "Tectónica y geosfera",
  "question": "¿Qué describe mejor a la litosfera en el modelo físico de la Tierra?",
  "options": [
   "Toda la Tierra situada bajo la corteza",
   "El núcleo externo completamente líquido",
   "Solo el agua de océanos y continentes",
   "Una capa rígida que incluye corteza y parte superior del manto"
  ],
  "answer": 3,
  "explanations": [
   "Eso incluiría regiones con propiedades distintas y no define litosfera.",
   "El núcleo externo es una región diferente, profunda y líquida.",
   "El conjunto de aguas corresponde a hidrosfera.",
   "¡Cachaste! La litosfera combina corteza y manto superior rígido y está fragmentada en placas."
  ],
  "steps": [
   "Distingue capas por composición y por comportamiento físico.",
   "La corteza sola no equivale a toda la placa litosférica.",
   "La litosfera combina corteza y manto superior rígido y está fragmentada en placas."
  ],
  "easy": "La litosfera combina corteza y manto superior rígido y está fragmentada en placas.",
  "example": "Una placa oceánica no es solo sedimento del fondo: incluye corteza oceánica y una parte rígida del manto. La definición es mecánica.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-174",
  "subject": "Física",
  "module": "MC",
  "area": "Electricidad",
  "concept": "Circuitos y energía eléctrica",
  "question": "En una instalación doméstica, ¿qué ventaja tiene conectar aparatos en paralelo?",
  "options": [
   "La corriente de la fuente se vuelve siempre cero",
   "El voltaje se divide por igual entre todos los aparatos",
   "Cada rama recibe el voltaje de la fuente y puede funcionar independientemente",
   "Toda la corriente debe pasar por cada aparato sucesivamente"
  ],
  "answer": 2,
  "explanations": [
   "Las ramas cerradas conducen corriente; no desaparece por estar en paralelo.",
   "Las ramas comparten voltaje; lo que se distribuye entre ellas es corriente.",
   "¡Cachaste! En paralelo las ramas están entre los mismos puntos de potencial; abrir una no necesariamente interrumpe las otras.",
   "Eso describe conexión en serie."
  ],
  "steps": [
   "Identifica terminales comunes de las ramas.",
   "Distingue voltaje compartido de corriente total sumada.",
   "En paralelo las ramas están entre los mismos puntos de potencial; abrir una no necesariamente interrumpe las otras."
  ],
  "easy": "En paralelo las ramas están entre los mismos puntos de potencial; abrir una no necesariamente interrumpe las otras.",
  "example": "Dos resistencias conectadas a una fuente de 12 V en paralelo tienen 12 V cada una. Si abres una rama, la otra puede seguir conduciendo.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-175",
  "subject": "Química",
  "module": "MC",
  "area": "Estructura atómica",
  "concept": "Materia y modelos atómicos",
  "question": "La mayoría de partículas alfa atraviesa una lámina, pero unas pocas se desvían mucho. ¿Qué rasgo del modelo de Rutherford explica las grandes desviaciones?",
  "options": [
   "Átomos macizos indivisibles que llenan todo el volumen",
   "Un núcleo pequeño, denso y con carga positiva",
   "Carga positiva distribuida uniformemente en todo el átomo",
   "Electrones sin ninguna carga eléctrica"
  ],
  "answer": 1,
  "explanations": [
   "Ese modelo no explica que la mayoría atraviese la lámina.",
   "¡Cachaste! Las grandes desviaciones son compatibles con encuentros cercanos a una región pequeña, masiva y positiva: el núcleo.",
   "La carga difusa de Thomson no explica bien esas desviaciones grandes.",
   "Los electrones tienen carga negativa; esa suposición no explica el fenómeno."
  ],
  "steps": [
   "Separa la observación frecuente de las desviaciones excepcionales.",
   "La concentración de carga y masa explica estas últimas.",
   "Las grandes desviaciones son compatibles con encuentros cercanos a una región pequeña, masiva y positiva: el núcleo."
  ],
  "easy": "Las grandes desviaciones son compatibles con encuentros cercanos a una región pequeña, masiva y positiva: el núcleo.",
  "example": "Que muchas partículas atraviesen casi sin desviación indica gran espacio relativamente vacío; que unas pocas reboten aporta otra evidencia del mismo modelo.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-176",
  "subject": "Química",
  "module": "MC",
  "area": "Estructura atómica",
  "concept": "Materia y modelos atómicos",
  "question": "Se separará una mezcla seca de arena fina y piedras usando una malla. ¿Qué procedimiento corresponde?",
  "options": [
   "Tamizado",
   "Destilación",
   "Decantación",
   "Disolución"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! El tamizado separa sólidos según tamaño de partículas mediante una malla.",
   "Separa por volatilidad mediante vaporización y condensación, no por malla.",
   "Usa separación de fases y diferencias de densidad; no describe la malla.",
   "Disolver no es el procedimiento descrito para clasificar sólidos por tamaño."
  ],
  "steps": [
   "Identifica dos sólidos con tamaños diferentes.",
   "La malla deja pasar partículas pequeñas y retiene mayores.",
   "El tamizado separa sólidos según tamaño de partículas mediante una malla."
  ],
  "easy": "El tamizado separa sólidos según tamaño de partículas mediante una malla.",
  "example": "Una malla para harina retiene grumos más grandes que sus aberturas. El tamaño, no la temperatura de ebullición, determina la separación.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-177",
  "subject": "Química",
  "module": "MC",
  "area": "Química orgánica",
  "concept": "Carbono y grupos funcionales",
  "question": "En el metano CH₄, los enlaces del carbono apuntan hacia los vértices de un tetraedro. ¿Qué hibridación se asocia con esa geometría ideal?",
  "options": [
   "sp",
   "sp²",
   "Cuatro orbitales p sin hibridación",
   "sp³"
  ],
  "answer": 3,
  "explanations": [
   "sp se asocia con geometría lineal, no tetraédrica.",
   "sp² se asocia con geometría trigonal plana.",
   "La descripción tetraédrica equivalente del modelo usa cuatro orbitales sp³.",
   "¡Cachaste! Cuatro enlaces simples equivalentes alrededor del carbono del metano se describen mediante hibridación sp³."
  ],
  "steps": [
   "Relaciona cuatro direcciones de enlace con geometría tetraédrica.",
   "El ángulo ideal es cercano a 109,5°, no 180°.",
   "Cuatro enlaces simples equivalentes alrededor del carbono del metano se describen mediante hibridación sp³."
  ],
  "easy": "Cuatro enlaces simples equivalentes alrededor del carbono del metano se describen mediante hibridación sp³.",
  "example": "En eteno, cada carbono tiene geometría trigonal plana y se asocia con sp². Cambiar el tipo de enlace cambia la descripción geométrica.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-178",
  "subject": "Química",
  "module": "MC",
  "area": "Reacciones químicas y estequiometría",
  "concept": "Soluciones y concentración",
  "question": "Se disuelven 5 g de soluto en 95 g de agua sin pérdidas. ¿Cuál es el porcentaje masa/masa?",
  "options": [
   "95 % m/m",
   "0,05 % m/m",
   "5 % m/m",
   "5,26 % m/m"
  ],
  "answer": 2,
  "explanations": [
   "95% es la fracción de solvente, no de soluto.",
   "0,05 es la fracción decimal; debes multiplicarla por 100 para porcentaje.",
   "¡Cachaste! La solución pesa 100 g y %m/m=(5/100)×100=5%.",
   "Dividiste por solvente, 95 g, en vez de solución, 100 g."
  ],
  "steps": [
   "Suma soluto y solvente para obtener masa de solución.",
   "Divide masa del soluto por masa total y convierte a porcentaje.",
   "La solución pesa 100 g y %m/m=(5/100)×100=5%."
  ],
  "easy": "La solución pesa 100 g y %m/m=(5/100)×100=5%.",
  "example": "Con 8 g de sal y 72 g de agua, el total es 80 g. El porcentaje es 8/80×100=10% m/m.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-179",
  "subject": "Biología",
  "module": "ME",
  "area": "Procesos y funciones biológicas",
  "concept": "Reproducción y prevención",
  "question": "¿Qué diferencia correcta hay entre un método hormonal anticonceptivo y un preservativo?",
  "options": [
   "El preservativo detiene permanentemente la ovulación",
   "El preservativo es barrera y puede reducir riesgo de ITS; el hormonal no cumple esa función de barrera",
   "Ambos crean una barrera física del mismo tipo",
   "El hormonal impide la transmisión de toda ITS"
  ],
  "answer": 1,
  "explanations": [
   "Su función es barrera, no suspensión permanente del ciclo.",
   "¡Cachaste! Evitar embarazo y reducir transmisión de ITS son objetivos diferentes; no todos los métodos anticonceptivos cumplen ambos.",
   "Un hormonal actúa sobre procesos fisiológicos, no forma esa barrera.",
   "Anticoncepción hormonal no equivale a protección frente a ITS."
  ],
  "steps": [
   "Identifica mecanismo físico frente a hormonal.",
   "No conviertas reducción de riesgo en protección absoluta.",
   "Evitar embarazo y reducir transmisión de ITS son objetivos diferentes; no todos los métodos anticonceptivos cumplen ambos."
  ],
  "easy": "Evitar embarazo y reducir transmisión de ITS son objetivos diferentes; no todos los métodos anticonceptivos cumplen ambos.",
  "example": "Un método del calendario estima períodos fértiles, pero no bloquea intercambio de fluidos. Conocer su mecanismo evita atribuirle protección frente a ITS.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-180",
  "subject": "Biología",
  "module": "ME",
  "area": "Procesos y funciones biológicas",
  "concept": "Reproducción y prevención",
  "question": "¿Cuál pareja asocia correctamente una ITS con el tipo de agente que la produce?",
  "options": [
   "Gonorrea: bacteria",
   "VIH: bacteria",
   "Herpes genital: protozoo",
   "Clamidia: hongo"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! La gonorrea es bacteriana; VIH y herpes son virales, y clamidia también es bacteriana.",
   "VIH es un virus, no una bacteria.",
   "El herpes genital lo producen virus del herpes.",
   "La clamidia es causada por una bacteria, no un hongo."
  ],
  "steps": [
   "Distingue el nombre de la infección del tipo de agente.",
   "No supongas que todas las ITS tienen el mismo agente ni el mismo manejo.",
   "La gonorrea es bacteriana; VIH y herpes son virales, y clamidia también es bacteriana."
  ],
  "easy": "La gonorrea es bacteriana; VIH y herpes son virales, y clamidia también es bacteriana.",
  "example": "Clasificar influenza como viral y tuberculosis como bacteriana muestra la misma distinción entre tipos de agente en otro contexto; no sirve atribuir a todas las infecciones una causa única.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-181",
  "subject": "Biología",
  "module": "ME",
  "area": "Herencia y evolución",
  "concept": "División celular",
  "question": "En un cultivo, una sustancia impide que las cromátidas hermanas se separen en mitosis. ¿Qué etapa se afecta directamente?",
  "options": [
   "Fase S",
   "G1",
   "Profase I meiótica",
   "Anafase"
  ],
  "answer": 3,
  "explanations": [
   "En S se replica ADN; no se separan cromátidas hacia polos.",
   "G1 precede a replicación y no es la separación mitótica.",
   "Es una etapa de meiosis, no la anafase mitótica descrita.",
   "¡Cachaste! En anafase mitótica las cromátidas hermanas se separan hacia polos opuestos."
  ],
  "steps": [
   "Identifica que el proceso es mitosis.",
   "Relaciona la separación de hermanas con anafase.",
   "En anafase mitótica las cromátidas hermanas se separan hacia polos opuestos."
  ],
  "easy": "En anafase mitótica las cromátidas hermanas se separan hacia polos opuestos.",
  "example": "En anafase I meiótica se separan homólogos; en anafase II se separan cromátidas. Precisar qué se separa distingue las divisiones.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-182",
  "subject": "Biología",
  "module": "ME",
  "area": "Herencia y evolución",
  "concept": "Manipulación genética",
  "question": "Se introduce en bacterias un gen humano para obtener una proteína utilizada como fármaco. ¿Qué aplicación se ejemplifica?",
  "options": [
   "Transformación de todas las bacterias en células humanas",
   "Cruce sexual entre bacteria y ser humano",
   "Producción de una proteína recombinante",
   "Selección natural por aumento espontáneo del tamaño bacteriano"
  ],
  "answer": 2,
  "explanations": [
   "Expresar un gen no cambia a la bacteria en un organismo humano.",
   "Introducir un gen no es un cruce sexual entre ambas especies.",
   "¡Cachaste! La ingeniería genética permite que un organismo produzca una proteína codificada por ADN introducido.",
   "Aquí hay intervención dirigida sobre ADN, no solo selección ambiental."
  ],
  "steps": [
   "Reconoce el traslado deliberado de información genética.",
   "La proteína producida puede purificarse para una aplicación.",
   "La ingeniería genética permite que un organismo produzca una proteína codificada por ADN introducido."
  ],
  "easy": "La ingeniería genética permite que un organismo produzca una proteína codificada por ADN introducido.",
  "example": "Modificar microorganismos para producir enzimas usadas en detergentes es otra aplicación. La finalidad cambia, pero se conserva el uso de genes para obtener un producto.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-183",
  "subject": "Biología",
  "module": "ME",
  "area": "Herencia y evolución",
  "concept": "Selección y evidencia evolutiva",
  "question": "Al comparar aleta de ballena y brazo humano se observa un patrón óseo semejante pese a funciones distintas. ¿Qué concepto describe esa evidencia?",
  "options": [
   "Prueba de que ambas especies son idénticas",
   "Estructuras homólogas",
   "Estructuras análogas definidas solo por función idéntica",
   "Órganos sin relación evolutiva por tener usos distintos"
  ],
  "answer": 1,
  "explanations": [
   "Compartir origen de estructuras no equivale a ser la misma especie.",
   "¡Cachaste! La homología relaciona estructuras por origen evolutivo compartido, aunque sus funciones difieran.",
   "La función no es idéntica aquí y el patrón heredado apunta a homología.",
   "Una función distinta no elimina el origen común."
  ],
  "steps": [
   "Compara el plan estructural, no solo la función actual.",
   "La modificación de un patrón heredado apoya ancestro común.",
   "La homología relaciona estructuras por origen evolutivo compartido, aunque sus funciones difieran."
  ],
  "easy": "La homología relaciona estructuras por origen evolutivo compartido, aunque sus funciones difieran.",
  "example": "Las alas de insectos y aves permiten volar, pero sus orígenes estructurales difieren. La función similar por sí sola no prueba homología.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-184",
  "subject": "Biología",
  "module": "ME",
  "area": "Organismo y ambiente",
  "concept": "Fotosíntesis y energía",
  "question": "¿Qué relación entre fotosíntesis y respiración celular contribuye al ciclo del carbono?",
  "options": [
   "La fotosíntesis fija CO₂ y la respiración puede liberarlo",
   "Ambos procesos crean átomos nuevos de carbono",
   "La respiración solo ocurre en animales",
   "La fotosíntesis destruye todo el carbono fijado"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! La fijación incorpora carbono inorgánico a moléculas orgánicas; su oxidación en respiración puede devolver CO₂ al medio.",
   "Reorganizan materia; no crean átomos de carbono.",
   "Plantas y otros organismos también realizan respiración celular.",
   "El carbono se incorpora a moléculas orgánicas, no desaparece."
  ],
  "steps": [
   "Sigue el carbono entre moléculas, no solo la energía.",
   "Distingue reciclaje de materia del flujo y disipación de energía.",
   "La fijación incorpora carbono inorgánico a moléculas orgánicas; su oxidación en respiración puede devolver CO₂ al medio."
  ],
  "easy": "La fijación incorpora carbono inorgánico a moléculas orgánicas; su oxidación en respiración puede devolver CO₂ al medio.",
  "example": "Una planta puede captar CO₂ con luz y también liberar CO₂ al respirar. Ser autótrofa no significa carecer de respiración celular.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-185",
  "subject": "Física",
  "module": "ME",
  "area": "Ondas",
  "concept": "Ondas electromagnéticas",
  "question": "Una lente convergente recibe rayos paralelos a su eje principal. En el modelo de lente delgada ideal, ¿qué sucede después de atravesarla?",
  "options": [
   "Se reflejan todos hacia la fuente",
   "Se dispersan como si provinieran del foco del mismo lado",
   "Todos conservan la misma dirección sin desviarse",
   "Convergen hacia el foco del otro lado"
  ],
  "answer": 3,
  "explanations": [
   "Una lente transmite y refracta; no equivale a un espejo.",
   "Ese comportamiento corresponde a una lente divergente.",
   "Excepto casos particulares como el rayo central, la lente desvía los rayos.",
   "¡Cachaste! Una lente convergente reúne rayos incidentes paralelos hacia su foco imagen."
  ],
  "steps": [
   "Identifica lente convergente y rayos paralelos.",
   "Sigue refracción en la lente hasta el foco.",
   "Una lente convergente reúne rayos incidentes paralelos hacia su foco imagen."
  ],
  "easy": "Una lente convergente reúne rayos incidentes paralelos hacia su foco imagen.",
  "example": "Una lente divergente hace que rayos paralelos se separen como si provinieran de un foco del lado de entrada. Comparar ambos casos aclara el tipo de lente.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-186",
  "subject": "Física",
  "module": "ME",
  "area": "Ondas",
  "concept": "Ondas electromagnéticas",
  "question": "Una fuente luminosa se aleja del observador. Considerando solo el efecto Doppler, ¿qué cambio cualitativo se espera?",
  "options": [
   "Mayor frecuencia y mayor longitud a rapidez fija",
   "La luz deja de propagarse en el vacío",
   "Menor frecuencia observada y mayor longitud de onda",
   "Mayor frecuencia y menor longitud de onda"
  ],
  "answer": 2,
  "explanations": [
   "Con c fija, frecuencia y longitud no crecen juntas.",
   "El movimiento de la fuente no impide la propagación electromagnética.",
   "¡Cachaste! El alejamiento produce corrimiento hacia longitudes mayores; como c=λf, la frecuencia observada disminuye.",
   "Ese cambio corresponde al acercamiento, bajo el efecto considerado."
  ],
  "steps": [
   "Distingue frecuencia emitida de observada.",
   "Relaciona el alejamiento con corrimiento al rojo.",
   "El alejamiento produce corrimiento hacia longitudes mayores; como c=λf, la frecuencia observada disminuye."
  ],
  "easy": "El alejamiento produce corrimiento hacia longitudes mayores; como c=λf, la frecuencia observada disminuye.",
  "example": "Una fuente que se acerca presenta el cambio contrario: frecuencia mayor y longitud menor, llamado corrimiento al azul. La rapidez de la luz en el vacío sigue siendo c.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-187",
  "subject": "Física",
  "module": "ME",
  "area": "Mecánica",
  "concept": "Movimiento y fuerzas",
  "question": "Un tren avanza a 20 m/s respecto del suelo. Una persona camina dentro a 2 m/s hacia la parte delantera. Según relatividad de Galileo, ¿cuál es su velocidad respecto del suelo?",
  "options": [
   "2 m/s",
   "22 m/s",
   "18 m/s",
   "10 m/s"
  ],
  "answer": 1,
  "explanations": [
   "Es la velocidad respecto del tren, no respecto del suelo.",
   "¡Cachaste! En el mismo sentido, las velocidades se suman: v_persona/suelo=20+2=22 m/s.",
   "Ese valor corresponde a caminar hacia atrás respecto del tren.",
   "Dividir las velocidades no cambia correctamente de sistema de referencia."
  ],
  "steps": [
   "Elige el suelo como referencia final.",
   "Suma velocidades colineales con sus signos.",
   "En el mismo sentido, las velocidades se suman: v_persona/suelo=20+2=22 m/s."
  ],
  "easy": "En el mismo sentido, las velocidades se suman: v_persona/suelo=20+2=22 m/s.",
  "example": "Si un bote avanza 4 m/s respecto del agua y la corriente lleva 1 m/s en el mismo sentido, avanza 5 m/s respecto de la orilla.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-188",
  "subject": "Física",
  "module": "ME",
  "area": "Mecánica",
  "concept": "Modelos del sistema solar",
  "question": "¿Qué observación de Galileo cuestionó que todos los astros giraran directamente alrededor de la Tierra?",
  "options": [
   "Satélites que orbitan Júpiter",
   "La alternancia entre día y noche",
   "El cambio de estaciones",
   "La existencia de montañas terrestres"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! Las lunas de Júpiter muestran movimientos alrededor de un centro distinto de la Tierra.",
   "Puede describirse con distintos modelos y no demuestra ese centro alternativo.",
   "No identifica por sí solo un cuerpo que orbite otro planeta.",
   "No es una observación de órbitas de otros astros."
  ],
  "steps": [
   "Relaciona observación con la afirmación específica del modelo.",
   "No concluyas que una sola observación prueba cada detalle de un modelo posterior.",
   "Las lunas de Júpiter muestran movimientos alrededor de un centro distinto de la Tierra."
  ],
  "easy": "Las lunas de Júpiter muestran movimientos alrededor de un centro distinto de la Tierra.",
  "example": "Las fases de Venus aportan otra observación relevante para comparar modelos planetarios. Cada evidencia debe confrontarse con lo que predice el modelo.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-189",
  "subject": "Física",
  "module": "ME",
  "area": "Electricidad",
  "concept": "Circuitos y energía eléctrica",
  "question": "Un resistor de 4 Ω está en serie con dos resistores de 6 Ω en paralelo entre sí. ¿Cuál es la resistencia equivalente total?",
  "options": [
   "16 Ω",
   "3 Ω",
   "2 Ω",
   "7 Ω"
  ],
  "answer": 3,
  "explanations": [
   "Sumaste los tres como si todos estuvieran en serie.",
   "Solo calculaste el bloque paralelo y omitiste el resistor en serie.",
   "El total no se obtiene tratando los tres como ramas paralelas.",
   "¡Cachaste! El paralelo de 6 y 6 equivale a 3 Ω; en serie con 4 Ω, el total es 7 Ω."
  ],
  "steps": [
   "Reduce primero el bloque paralelo: 6/2=3.",
   "Suma el resistor en serie: 4+3=7.",
   "El paralelo de 6 y 6 equivale a 3 Ω; en serie con 4 Ω, el total es 7 Ω."
  ],
  "easy": "El paralelo de 6 y 6 equivale a 3 Ω; en serie con 4 Ω, el total es 7 Ω.",
  "example": "Con 2 Ω en serie y dos ramas de 8 Ω en paralelo, el total es 2+4=6 Ω. La topología indica qué regla aplicar en cada paso.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-190",
  "subject": "Física",
  "module": "ME",
  "area": "Energía – Tierra",
  "concept": "Tectónica y geosfera",
  "question": "En una dorsal oceánica se forma corteza nueva. ¿Qué movimiento relativo de placas se asocia con ese proceso?",
  "options": [
   "Deslizamiento lateral sin separación neta",
   "Las placas permanecen inmóviles desde su formación",
   "Separación en un límite divergente",
   "Una placa se introduce bajo otra"
  ],
  "answer": 2,
  "explanations": [
   "Describe un límite transformante, no formación de corteza en dorsal.",
   "La teoría tectónica considera movimiento relativo.",
   "¡Cachaste! En límites divergentes las placas se separan y el material ascendente puede formar corteza oceánica nueva.",
   "Eso describe subducción en un límite convergente."
  ],
  "steps": [
   "Localiza el proceso de creación de fondo oceánico.",
   "Relaciona separación y ascenso de material con divergencia.",
   "En límites divergentes las placas se separan y el material ascendente puede formar corteza oceánica nueva."
  ],
  "easy": "En límites divergentes las placas se separan y el material ascendente puede formar corteza oceánica nueva.",
  "example": "En un límite transformante dos placas se deslizan lateralmente. Puede haber sismos sin que se cree corteza del mismo modo que en una dorsal.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-191",
  "subject": "Química",
  "module": "ME",
  "area": "Reacciones químicas y estequiometría",
  "concept": "Soluciones y concentración",
  "question": "Hay 0,3 mol de soluto disueltos en 0,6 kg de solvente. ¿Cuál es la molalidad?",
  "options": [
   "0,3 mol/L",
   "0,5 mol/kg",
   "0,18 mol/kg",
   "2 mol/kg"
  ],
  "answer": 1,
  "explanations": [
   "Se pide molalidad y no se proporciona volumen de solución.",
   "¡Cachaste! La molalidad es moles de soluto por kilogramo de solvente: 0,3/0,6=0,5.",
   "Multiplicar moles por kilogramos no calcula molalidad.",
   "Invertiste la razón: se divide soluto por masa de solvente."
  ],
  "steps": [
   "Distingue masa de solvente de volumen de solución.",
   "Divide moles por kilogramos, conservando unidades.",
   "La molalidad es moles de soluto por kilogramo de solvente: 0,3/0,6=0,5."
  ],
  "easy": "La molalidad es moles de soluto por kilogramo de solvente: 0,3/0,6=0,5.",
  "example": "Un mol de soluto en 2 kg de agua tiene molalidad 0,5 mol/kg. La molaridad exigiría conocer el volumen final de solución.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-192",
  "subject": "Química",
  "module": "ME",
  "area": "Reacciones químicas y estequiometría",
  "concept": "Soluciones y concentración",
  "question": "Una mezcla contiene 2 mol de A y 8 mol de B. ¿Cuál es la fracción molar de A?",
  "options": [
   "0,2",
   "0,25",
   "0,8",
   "2"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! X_A=n_A/(n_A+n_B)=2/10=0,2 y las fracciones suman 1.",
   "Dividiste A por B, no por moles totales.",
   "Esa es la fracción molar de B.",
   "Dos es la cantidad de moles de A, no su fracción."
  ],
  "steps": [
   "Suma los moles de todos los componentes: 10.",
   "Divide los dos moles de A por el total.",
   "X_A=n_A/(n_A+n_B)=2/10=0,2 y las fracciones suman 1."
  ],
  "easy": "X_A=n_A/(n_A+n_B)=2/10=0,2 y las fracciones suman 1.",
  "example": "Con 1 mol de C y 3 de D, X_C=1/4=0,25 y X_D=0,75. La fracción molar no lleva unidades.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-193",
  "subject": "Química",
  "module": "ME",
  "area": "Reacciones químicas y estequiometría",
  "concept": "Soluciones y concentración",
  "question": "En una solución diluida hay 3 mg de soluto en 1 kg de solución. ¿Cuál es la concentración en ppm masa/masa?",
  "options": [
   "3.000 ppm",
   "0,003 ppm",
   "30 ppm",
   "3 ppm"
  ],
  "answer": 3,
  "explanations": [
   "Confundiste miligramos con gramos: 3 mg no son 3 g.",
   "Un mg/kg ya equivale a una ppm; no vuelvas a dividir por mil.",
   "La razón entregada es tres mg por kg, no treinta.",
   "¡Cachaste! Una ppm m/m equivale a 1 mg por kg; 3 mg/kg corresponde a 3 ppm."
  ],
  "steps": [
   "Expresa ambas masas de forma compatible o usa equivalencia mg/kg.",
   "Verifica que la base es masa de solución.",
   "Una ppm m/m equivale a 1 mg por kg; 3 mg/kg corresponde a 3 ppm."
  ],
  "easy": "Una ppm m/m equivale a 1 mg por kg; 3 mg/kg corresponde a 3 ppm.",
  "example": "Si una muestra de 2 kg tiene 10 mg de soluto, la concentración es 10/2=5 mg/kg=5 ppm m/m.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-194",
  "subject": "Química",
  "module": "ME",
  "area": "Reacciones químicas y estequiometría",
  "concept": "Soluciones y concentración",
  "question": "Se mezclan 1 L de solución 1 M y 1 L de solución 3 M del mismo soluto, sin reacción y con volúmenes aditivos. ¿Qué molaridad final resulta?",
  "options": [
   "1 M",
   "3 M",
   "2 M",
   "4 M"
  ],
  "answer": 2,
  "explanations": [
   "Ignoraste los tres moles aportados por la segunda solución.",
   "Ignoraste la dilución al añadir la primera solución.",
   "¡Cachaste! Hay 1×1+3×1=4 mol en 2 L; M_final=4/2=2 M.",
   "Sumaste concentraciones sin dividir por el nuevo volumen."
  ],
  "steps": [
   "Calcula moles de cada solución antes de sumar.",
   "Divide moles totales por volumen final.",
   "Hay 1×1+3×1=4 mol en 2 L; M_final=4/2=2 M."
  ],
  "easy": "Hay 1×1+3×1=4 mol en 2 L; M_final=4/2=2 M.",
  "example": "Al mezclar 0,5 L de 2 M con 1,5 L de 0 M, hay 1 mol en 2 L y la concentración queda en 0,5 M.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-195",
  "subject": "Química",
  "module": "ME",
  "area": "Reacciones químicas y estequiometría",
  "concept": "Fórmulas y composición",
  "question": "Un compuesto contiene 40% C, 6,67% H y 53,33% O en masa. Usa masas atómicas C=12, H=1 y O=16. ¿Cuál es su fórmula empírica?",
  "options": [
   "CH₆O₃",
   "CH₂O",
   "C₂HO",
   "C₄H₆O₅"
  ],
  "answer": 1,
  "explanations": [
   "No redujiste las cantidades molares por el menor valor.",
   "¡Cachaste! En 100 g: C≈3,33 mol, H≈6,67 mol, O≈3,33 mol. La razón mínima es 1:2:1.",
   "No corresponde a la proporción molar 1:2:1.",
   "Usaste cifras de porcentajes como subíndices sin convertir a moles."
  ],
  "steps": [
   "Supón 100 g y convierte masa de cada elemento a moles.",
   "Divide por 3,33 para hallar proporciones enteras mínimas.",
   "En 100 g: C≈3,33 mol, H≈6,67 mol, O≈3,33 mol. La razón mínima es 1:2:1."
  ],
  "easy": "En 100 g: C≈3,33 mol, H≈6,67 mol, O≈3,33 mol. La razón mínima es 1:2:1.",
  "example": "Si una muestra tiene 2 mol C y 6 mol H, su fórmula empírica es CH₃. La fórmula molecular necesitaría además masa molar.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-196",
  "subject": "Química",
  "module": "ME",
  "area": "Química orgánica",
  "concept": "Carbono y grupos funcionales",
  "question": "¿Qué grupo funcional caracteriza a CH₃−COO−CH₂−CH₃?",
  "options": [
   "Éster",
   "Éter",
   "Aldehído",
   "Amida"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! El grupo −C(=O)−O− unido a carbonos corresponde a un éster.",
   "Un éter simple no contiene el carbonilo adyacente al oxígeno como en −COO−.",
   "No hay carbonilo terminal unido a H de un grupo −CHO.",
   "Una amida contiene nitrógeno asociado al carbonilo; aquí no hay N."
  ],
  "steps": [
   "Localiza el carbonilo y el oxígeno adyacente.",
   "Reconoce el grupo completo, no un enlace aislado.",
   "El grupo −C(=O)−O− unido a carbonos corresponde a un éster."
  ],
  "easy": "El grupo −C(=O)−O− unido a carbonos corresponde a un éster.",
  "example": "CH₃CONH₂ es una amida: el carbonilo está unido a nitrógeno. Cambiar O por N en ese entorno cambia la función.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-197",
  "subject": "Química",
  "module": "ME",
  "area": "Química orgánica",
  "concept": "Carbono y grupos funcionales",
  "question": "La fórmula CH₃−O−CH₃ corresponde a ¿qué función orgánica?",
  "options": [
   "Alcohol",
   "Cetona",
   "Ácido carboxílico",
   "Éter"
  ],
  "answer": 3,
  "explanations": [
   "No presenta un enlace O−H de alcohol.",
   "No presenta carbonilo C=O entre carbonos.",
   "No contiene el grupo −COOH.",
   "¡Cachaste! En un éter, un oxígeno enlaza dos grupos carbonados: C−O−C."
  ],
  "steps": [
   "Revisa los enlaces alrededor del oxígeno.",
   "Distingue C−O−C de C−O−H.",
   "En un éter, un oxígeno enlaza dos grupos carbonados: C−O−C."
  ],
  "easy": "En un éter, un oxígeno enlaza dos grupos carbonados: C−O−C.",
  "example": "CH₃CH₂OH es alcohol y CH₃OCH₃ es éter. Ambos tienen C₂H₆O, pero su conectividad y función son distintas.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-198",
  "subject": "Química",
  "module": "ME",
  "area": "Estructura atómica",
  "concept": "Materia y modelos atómicos",
  "question": "Dos líquidos inmiscibles forman capas y se separan abriendo la llave de un embudo de separación. ¿Qué procedimiento se utiliza?",
  "options": [
   "Tamizado",
   "Destilación",
   "Decantación",
   "Filtración"
  ],
  "answer": 2,
  "explanations": [
   "El tamizado clasifica sólidos por tamaño, no líquidos inmiscibles.",
   "No hay vaporización y condensación en este procedimiento.",
   "¡Cachaste! La decantación aprovecha separación de fases y diferencias de densidad para retirar una capa.",
   "Una barrera porosa no es el mecanismo descrito para estas capas líquidas."
  ],
  "steps": [
   "Identifica líquidos que no se mezclan homogéneamente.",
   "El embudo permite extraer una fase sin evaporarla.",
   "La decantación aprovecha separación de fases y diferencias de densidad para retirar una capa."
  ],
  "easy": "La decantación aprovecha separación de fases y diferencias de densidad para retirar una capa.",
  "example": "Dejar sedimentar barro y verter con cuidado el líquido superior es otra decantación. Cambia la mezcla, se conserva la separación por fases.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-199",
  "subject": "Biología",
  "module": "MTP",
  "area": "Procesos y funciones biológicas",
  "concept": "Reproducción y prevención",
  "question": "¿Qué conducta representa respeto y responsabilidad en la dimensión afectiva de la sexualidad?",
  "options": [
   "Compartir información íntima sin consentimiento",
   "Respetar límites y decisiones expresadas libremente",
   "Suponer acuerdo porque existe una relación de pareja",
   "Decidir por la otra persona para evitar conversar"
  ],
  "answer": 1,
  "explanations": [
   "Eso vulnera privacidad y respeto por la otra persona.",
   "¡Cachaste! La sexualidad incluye aspectos afectivos y sociales; cuidar autonomía, comunicación y consentimiento contribuye al bienestar.",
   "Una relación no reemplaza el respeto por decisiones y límites.",
   "La responsabilidad incluye comunicación y autonomía."
  ],
  "steps": [
   "Distingue sexualidad integral de una visión solo reproductiva.",
   "Evalúa si la conducta respeta la decisión y privacidad de la otra persona.",
   "La sexualidad incluye aspectos afectivos y sociales; cuidar autonomía, comunicación y consentimiento contribuye al bienestar."
  ],
  "easy": "La sexualidad incluye aspectos afectivos y sociales; cuidar autonomía, comunicación y consentimiento contribuye al bienestar.",
  "example": "Conversar antes de compartir una fotografía privada y respetar una negativa aplica el mismo principio de autonomía y cuidado.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-200",
  "subject": "Biología",
  "module": "MTP",
  "area": "Organización, estructura y actividad celular",
  "concept": "Organelos y función celular",
  "question": "Una célula degrada componentes envejecidos mediante enzimas dentro de vesículas. ¿Qué organelo participa directamente?",
  "options": [
   "Lisosoma",
   "Ribosoma",
   "Nucléolo",
   "Cloroplasto"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! Los lisosomas contienen enzimas que permiten degradar materiales en un compartimento celular.",
   "Ensambla proteínas; no es una vesícula digestiva.",
   "Participa en formación de componentes ribosómicos, no digestión vesicular.",
   "Realiza fotosíntesis; no corresponde a degradación descrita."
  ],
  "steps": [
   "Reconoce degradación y localización en una vesícula.",
   "No confundas fabricar proteínas con degradar componentes.",
   "Los lisosomas contienen enzimas que permiten degradar materiales en un compartimento celular."
  ],
  "easy": "Los lisosomas contienen enzimas que permiten degradar materiales en un compartimento celular.",
  "example": "Una célula que incorpora una partícula puede digerirla al fusionar compartimentos con lisosomas. La función es procesar material, no capturar luz.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-201",
  "subject": "Física",
  "module": "MTP",
  "area": "Ondas",
  "concept": "Ondas electromagnéticas",
  "question": "Un espejo plano forma una imagen de un objeto situado frente a él. ¿Qué característica tiene esa imagen?",
  "options": [
   "Es real y siempre se proyecta en una pantalla",
   "Tiene necesariamente el doble de tamaño",
   "Se forma siempre sobre la superficie del espejo",
   "Es virtual y del mismo tamaño que el objeto"
  ],
  "answer": 3,
  "explanations": [
   "La imagen de espejo plano es virtual: los rayos no convergen detrás.",
   "El espejo plano no produce ese aumento.",
   "Se percibe detrás, a distancia simétrica del objeto.",
   "¡Cachaste! Los rayos reflejados parecen provenir de una imagen virtual detrás del espejo, del mismo tamaño."
  ],
  "steps": [
   "Prolonga mentalmente los rayos reflejados hacia atrás.",
   "Distingue una intersección aparente de una real.",
   "Los rayos reflejados parecen provenir de una imagen virtual detrás del espejo, del mismo tamaño."
  ],
  "easy": "Los rayos reflejados parecen provenir de una imagen virtual detrás del espejo, del mismo tamaño.",
  "example": "Si una marca está a 30 cm frente al espejo, su imagen se observa a 30 cm detrás. Esa simetría no significa que exista un objeto material allí.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-202",
  "subject": "Física",
  "module": "MTP",
  "area": "Energía – Tierra",
  "concept": "Tectónica y geosfera",
  "question": "¿Qué relación explica la presencia de volcanismo andino y sismos frente a Chile?",
  "options": [
   "El desplazamiento de nubes hacia la cordillera",
   "La inmovilidad completa de la litosfera",
   "La interacción convergente y subducción de placas",
   "El cambio diario entre luz y oscuridad"
  ],
  "answer": 2,
  "explanations": [
   "El movimiento atmosférico no corresponde al mecanismo tectónico.",
   "La teoría tectónica explica estos procesos mediante placas móviles.",
   "¡Cachaste! La subducción en el margen chileno se vincula con sismicidad y procesos que favorecen volcanismo andino.",
   "El ciclo diario no explica el borde tectónico ni su volcanismo."
  ],
  "steps": [
   "Ubica Chile en un margen convergente.",
   "Relaciona interacción de placas con liberación de energía y magmatismo.",
   "La subducción en el margen chileno se vincula con sismicidad y procesos que favorecen volcanismo andino."
  ],
  "easy": "La subducción en el margen chileno se vincula con sismicidad y procesos que favorecen volcanismo andino.",
  "example": "En una dorsal también puede haber volcanismo, pero asociado a separación de placas. El fenómeno general puede tener contextos tectónicos diferentes.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-203",
  "subject": "Física",
  "module": "MTP",
  "area": "Ondas",
  "concept": "Ondas electromagnéticas",
  "question": "¿Qué tienen en común radio y luz visible?",
  "options": [
   "Son ondas mecánicas de compresión del aire",
   "Son ondas electromagnéticas que pueden propagarse en el vacío",
   "Ambas necesitan aire para propagarse",
   "Tienen siempre la misma frecuencia"
  ],
  "answer": 1,
  "explanations": [
   "Esa descripción corresponde a sonido, no a estas radiaciones.",
   "¡Cachaste! Radio y visible pertenecen al espectro electromagnético; difieren en frecuencia y longitud, no en requerir un medio material.",
   "Las ondas electromagnéticas no requieren aire.",
   "Radio y visible ocupan rangos distintos de frecuencia."
  ],
  "steps": [
   "Identifica la familia de ondas.",
   "Distingue radiación electromagnética de perturbación mecánica.",
   "Radio y visible pertenecen al espectro electromagnético; difieren en frecuencia y longitud, no en requerir un medio material."
  ],
  "easy": "Radio y visible pertenecen al espectro electromagnético; difieren en frecuencia y longitud, no en requerir un medio material.",
  "example": "La luz del Sol llega a través del espacio interplanetario. Esa propagación permite reconocer que no necesita aire como el sonido.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 },
 {
  "id": "SCI-204",
  "subject": "Química",
  "module": "MTP",
  "area": "Estructura atómica",
  "concept": "Materia y modelos atómicos",
  "question": "Una muestra tiene masa 24 g y volumen 8 cm³. ¿Cuál es su densidad?",
  "options": [
   "3 g/cm³",
   "192 g/cm³",
   "1/3 g/cm³",
   "16 g/cm³"
  ],
  "answer": 0,
  "explanations": [
   "¡Cachaste! Densidad es masa dividida por volumen: 24/8=3 g/cm³.",
   "Multiplicar masa por volumen no calcula densidad.",
   "Invertiste volumen y masa.",
   "Restar magnitudes con unidades distintas no da densidad."
  ],
  "steps": [
   "Identifica masa y volumen de la misma muestra.",
   "Divide y expresa unidad de masa por volumen.",
   "Densidad es masa dividida por volumen: 24/8=3 g/cm³."
  ],
  "easy": "Densidad es masa dividida por volumen: 24/8=3 g/cm³.",
  "example": "Otra muestra de la misma sustancia, de 15 g y 5 cm³ en iguales condiciones, también tiene densidad 3 g/cm³. La densidad no depende solo del tamaño.",
  "skill": "Procesar y analizar evidencia",
  "difficulty": "intermedio",
  "origin": "original",
  "review": "revision_individual_asistida",
  "reviewStatus": "revision_individual_2026-10-14",
  "examEligible": true,
  "curricularStatus": "temario_demre_2027"
 }
]);
/* Familias de paráfrasis: no se cuentan como transferencia ni se duplican en un ensayo. */
for(const ids of [[9,65],[16,88],[22,99],[49,101],[53,131],[30,72,108],[33,111],[7,140]]){
 const family='science-family-'+ids[0];for(const n of ids){const q=window.SCIENCE_BANK.find(q=>q.id==='SCI-'+String(n).padStart(3,'0'));q.transferGroup=family;}
}
/* Transferencia adicional: conceptos que antes tenían un único ítem. */
{
const additions=[
[182,'Un microorganismo modificado produce una enzima para detergentes después de recibir un gen de otra especie. ¿Qué explica directamente la aparición de esa proteína?',
 ['La expresión de la información del gen introducido','La conversión de todo su ADN en el ADN de la especie donante','La producción de la enzima sin utilizar información genética','La transformación del microorganismo en la especie que donó el gen'],
 ['¡Cachaste! El gen introducido contiene información que, al expresarse, permite sintetizar la proteína. No reemplaza todo el genoma ni cambia la especie del organismo receptor.','La inserción de un gen no implica sustituir el resto del genoma del receptor.','La secuencia de la proteína depende de información genética; el enunciado vincula la nueva producción con el gen transferido.','Compartir un gen y producir una proteína no transforma al receptor en otra especie.'],
 ['Identifica qué se introdujo: un gen, no un organismo completo.','Relaciona expresión genética con síntesis de una proteína.','La nueva proteína se explica por información transferida y expresada; el receptor conserva el resto de su identidad genética.'],
 'Es como incorporar una receta nueva: la célula puede fabricar ese producto sin cambiar todas sus demás instrucciones.',
 'Si una levadura recibe y expresa un gen que permite producir una proteína farmacéutica, puede obtenerse ese producto. La levadura sigue siendo levadura.'],
[188,'Según la primera ley de Kepler, ¿cómo se describe la órbita de un planeta alrededor del Sol?',
 ['Como una elipse con el Sol en uno de sus focos','Como una elipse con el Sol necesariamente en su centro','Como una circunferencia con la Tierra en el centro','Como una elipse con el Sol siempre fuera de ella'],
 ['¡Cachaste! La primera ley describe órbitas elípticas y ubica al Sol en uno de los focos. No lo sitúa en el centro geométrico de la elipse.','El centro geométrico y los focos de una elipse no son el mismo punto, salvo el caso límite circular.','Esa descripción combina órbita circular con un centro terrestre; no corresponde a la ley de Kepler.','Los focos de una elipse están dentro de ella, no fuera.'],
 ['Reconoce que la primera ley trata la forma de la órbita.','Distingue el foco de una elipse de su centro geométrico.','El planeta sigue una elipse y el Sol ocupa uno de los focos.'],
 'La trayectoria puede estar algo estirada. El Sol se ubica en un foco interior, no necesariamente justo al medio.',
 'En una órbita elíptica más alargada, la distancia al Sol cambia entre perihelio y afelio. El Sol continúa en un foco aunque la elipse cambie de forma.']
];
additions.forEach(([base,question,options,explanations,steps,easy,example],i)=>{
 const original=window.SCIENCE_BANK.find(q=>q.id==='SCI-'+base);
 const offset=i+1,rotate=values=>values.slice(offset).concat(values.slice(0,offset));
 window.SCIENCE_BANK.push({...original,id:'SCI-'+(205+i),question,options:rotate(options),answer:4-offset,explanations:rotate(explanations),steps,easy,example,reviewStatus:'revision_individual_2026-10-15'});
});
}

/* Profesor de Ciencias: fundamentos y transferencia por mecanismo,
 * aplicación y comprobación revisadas por pregunta. Sin servicios externos. */
(function(){
 const lessons={},rows={};
 function lesson(key,foundation,intuition,problem,steps,bridge){lessons[key]={foundation:foundation.split('|'),intuition:intuition.split('|'),example:{problem,steps:steps.split('|'),bridge}};}
 lesson('Respiración celular y ATP',
 'Las células necesitan transferir energía para procesos como movimiento o transporte. El ATP es una molécula que permite acoplar energía obtenida de nutrientes a trabajos celulares; no es energía creada de la nada.|En células eucariontes, las mitocondrias realizan etapas de la respiración celular que generan gran parte del ATP en condiciones aerobias. Los ribosomas, el Golgi y el retículo tienen otras tareas: fabricar, procesar o distribuir sustancias.',
 'Imagina un sistema de baterías recargables: los nutrientes aportan energía que se utiliza para recargar ATP. La célula utiliza esa moneda de intercambio para hacer trabajo.|Una fábrica necesita electricidad y también máquinas que construyan piezas. Que los ribosomas fabriquen piezas no los convierte en la principal central de recarga: cada estructura cumple un papel.',
 'Una célula de un túbulo renal transporta sustancias contra sus gradientes. Si aumenta ese transporte activo, ¿por qué podría necesitar numerosas mitocondrias?',
 'Transportar contra un gradiente significa mover sustancias hacia donde ya están más concentradas, lo que requiere un aporte energético.|Bombas de membrana pueden utilizar ATP para acoplar ese trabajo. Más actividad de transporte aumenta la demanda de ATP.|Las mitocondrias ayudan a reponer ATP mediante respiración celular. No bombean directamente las sustancias: sostienen energéticamente a las bombas de membrana.',
 'Relaciona la tarea celular con su demanda de ATP y luego con la estructura que contribuye a obtenerlo; no confundas sostener energéticamente con ejecutar toda la tarea.');
 lesson('Membrana y ósmosis',
 'La membrana plasmática es el límite selectivo de la célula: una bicapa de lípidos con proteínas que regulan intercambios. La pared vegetal aporta soporte por fuera, pero no sustituye esa selección de transporte.|La ósmosis es el movimiento neto de agua a través de una membrana que separa soluciones con distinta concentración efectiva de solutos no permeantes. El agua tiende a desplazarse hacia la mayor concentración de esos solutos; moléculas de agua siguen moviéndose en ambos sentidos.',
 'Imagina una entrada con controles diferentes para personas y paquetes: no todo atraviesa igual. La pared puede sostener el edificio, pero las puertas regulan el paso.|Para el agua, piensa en dos sectores separados por una barrera que deja pasar agua y retiene cierto soluto. El reparto puede cambiar sin que la sal se transforme en agua ni desaparezca la membrana.',
 'Una bolsa permeable al agua, pero no al azúcar, contiene una solución más concentrada que el agua exterior. ¿Qué cambio inicial se espera?',
 'Comparamos concentración de azúcar dentro y fuera, no solo la cantidad total de líquido.|El interior tiene más soluto no permeante. Se espera entrada neta de agua hacia él y aumento inicial del volumen de la bolsa.|El azúcar permanece separado y no se convierte en agua. Si la concentración exterior fuera mayor, el sentido neto del agua se invertiría.',
 'Identifica qué deja pasar la membrana y compara las concentraciones de soluto antes de decidir la dirección neta del agua.');
 lesson('Fabricación y destino de proteínas',
 'Una proteína es una cadena de aminoácidos cuya secuencia se construye en ribosomas. El ARN mensajero contiene una copia de información de un gen; traducir es utilizarla para ordenar los aminoácidos. El ARN de transferencia ayuda a llevarlos.|Muchas proteínas de secreción se ensamblan en ribosomas asociados al retículo rugoso, entran a esa vía y luego pasan al Golgi, que modifica, clasifica y empaqueta. Los lisosomas degradan materiales: fabricar, enviar y degradar no son la misma función.',
 'Imagina una editorial: el ADN conserva el original, el ARN mensajero lleva una copia de las instrucciones y los ribosomas arman el producto. El Golgi prepara el envío a su dirección.|Que un paquete pase por un centro de despacho no significa que se fabricó allí. Sigue la secuencia de tareas para elegir qué estructura explica cada etapa.',
 'Una célula glandular fabrica una enzima digestiva, pero falla el sistema que clasifica sus paquetes después del retículo. ¿Por qué la enzima puede estar sintetizada y aun así no llegar bien a su destino?',
 'Los ribosomas pudieron ensamblar la cadena siguiendo el ARN mensajero: la fabricación es una etapa previa.|El Golgi recibe productos de esa vía y participa en modificaciones y clasificación para dirigirlos. Si falla esa etapa, la existencia de la cadena no garantiza su distribución correcta.|La observación distinguiría síntesis y destino. No demostraría que los lisosomas se encargan normalmente de exportar la enzima ni que todo el ADN dejó de copiarse.',
 'Ubica si la pregunta pide instrucciones, ensamblaje, clasificación o degradación y sigue la ruta completa para no intercambiar funciones.');
 lesson('Sinapsis química',
 'Una sinapsis es una comunicación entre una neurona y otra célula. En una sinapsis química típica, el potencial de acción llega al terminal presináptico y favorece apertura de canales de calcio.|La entrada de calcio favorece fusión de vesículas con la membrana y liberación de neurotransmisores. Esas moléculas cruzan la hendidura y se unen a receptores postsinápticos; según el receptor y circuito pueden modificar la respuesta de la célula receptora.',
 'Imagina que una señal llega a una oficina y activa el despacho de cartas. Las cartas atraviesan la calle y llegan a buzones que las reconocen.|En esta comparación el calcio ayuda a abrir el despacho, las cartas son neurotransmisores y los buzones son receptores. No cruza todo el camión ni viaja por la calle la señal eléctrica de la oficina.',
 'En una preparación experimental hay neurotransmisor disponible, pero la célula receptora carece de receptores funcionales para él. ¿Liberar más mensajero garantiza la respuesta habitual?',
 'Para que el mensajero tenga su efecto normal debe unirse a un receptor apropiado. Su presencia en el espacio no basta.|Si faltan los receptores funcionales, aumentar la cantidad no garantiza recuperar la respuesta mediada por ellos.|El fallo está en la recepción, distinto de bloquear calcio y dificultar la liberación. Separar ambas etapas permite localizar mecanismos diferentes.',
 'Recorre llegada del impulso, calcio, liberación y recepción; identifica exactamente qué etapa cambia en la pregunta.');
 lesson('Circuito reflejo y señal nerviosa',
 'Los receptores sensoriales convierten estímulos en señales nerviosas. Las neuronas sensoriales llevan información a centros de integración y las motoras la conducen hacia efectores, como músculos.|Un reflejo es una respuesta organizada por un circuito nervioso que puede integrarse en médula o tronco encefálico sin esperar deliberación cortical. La información también puede llegar al encéfalo: responder antes de percibir conscientemente no significa que el cerebro no reciba nada.',
 'Es como una alarma local que activa una respuesta antes de que una persona analice todo lo ocurrido. El aviso al centro de supervisión puede seguir viajando mientras se inicia la acción.|El músculo ejecuta la orden: no decide por sí solo qué significa el estímulo. Distingue sensor, cable de información, coordinación y respuesta.',
 'Al percutir suavemente un tendón durante un examen, aparece una contracción rápida sin que la persona decida mover la pierna. ¿Es necesario que haya una decisión consciente previa?',
 'Un estímulo activa receptores y entra a un circuito reflejo por una vía sensorial.|La integración del circuito puede activar neuronas motoras y el músculo sin una orden consciente previa.|No deducimos ausencia de sistema nervioso ni interrupción de toda información hacia el encéfalo. La rapidez se explica por la organización de la vía.',
 'Identifica la cadena estímulo-receptor-circuito-efector y distingue respuesta refleja de una acción que exige deliberación previa.');
 lesson('Prevención y mecanismos anticonceptivos',
 'Un método de barrera interpone un material físico que reduce el intercambio de fluidos y contactos cubiertos. El uso correcto y consistente del preservativo reduce riesgo de embarazo y de muchas infecciones de transmisión sexual, sin prometer protección absoluta.|Los métodos hormonales actúan sobre procesos reproductivos, por ejemplo inhibiendo ovulación en ciertos métodos o modificando moco cervical. No crean la misma barrera frente a ITS. Evitar embarazo y reducir transmisión son objetivos diferentes.',
 'Piensa en comparar mecanismo y objetivo: cerrar un paso físico y modificar una señal del organismo son estrategias distintas. Que ambas puedan prevenir embarazo no significa que protejan igual frente a infecciones.|Una barrera cubre ciertos contactos; no vuelve imposible toda transmisión en cualquier situación. La idea útil es reducción de riesgo, no garantía total.',
 'Una ficha escolar dice: «Todos los métodos que previenen embarazo también evitan cualquier ITS». ¿Qué falla en el argumento?',
 'Prevenir embarazo y prevenir infecciones son resultados diferentes. Un mecanismo puede actuar sobre reproducción sin impedir contactos transmisores.|La anticoncepción hormonal no forma una barrera física equivalente a un preservativo.|Incluso para preservativos corresponde hablar de reducción de riesgo con uso correcto y consistente, no protección absoluta frente a toda ITS. La afirmación mezcla objetivos y exagera la garantía.',
 'Compara mecanismos y objetivos por separado y conserva el límite entre disminuir riesgo y eliminarlo por completo.');
 lesson('Mitosis y control del ciclo',
 'Antes de dividirse, una célula replica su ADN en fase S: cada cromosoma queda con dos cromátidas hermanas. Replicar ADN duplica su cantidad, pero no significa que cada futura célula hija conserve el doble de cromosomas.|La mitosis separa cromátidas hermanas durante anafase y permite conservar normalmente la dotación cromosómica en las células hijas. Los puntos de control pueden frenar el ciclo ante daños, dando oportunidad de reparación antes de copiarlos o distribuirlos.',
 'Imagina copiar un juego de instrucciones y entregar un juego completo a cada equipo nuevo. Las copias se organizan para repartirlas, no para entregar a cada uno todos los juegos de ambos.|Un control de calidad antes de fotocopiar evita multiplicar una página dañada. Si detectas el problema, frenar antes de copiar puede proteger los nuevos juegos.',
 'Una célula somática con ocho cromosomas crece y produce dos células hijas mediante mitosis normal. ¿Cuántos cromosomas tendrá cada hija y por qué no dieciséis?',
 'El ADN se copia antes del reparto: se forman cromátidas hermanas de los ocho cromosomas.|La mitosis distribuye una copia de cada cromosoma a cada hija, de modo que cada una recibe ocho.|Dieciséis para cada hija contaría como si ambas conservaran las dos copias completas. Tampoco se reduce a cuatro: esa reducción pertenece al ciclo meiótico, no a esta división somática.',
 'Distingue cantidad de ADN replicado, cromátidas y dotación final por célula; ubica en qué etapa se copia o se separa.');
 lesson('Meiosis y recombinación',
 'Diploide, 2n, significa dos juegos de cromosomas, uno de cada progenitor; haploide, n, un juego. Los homólogos son cromosomas de un par con genes correspondientes; no son lo mismo que las cromátidas hermanas de una copia replicada.|En meiosis I se separan homólogos y en meiosis II cromátidas hermanas. El entrecruzamiento de cromátidas no hermanas de homólogos en profase I y la distribución de pares generan combinaciones diversas. La fecundación reúne n + n y restablece 2n.',
 'Piensa en pares de libros con versiones materna y paterna. Formar un juego para un gameto exige separar los pares, no regalar las dos bibliotecas completas.|Además, intercambiar fragmentos entre versiones puede crear combinaciones nuevas de información. Eso no inventa por necesidad un alelo útil ni elimina todos los dominantes.',
 'Una especie tiene 2n = 8. Sus gametos se forman por meiosis y dos de ellos se unen. ¿Qué dotaciones se esperan y de dónde surge diversidad?',
 'La meiosis reduce los dos juegos de ocho cromosomas a gametos de n = 4.|Recombinación y distribución de homólogos permiten gametos con combinaciones distintas, aunque su número cromosómico sea cuatro.|Al fecundar, un gameto de cuatro y otro de cuatro restablecen ocho en el cigoto. La diversidad de combinaciones no requiere duplicar la dotación final.',
 'Separa tres preguntas: cuántos juegos quedan, qué se separa en cada división y cómo cambian las combinaciones de alelos.');
 lesson('Selección natural y evidencia',
 'Una población puede contener variantes heredables que afectan supervivencia y reproducción. Si una variante permite dejar más descendencia en cierto ambiente, puede aumentar su frecuencia a lo largo de generaciones: eso es selección natural.|Las mutaciones no aparecen porque un individuo decida necesitarlas. La selección actúa sobre variación preexistente o que surge sin dirigirse a satisfacer esa necesidad. Comparar ADN y estructuras homólogas también permite investigar parentescos, sin igualar especies por parecido superficial.',
 'Imagina semillas con características diferentes en un terreno que se vuelve seco: algunas ya toleran mejor la sequía. Si producen más semillas, su característica puede hacerse frecuente en la siguiente generación.|No es que el terreno enseñe a cada semilla a cambiar a voluntad. Importa qué variantes dejan descendencia y qué evidencia permite seguir ese cambio.',
 'En una población de plantas hay una variante heredable que retiene mejor el agua. Una sequía prolongada favorece su reproducción. ¿Qué predicción es razonable?',
 'Ya existe una diferencia heredable: no necesitamos suponer que todas las plantas crean la misma mutación al sentir sed.|Si la variante deja más descendientes y estos heredan el rasgo, su frecuencia puede aumentar en generaciones siguientes.|No se garantiza que toda planta sobreviva ni que toda diferencia de aspecto sea genética. La predicción depende de herencia, ambiente y reproducción diferencial.',
 'Busca variación heredable, diferencia de éxito reproductivo y cambio generacional; no atribuyas voluntad o mutaciones dirigidas por necesidad.');
 lesson('Fotosíntesis y ciclo del carbono',
 'La fotosíntesis oxigénica convierte energía luminosa en energía química. En cloroplastos, pigmentos como clorofila capturan luz en membranas tilacoidales; las reacciones luminosas separan agua y liberan O₂.|El carbono del CO₂ puede incorporarse a compuestos orgánicos. La respiración celular oxida materia orgánica y puede devolver CO₂ al medio; las plantas también respiran. La materia puede circular, mientras la energía se transforma y parte se disipa como calor.',
 'Piensa en una cocina que usa luz para preparar alimento: hay ingredientes distintos con destinos distintos. El agua aporta el oxígeno gaseoso liberado y el dióxido de carbono aporta carbono a la materia orgánica.|Fabricar alimento y usarlo para hacer trabajo son procesos relacionados, no uno exclusivo de plantas y otro exclusivo de animales. Una planta necesita ambos.',
 'En un experimento se marca el oxígeno del agua que recibe un alga fotosintética. ¿Dónde podría detectarse esa marca al liberar gas y qué no demuestra esto sobre el carbono?',
 'Al dividir agua en las reacciones luminosas, parte de su oxígeno pasa al O₂ liberado; la marca permite seguir esos átomos.|Esto distingue la fuente directa del gas de la fuente del carbono orgánico, que procede del CO₂ fijado.|La marca no significa creación de átomos nuevos ni ausencia de respiración en el alga. Seguir un elemento exige conservar su identidad entre moléculas.',
 'Distingue fuente de energía, fuente de carbono y origen del O₂; sigue átomos y transformaciones sin confundirlos con creación de materia.');
 lesson('Redes tróficas y energía',
 'Un nivel trófico agrupa organismos por su fuente de alimento: productores forman materia orgánica y consumidores la obtienen de otros organismos. Una red une varias cadenas y muestra dependencias alimentarias.|Solo una parte de la energía disponible pasa al siguiente nivel: parte se usa en metabolismo y se disipa como calor, y no toda biomasa se consume o asimila. Los descomponedores reciclan nutrientes, pero no devuelven toda la energía inicial a los productores.',
 'Imagina un presupuesto con gastos en cada etapa. Cada organismo usa recursos para mantenerse, de modo que no entrega todo lo que recibió a quien lo come.|Más alimento disponible puede favorecer consumidores, pero no es una garantía de población ilimitada: también importan refugio, enfermedades y otros alimentos.',
 'Una red acuática depende de algas que alimentan pequeños crustáceos y estos a peces. Si cae la producción de algas, ¿qué efecto directo y qué límite conviene reconocer?',
 'Las algas incorporan materia orgánica y energía a esa base de la red; menos producción puede reducir el recurso para crustáceos.|Los peces pueden recibir menos alimento después, porque dependen de los consumidores intermedios y las transferencias no son perfectas.|No deducimos desaparición inmediata de toda especie: la magnitud depende de reservas, otras presas y condiciones. La predicción sigue una relación alimentaria, con límites.',
 'Ubica quién alimenta a quién, distingue efecto directo de consecuencias posteriores y recuerda que energía disponible no se recicla por completo.');
 lesson('Diseño y evidencia experimental',
 'La variable independiente es la condición que se modifica o compara; la dependiente es la respuesta medida. Las variables controladas se mantienen comparables para evitar explicaciones alternativas. Una hipótesis debe relacionar variables observables y poder contrastarse con resultados.|Repetir mediciones permite evaluar dispersión y detectar problemas de montaje; elegir solo resultados convenientes sesga el análisis. La muestra y condiciones delimitan a quién y cuándo se pueden generalizar conclusiones. Comparar no elimina automáticamente todos los sesgos.',
 'Piensa en comparar dos recetas cambiando solo un ingrediente. Si también cambias horno, tiempo y tamaño, no sabes qué produjo la diferencia.|Escribe tres casilleros: lo que cambio, lo que mido y lo que mantengo. No puedes fijar el resultado antes de observarlo ni borrar los datos que no te gusten.',
 'Se estudia si la sal modifica cuánto tarda en congelarse agua. ¿Cómo se organiza una comparación inicial?',
 'La cantidad de sal es la variable modificada y el tiempo hasta el criterio de congelación es la respuesta medida.|Se mantienen comparables volumen de agua, recipiente, temperatura inicial y condiciones del congelador. Se repiten mediciones registrando también las que difieren.|Un cambio de tiempos bajo ese diseño puede apoyar la hipótesis. No demuestra una regla para toda sustancia o temperatura ni autoriza ocultar resultados discordantes.',
 'Nombra condición, respuesta y controles para la pregunta concreta, y limita la conclusión al procedimiento y muestra disponibles.');
 lesson('Frecuencia y longitud de onda',
 'La longitud de onda λ es la distancia entre puntos que repiten el mismo estado, como dos crestas. La frecuencia f cuenta ciclos por segundo y se mide en hertz, Hz. El período T mide segundos por ciclo: f = 1/T.|La rapidez de propagación es v = λf. En vacío, toda radiación electromagnética se propaga con rapidez c; si f aumenta, λ disminuye. Al pasar a un medio estacionario distinto, la frecuencia se conserva y pueden cambiar rapidez y longitud. Frecuencia, amplitud e intensidad son magnitudes diferentes.',
 'Imagina contar cuántos vagones iguales pasan cada segundo y cuánto mide cada uno. Longitud por vagones por segundo da distancia por segundo: esa es la idea de v = λf.|Con la misma rapidez, más vagones por segundo requieren vagones más cortos. La altura del vagón sería otra característica: no la confundas con cuántos pasan.',
 'En una cuerda, una perturbación viaja a 12 m/s y realiza tres ciclos por segundo. ¿Cuál es su longitud de onda y su período?',
 'La frecuencia es 3 Hz. Despejamos λ = v/f = 12/3 = 4 m por ciclo.|El período es T = 1/f = 1/3 s por ciclo. Cuatro metros por tres ciclos por segundo recuperan 12 m/s.|Si la frecuencia sube a seis manteniendo rapidez doce, la longitud baja a dos metros. La relación no permite concluir que cambie también la amplitud.',
 'Define primero cada magnitud con su unidad y decide qué permanece constante antes de aplicar v = λf o f = 1/T.');
 lesson('Reflexión y refracción',
 'Reflexión es el retorno de una onda al medio de origen; refracción ocurre al transmitirse a otro medio con distinta rapidez. En incidencia oblicua puede cambiar de dirección al refractarse. La normal es una línea perpendicular a la superficie.|En reflexión especular los ángulos incidente y reflejado son iguales respecto de la normal. En un espejo plano la imagen es virtual: los rayos reflejados parecen provenir de detrás del espejo, sin converger realmente allí. Una lente convergente refracta rayos paralelos hacia su foco.',
 'Imagina una pelota que vuelve hacia el lado del que vino: se parece al rebote de la reflexión. Cruzar una frontera y seguir por el otro material corresponde a transmisión con posible refracción.|Para medir el ángulo, usa una línea perpendicular a la frontera como regla. La imagen del espejo parece estar al otro lado, pero no hay allí una persona real que puedas proyectar sobre una pantalla.',
 'Un rayo llega a un espejo formando 25° con su superficie. ¿Cuál es el ángulo reflejado respecto de la normal?',
 'Superficie y normal forman 90°. El ángulo incidente respecto de la normal es 90 − 25 = 65°.|La ley de reflexión iguala los ángulos medidos desde la normal: el reflejado también es 65°.|Responder 25° respecto de la normal mezclaría referencias. El rayo vuelve al medio original; si atravesara otro material hablaríamos de refracción, no de este rebote.',
 'Identifica si la onda vuelve o cruza y conserva la referencia angular; no intercambies superficie y normal.');
 lesson('Rapidez y aceleración',
 'La rapidez media indica distancia total por unidad de tiempo: r = d/Δt. Metros divididos por segundos dan m/s y significan cuántos metros se recorren, en promedio, por segundo.|La velocidad incluye dirección. La aceleración mide cambio de velocidad por tiempo: a = (v final − v inicial)/Δt, en m/s². Con aceleración constante, v final = v inicial + aΔt. Una rapidez media no implica por sí sola que cada instante haya sido igual.',
 'Piensa en repartir la distancia de un viaje entre sus segundos. El resultado describe lo que correspondería a cada segundo si repartieras por igual; no obliga a que el trayecto real se haya repartido así.|Acelerar es cambiar cuánto avanzas por segundo: dos m/s² significa que cada segundo la velocidad cambia dos m/s, no que siempre recorras dos metros.',
 'Una cinta transportadora lleva un paquete 18 m en 6 s; después aumenta su velocidad de 3 a 7 m/s durante 2 s. ¿Qué describen ambos cocientes?',
 'En el primer tramo, rapidez media = 18/6 = 3 m/s: tres metros por segundo en promedio.|En la segunda etapa la velocidad cambia 7 − 3 = 4 m/s en dos segundos. La aceleración media es 4/2 = 2 m/s².|No confundimos los dos por segundo cuadrado con la rapidez final siete. Las fórmulas responden a magnitudes distintas: distancia por tiempo y cambio de velocidad por tiempo.',
 'Pregunta si se pide cuánto avanza por tiempo o cuánto cambia su velocidad por tiempo, define los datos y comprueba las unidades.');
 lesson('Fuerza neta y masa',
 'La fuerza neta es la suma vectorial de las fuerzas: sus direcciones importan. La segunda ley de Newton relaciona esa resultante con masa y aceleración, F neta = ma. Un newton equivale a kg·m/s².|Velocidad constante implica aceleración cero y, por tanto, fuerza neta cero; no ausencia de todas las fuerzas. El peso es fuerza gravitatoria, P = mg, y se mide en N; la masa se mide en kg. El roce puede aportar una fuerza opuesta al movimiento.',
 'Imagina dos equipos tirando de una cuerda. Si tiran igual en direcciones opuestas, sus aportes se equilibran, aunque ambos sigan haciendo fuerza.|Moverse no exige una resultante hacia adelante en todo instante. La resultante indica cómo cambia la velocidad, no simplemente hacia dónde se mueve el objeto.',
 'Un carro de 4 kg recibe 14 N hacia la derecha y 6 N hacia la izquierda. ¿Qué aceleración tiene y qué pasaría si ambas fuerzas fueran iguales?',
 'Elegimos derecha positiva: fuerza neta = 14 − 6 = 8 N.|De F = ma despejamos a = F/m = 8/4 = 2 m/s² hacia la derecha.|Si ambas fuerzas se igualaran, la resultante y aceleración serían cero. El carro podría seguir moviéndose con velocidad constante: equilibrio no exige reposo.',
 'Suma fuerzas con sus direcciones, despeja la magnitud pedida y distingue equilibrio de reposo y masa de peso.');
 lesson('Placas tectónicas',
 'La litosfera es una capa rígida formada por corteza y parte superior del manto, dividida en placas. El manto subyacente es principalmente sólido y puede deformarse lentamente: no es un océano global de magma sobre el que flotan las placas.|En límites convergentes pueden acumularse tensiones y producirse subducción; su liberación en fallas genera ondas sísmicas. El agua liberada por la placa subducida favorece fusión parcial de rocas del manto y magmatismo. En límites divergentes las placas se separan y puede formarse corteza oceánica nueva.',
 'Imagina piezas rígidas que se desplazan lentamente, se traban y liberan de golpe parte de su deformación. El movimiento lento y la ruptura rápida son escalas distintas del mismo sistema.|Los bordes pueden acercarse, separarse o deslizarse. La consecuencia depende de esa relación, no de una fecha del calendario ni del movimiento cotidiano de nubes.',
 'Un mapa muestra sismos alineados con profundidad creciente desde una fosa hacia un continente. ¿Qué modelo puede explicar ese patrón?',
 'La distribución no es uniforme: forma una zona inclinada bajo el continente.|Una placa que desciende por subducción permite relacionar profundidad de sismos con una geometría de interacción de placas.|El patrón apoya ese modelo junto con otras evidencias; no permite predecir el día de un terremoto ni afirmar que todo el manto sea líquido.',
 'Vincula observaciones con límites y movimientos relativos, separando respaldo de un modelo de una predicción exacta que los datos no ofrecen.');
 lesson('Corriente y ley de Ohm',
 'La corriente I mide carga que atraviesa una sección por tiempo, en amperes. El voltaje V es diferencia de energía eléctrica por carga, en volts; la resistencia R relaciona voltaje y corriente en ohms.|Para un resistor óhmico bajo condiciones constantes, V = IR. Si buscas corriente divides voltaje por resistencia: I = V/R. La fuente y el circuito cerrado permiten un flujo sostenido; un cable abierto no completa ese recorrido.',
 'Piensa en un recorrido de agua cerrado como analogía limitada: un impulso disponible, una oposición al paso y un caudal representan magnitudes diferentes.|No confundas la fuerza que impulsa el flujo con cuánto pasa cada segundo. Tampoco basta tener fuente si el camino está cortado.',
 'Un resistor ideal de 8 Ω se conecta a 24 V. ¿Cuál es la corriente y cómo cambia si la resistencia se duplica con igual voltaje?',
 'La relación es V = IR. Despejamos I = V/R = 24/8 = 3 A.|Con 16 Ω y los mismos 24 V, I = 24/16 = 1,5 A: la corriente se reduce a la mitad.|Comprobamos 3 A × 8 Ω = 24 V. Sumar voltios y ohmios o multiplicarlos para obtener amperes no conserva las unidades de la relación.',
 'Define voltaje, corriente y resistencia, despeja antes de sustituir y comprueba que I por R recupere el voltaje.');
 lesson('Resistencias en serie y paralelo',
 'En serie hay una trayectoria sucesiva: circula la misma corriente y las caídas de voltaje se suman. La resistencia equivalente es R₁ + R₂ + …; abrir la única trayectoria corta la corriente.|En paralelo las ramas conectan los mismos dos puntos y comparten voltaje. Sus corrientes se suman y 1/R equivalente = 1/R₁ + 1/R₂ + …. Con resistencias positivas, la equivalente paralela es menor que la menor rama. En un circuito mixto se reduce primero cada bloque identificable.',
 'Una sola ruta con dos tramos difíciles se parece a la serie: agregas oposición. Dos rutas alternativas para pasar se parecen al paralelo: facilitan el paso total.|Dibuja caminos y sus puntos de unión antes de elegir la regla. Que dos resistencias aparezcan juntas en un dibujo no basta para saber cómo están conectadas.',
 'Un resistor de 2 Ω está en serie con un bloque de dos ramas de 8 Ω y 8 Ω. ¿Cuál es la equivalente?',
 'Las dos ramas iguales están en paralelo: 1/R = 1/8 + 1/8 = 2/8, así que R = 4 Ω.|El bloque de cuatro está en la única ruta junto al resistor de dos: total 2 + 4 = 6 Ω.|Ocho más ocho más dos daría dieciocho y trataría todas como serie. Calcular solo cuatro omitiría el tramo de dos. La reducción conserva la conexión, no solo los números.',
 'Reconoce trayectorias y terminales comunes, reduce cada bloque y comprueba si la equivalente debe aumentar o disminuir.');
 lesson('Potencia y energía',
 'La potencia mide rapidez de transferencia de energía: P = E/Δt, en watts, donde 1 W = 1 J/s. La energía consumida a potencia constante es E = PΔt; watt-hora es energía, no potencia.|En un dispositivo eléctrico, P = VI en las condiciones de la pregunta. La eficiencia es energía útil/energía recibida × 100: el resto no desaparece, se transforma en formas no aprovechadas. Trabajo mecánico es transferencia por fuerza y desplazamiento; levantar a velocidad constante contra gravedad requiere W = mgh.',
 'Piensa en llenar un balde: el caudal se parece a potencia y el agua acumulada a energía. Dos horas al mismo caudal acumulan el doble, no la mitad.|Una máquina recibe un presupuesto de energía y entrega solo parte como servicio útil. La parte no útil puede calentar el entorno; no es energía destruida.',
 'Un motor recibe 60 W durante 30 s y entrega 1.200 J como trabajo útil. ¿Qué energía recibe y cuál es su eficiencia?',
 'Recibe E = PΔt = 60 × 30 = 1.800 J. No dividimos por tiempo porque estamos acumulando energía.|La eficiencia es 1.200/1.800 × 100 ≈ 66,7%. Quedan 600 J en otras transferencias, por ejemplo calor.|La potencia útil media sería 1.200/30 = 40 W, distinta de los 60 W recibidos. Esa separación verifica qué magnitud representa cada dato.',
 'Distingue energía de energía por tiempo, identifica entrada y salida útil y utiliza unidades compatibles antes de calcular.');
 lesson('Materia y transformaciones',
 'Una sustancia pura tiene composición química definida. Una mezcla contiene más de una sustancia; homogénea significa composición uniforme a la escala considerada y una fase observable, sin que los componentes dejen de existir.|Un cambio físico modifica estado o distribución sin formar nuevas sustancias; uno químico reorganiza átomos en otras sustancias. En una reacción ordinaria los elementos se conservan y, en un sistema cerrado a la materia, la masa total se conserva dentro de la aproximación química escolar.',
 'Disolver azúcar es como repartir piezas entre espacios: dejan de verse los granos pero no por eso el azúcar se convierte en agua. Fundir hielo cambia cómo está organizada la misma sustancia.|Quemar o reaccionar es reordenar las piezas para construir sustancias diferentes, sin inventar átomos nuevos. La frontera del recipiente determina si parte de esas piezas escapó.',
 'Una botella cerrada contiene agua líquida y hielo de agua pura. El hielo se derrite. ¿Se vuelve una mezcla de dos sustancias y cambia la masa total?',
 'Hielo y líquido son dos estados de la misma sustancia H₂O, no dos componentes químicos distintos.|La fusión es un cambio físico: no cambia la fórmula de las moléculas.|La botella cerrada no deja escapar materia y la masa total se conserva. La presencia inicial de dos fases no basta para clasificar algo como mezcla de dos sustancias.',
 'Separa número de sustancias, número de fases y tipo de transformación; decide qué se conserva antes de clasificar.');
 lesson('Separación de mezclas',
 'Separar una mezcla aprovecha propiedades físicas distintas sin convertir necesariamente sus componentes en nuevas sustancias. Filtrar retiene un sólido insoluble en una barrera porosa; tamizar clasifica sólidos de distinto tamaño con una malla.|Decantar separa fases por su disposición y densidad, como líquidos inmiscibles. Destilar vaporiza y condensa según volatilidad. En cromatografía los componentes avanzan de forma distinta por sus interacciones con una fase móvil y una estacionaria.',
 'Piensa en elegir herramientas según la diferencia que buscas: una malla reconoce tamaño, no volatilidad; un embudo de separación retira capas que ya están diferenciadas.|No basta con que una técnica pueda ayudar en algún momento: debe corresponder al mecanismo descrito. Un filtro corriente no retiene sal disuelta como si fueran piedras.',
 'Una mezcla contiene limaduras de hierro, agua y sal disuelta. ¿Por qué filtrar no basta para recuperar toda la sal como sólido?',
 'Un filtro adecuado puede retener partículas sólidas insolubles, como las limaduras, mientras pasa la disolución de agua y sal.|La sal disuelta acompaña al agua a través de un filtro corriente: ya no está como grandes granos que la barrera retenga.|Para obtener sal sólida habría que retirar solvente mediante otro proceso, por ejemplo evaporación. Identificar el estado y la propiedad permite escoger cada etapa.',
 'Describe qué propiedad diferencia componentes y qué hace exactamente la técnica, evitando elegirla solo por recordar su nombre.');
 lesson('Estructura atómica',
 'El núcleo contiene protones positivos y neutrones sin carga neta; los electrones tienen carga negativa. El número atómico Z cuenta protones y define el elemento. El número másico A cuenta protones más neutrones: N = A − Z.|Un átomo neutro tiene igual número de protones y electrones. Ganar o perder electrones cambia la carga y forma un ion, sin cambiar el elemento; variar neutrones produce isótopos. Los electrones de valencia son los del nivel externo ocupado en el modelo simplificado.',
 'Imagina una ficha con casilleros separados: identidad, masa nuclear y carga. Cambiar un electrón altera la carga; cambiar un neutrón no altera el número de protones que define la identidad.|No todos los números de una ficha cuentan lo mismo. Primero pregunta si el dato se refiere a protones, nucleones o electrones externos.',
 'Un átomo con Z = 8 y A = 18 gana dos electrones. ¿Cuántos protones, neutrones y electrones tendrá y cambió de elemento?',
 'Z fija ocho protones. Los neutrones son A − Z = 18 − 8 = 10.|Neutro tenía ocho electrones; al ganar dos queda con diez y carga neta −2.|Sigue siendo el mismo elemento porque conserva ocho protones. El cambio de electrones produjo un anión, no otro elemento ni un cambio de número másico.',
 'Cuenta por separado protones, neutrones y electrones y comprueba qué cantidad define identidad, número másico y carga.');
 lesson('Carbono y enlaces',
 'El carbono tiene cuatro electrones de valencia y en muchos compuestos completa cuatro unidades de enlace covalente compartiendo pares de electrones. Un enlace simple comparte un par, uno doble dos y uno triple tres.|Un hidrocarburo contiene solo carbono e hidrógeno. Los alcanos acíclicos tienen enlaces simples y fórmula CₙH₂ₙ₊₂; alquenos contienen C=C y alquinos C≡C. La geometría tetraédrica del metano se describe con cuatro orbitales sp³ en el modelo de hibridación.',
 'Piensa en cuatro posibilidades de conexión alrededor de un carbono: un doble enlace utiliza dos y un triple tres. No se trata siempre de cuatro vecinos diferentes.|Para clasificar, revisa primero qué elementos existen y después cómo se conectan. Que haya carbono no basta para llamar hidrocarburo a una molécula que también tiene oxígeno.',
 'Compara CH₃−CH₂−CH₂−CH₃ y CH₂=CH−CH₂−CH₃. ¿Qué tienen en común y qué familia distingue cada estructura?',
 'Ambas solo contienen carbono e hidrógeno: son hidrocarburos de cuatro carbonos.|La primera tiene enlaces C−C simples y al contar H se obtiene 3 + 2 + 2 + 3 = 10, coherente con C₄H₁₀. Es butano, un alcano acíclico.|La segunda contiene un doble enlace y suma 2 + 1 + 2 + 3 = 8 hidrógenos, C₄H₈: es un alqueno. Contar enlaces e hidrógenos verifica la clasificación.',
 'Revisa composición, tipo de enlaces y conteo de valencias; no clasifiques solo por el número de carbonos.');
 lesson('Grupos funcionales orgánicos',
 'Un grupo funcional es un conjunto de átomos y enlaces que ayuda a reconocer una familia y su comportamiento químico. Debe leerse completo: un alcohol simple tiene −OH unido a carbono saturado; un ácido carboxílico tiene −C(=O)OH, escrito −COOH.|El carbonilo C=O aparece en aldehídos terminales −CHO y cetonas entre carbonos. Un éter tiene C−O−C sin carbonilo adyacente; un éster tiene −C(=O)−O−C. Ver un oxígeno aislado no basta para distinguir estas familias.',
 'Es como reconocer una palabra completa y no una sola letra. Dos grupos pueden contener OH, pero el entorno cambia su significado químico.|Rodea mentalmente los átomos unidos al oxígeno y mira si hay un doble enlace a oxígeno cercano. Esa pequeña inspección evita confundir alcohol, ácido, éter y éster.',
 'Compara CH₃−CH₂−CH₂−OH con CH₃−CH₂−COOH. ¿Por qué no son ambos alcoholes aunque contengan OH?',
 'En la primera estructura el OH está unido a un carbono saturado sin carbonilo en ese grupo: es un alcohol.|En la segunda, el OH forma parte de −C(=O)OH. Ese grupo completo es carboxilo y corresponde a un ácido carboxílico.|Nombrar ambas solo por OH perdería el doble enlace C=O y cambiaría la familia. La clasificación utiliza la conectividad, no solo la lista de elementos.',
 'Identifica el grupo completo y el entorno de sus enlaces antes de elegir una familia orgánica.');
 lesson('Balance y proporción molar',
 'Una ecuación química balanceada conserva el número de átomos de cada elemento. Los coeficientes delante de las fórmulas multiplican moléculas o moles; los subíndices dentro de la fórmula definen la sustancia y no se cambian para balancear.|Los coeficientes dan proporciones de cantidad de sustancia, no masas iguales de todos los reactivos. Para predecir producto usamos la razón de coeficientes y comprobamos qué reactivo se agota primero; el otro puede quedar en exceso.',
 'Imagina armar bicicletas: cada bicicleta necesita dos ruedas y un marco. La receta indica proporciones de piezas, no que ruedas y marcos tengan igual peso.|Si falta una pieza, no puedes seguir armando aunque sobren otras. Cambiar el número de ruedas de cada bicicleta para que alcance el stock sería cambiar el producto, no balancear la receta.',
 'En N₂ + 3H₂ → 2NH₃ hay 2 mol de N₂ y 3 mol de H₂. ¿Cuánto amoníaco puede formarse idealmente?',
 'La ecuación cuenta dos átomos de N y seis de H en cada lado: conserva ambos elementos.|Tres mol de H₂ requieren un mol de N₂ y forman dos mol de NH₃. Con dos mol de N₂ disponibles sobra un mol, pero el H₂ se agota.|Se forman como máximo dos mol de NH₃ bajo este modelo. No usamos todo el nitrógeno porque falta hidrógeno en la proporción de la receta.',
 'Balancea átomos, usa coeficientes como razones molares y revisa disponibilidad antes de extrapolar cantidades.');
 lesson('Mol y masa molar',
 'El mol es una unidad para contar entidades: un mol contiene aproximadamente 6,022 × 10²³ entidades especificadas. La masa molar M indica cuántos gramos pesa un mol de una sustancia, en g/mol.|Si una muestra tiene masa m, su cantidad de sustancia es n = m/M. Dividir gramos por gramos por mol deja moles. Una fórmula empírica describe la proporción entera mínima de átomos y se obtiene de razones molares, no directamente de porcentajes de masa.',
 'Piensa en contar por docenas: si sabes cuánto pesa una docena y el peso del lote, puedes averiguar cuántas docenas hay. El mol es un paquete de conteo mucho mayor, no una masa fija universal.|Dos sustancias pueden tener un mol cada una y masas distintas porque sus partículas pesan distinto. No intercambies gramos y moles.',
 'Una sustancia tiene masa molar 44 g/mol. Se dispone de 22 g. ¿Cuántos moles hay y cuánta masa correspondería a tres moles?',
 'Cada mol pesa cuarenta y cuatro gramos. Veintidós es la mitad: n = 22/44 = 0,5 mol.|Para tres moles hacemos el camino inverso: m = nM = 3 × 44 = 132 g.|Comprobamos 0,5 × 44 = 22. Multiplicar 22 por 44 no contaría paquetes; produciría unidades equivocadas para n.',
 'Identifica si conviertes masa a moles o moles a masa y utiliza las unidades para decidir división o multiplicación.');
 lesson('Concentración y dilución',
 'Concentración compara cantidad de soluto con una cantidad definida de solución o solvente. % m/v significa gramos de soluto por 100 mL de solución; % m/m significa gramos por 100 g de solución. La masa de solución suma soluto y solvente.|Molaridad es moles de soluto por litro de solución. Diluir agrega solvente sin perder soluto: la cantidad de soluto se conserva y su concentración disminuye al aumentar el volumen. Para mezclar soluciones se suman cantidades de soluto y luego se divide por el volumen final que corresponda.',
 'Imagina repartir la misma cucharada de azúcar en un vaso más grande: queda la misma cantidad de azúcar, pero menos en cada sorbo de igual tamaño.|El denominador importa tanto como el numerador. Decir gramos por agua no es igual a gramos por toda la solución, y litros no son kilogramos.',
 'Una preparación contiene 6 g de soluto y se completa a 150 mL de solución. Después se agrega solvente hasta 300 mL. ¿Cómo cambia su % m/v?',
 'Primero calculamos gramos por cien mL: (6/150) × 100 = 4% m/v.|Tras diluir siguen presentes los seis gramos, pero en trescientos mL: (6/300) × 100 = 2% m/v.|Duplicar el volumen redujo a la mitad la concentración. No desapareció la mitad del soluto: cambió la cantidad de solución usada como base de comparación.',
 'Nombra el numerador y denominador con unidades y conserva la cantidad de soluto cuando solo se agrega solvente.');
 function row(n,key,reason,check){rows[n]={key,reason,check};}
 row(1,'Respiración celular y ATP','La contracción requiere energía transferida mediante ATP. Una célula con alta demanda necesita sostener su reposición, además de fabricar proteínas y regular calcio.','Mitocondrias responde a la provisión de ATP; el retículo muscular regula calcio y los ribosomas fabrican proteínas, funciones distintas.');
 row(2,'Membrana y ósmosis','El intercambio pedido es entre toda la célula y su ambiente. La envoltura nuclear delimita otro compartimento y la pared no sustituye a los transportadores selectivos.','La membrana plasmática es el límite selectivo del exterior celular.');
 row(3,'Fabricación y destino de proteínas','El enunciado sitúa la proteína después del retículo: ya no pregunta por ensamblar la cadena, sino por clasificar y empaquetar su destino.','Golgi corresponde a procesamiento y distribución; no confundimos ese paso con traducción ni digestión lisosomal.');
 row(4,'Sinapsis química','El impulso eléctrico llega por la membrana de la neurona. La hendidura entre células se cruza mediante mensajeros liberados, no por vesículas completas ni por receptores que viajen.','En una sinapsis química atraviesan el espacio neurotransmisores; la especificación química evita confundirla con sinapsis eléctricas.');
 row(5,'Circuito reflejo y señal nerviosa','Un recorrido integrado localmente puede activar respuesta antes de deliberar. La señal sigue una vía nerviosa y no requiere esperar una cadena hormonal o análisis cortical previo.','La ventaja es rapidez de respuesta; no significa ausencia de procesamiento nervioso ni que el encéfalo deje de recibir información.');
 row(6,'Prevención y mecanismos anticonceptivos','La alternativa válida identifica mecanismo físico y disminución de riesgo, sin convertirla en una garantía universal. El preservativo no controla el ciclo menstrual.','Es una barrera que puede reducir riesgo de ITS con uso correcto y consistente; no protección absoluta ni una medida que actúe solo después del contacto.');
 row(7,'Mitosis y control del ciclo','La replicación previa permite repartir copias de la dotación. La pregunta cuenta cromosomas de cada hija, no la cantidad transitoria de ADN antes del reparto.','Normalmente cada hija conserva la dotación de la madre; reducirla a la mitad sería confundirla con meiosis.');
 row(8,'Meiosis y recombinación','Intercambiar segmentos y distribuir homólogos de formas distintas permite nuevas combinaciones en gametos. El mecanismo no depende de eliminar genes dominantes.','Recombinación y distribución cromosómica explican variabilidad; no garantizan gametos idénticos.');
 row(9,'Selección natural y evidencia','La resistencia ya es heredable en algunos individuos. Bajo insecticida estos pueden dejar proporcionalmente más descendencia y la población cambia en generaciones.','Puede aumentar su frecuencia sin que todos los individuos se transformen ni que el insecticida cree la mutación que cada uno necesita.');
 row(10,'Fotosíntesis y ciclo del carbono','La pregunta pide la fuente directa del gas O₂, no el carbono que se incorpora a materia orgánica. Las reacciones luminosas separan agua y liberan ese oxígeno.','El O₂ liberado procede directamente del agua; CO₂ participa en fijación de carbono y no es la fuente directa de ese gas.');
 row(11,'Redes tróficas y energía','Cada nivel utiliza energía para vivir y parte se dispersa como calor. El siguiente no recibe toda la energía que entró al anterior.','La energía disponible disminuye en transferencias; los nutrientes pueden reciclarse, pero no toda esa energía utilizable.');
 row(12,'Diseño y evidencia experimental','La decisión del equipo es variar luz. Agua, temperatura y suelo quedan comparables; biomasa final sería un resultado, no el tratamiento.','La intensidad lumínica es independiente porque se manipula; llamar independiente al resultado invierte los papeles.');
 row(13,'Frecuencia y longitud de onda','Una longitud λ en metros por cada ciclo, multiplicada por f ciclos por segundo, produce metros por segundo. Esa relación describe rapidez.','c = λf conserva unidades de rapidez; sumar λ y f o dividirlas no representa la misma magnitud.');
 row(14,'Frecuencia y longitud de onda','En vacío c no cambia. Despejamos λ = c/f: aumentar el denominador con numerador fijo reduce el cociente.','La longitud disminuye al aumentar frecuencia; rapidez constante no significa que ambas magnitudes queden constantes.');
 row(15,'Reflexión y refracción','El rayo cruza de aire a vidrio en lugar de volver al aire. Al propagarse con distinta rapidez puede desviarse en incidencia oblicua.','Cruzar y desviarse entre medios es refracción; reflexión vuelve al medio de origen.');
 row(16,'Rapidez y aceleración','Repartimos los 120 metros entre veinte segundos para saber cuántos corresponden a cada segundo: 120/20 = 6.','6 m/s significa seis metros por segundo. Aquí además se indica rapidez constante; el cálculo de media por sí solo no probaría esa constancia.');
 row(17,'Fuerza neta y masa','La segunda ley pide producto: F = 2 kg × 3 m/s² = 6 kg·m/s². No se suman masa y aceleración.','La fuerza neta es 6 N; dividir de nuevo 6 N por 2 kg recupera los 3 m/s² dados.');
 row(18,'Fuerza neta y masa','Avanzar a velocidad constante tiene cambio de velocidad nulo: a = 0. Entonces F neta = m × 0 = 0.','La resultante es cero, aunque motor, roce u otras fuerzas puedan existir y equilibrarse.');
 row(19,'Placas tectónicas','Evidencias fósiles y geológicas coincidentes en continentes hoy separados pueden explicarse por una conexión y separación pasadas. Deben estudiarse junto a otras evidencias del modelo.','Los fósiles compartidos apoyan conexión continental; no prueban una fecha exacta de terremotos ni se deducen de las estaciones.');
 row(20,'Placas tectónicas','Los bordes de placas concentran interacciones y acumulación de tensiones que pueden liberarse en fallas. No son líneas sin espesor ni las únicas zonas con sismos.','Gran parte de la sismicidad tectónica está en límites; esto no afirma que todos los terremotos ocurran exclusivamente allí.');
 row(21,'Placas tectónicas','El mecanismo requiere deformación y ruptura en la litosfera. Cambios atmosféricos cotidianos no explican la liberación de tensiones tectónicas planteada.','La interacción de placas y fallas explica esos sismos, sin recurrir a lluvia o día y noche como causa principal.');
 row(22,'Corriente y ley de Ohm','De V = IR dividimos ambos lados por R: I = V/R = 12/6 = 2 A.','2 A × 6 Ω = 12 V comprueba el resultado. 6/12 invierte el cociente y 12 × 6 no calcula corriente.');
 row(23,'Resistencias en serie y paralelo','Ambas resistencias están una después de otra en la misma trayectoria, de modo que sus caídas de voltaje se agregan. R equivalente = 3 + 5 = 8 Ω.','Ocho supera a cada resistencia individual, como corresponde a sumarlas en serie.');
 row(24,'Potencia y energía','La potencia es cien watts sostenidos durante dos horas: E = 100 × 2 = 200 Wh. Para kWh dividimos entre mil: 0,2 kWh.','Doscientos Wh es energía; la potencia sigue siendo 100 W. El tiempo está en horas y por eso no se responde 200 J.');
 row(25,'Materia y transformaciones','Sal completamente disuelta y agua son dos sustancias distribuidas uniformemente en una fase. Hielo de agua pura es una sustancia, aunque tenga otro estado.','Agua salada completamente disuelta es mezcla homogénea; hielo puro no es mezcla y aceite con agua presenta fases.');
 row(26,'Separación de mezclas','La barrera porosa retiene el sólido insoluble y deja pasar agua. Esa descripción identifica el mecanismo del filtro, aunque otras técnicas también puedan separar en otras condiciones.','Filtración corresponde al procedimiento descrito; decantar no utiliza esa barrera y evaporar no deja pasar agua líquida por ella.');
 row(27,'Estructura atómica','Z = 11 cuenta once protones. La neutralidad exige once cargas negativas que compensen las once positivas.','Hay once electrones; diez dejarían carga +1 y doce carga −1.');
 row(28,'Estructura atómica','La identidad del elemento la fija Z, igual a cantidad de protones. Neutrones pueden variar dentro del mismo elemento y electrones al formar iones.','Protones define número atómico; ni moléculas ni electrones externos lo sustituyen.');
 row(29,'Carbono y enlaces','Tetravalencia nombra la posibilidad de completar cuatro unidades de enlace covalente. Es una propiedad de su configuración de valencia, no de radiactividad o magnetismo.','El carbono puede compartir electrones para completar cuatro unidades de enlace; no carece de electrones.');
 row(30,'Grupos funcionales orgánicos','En CH₃CH₂OH el OH está unido a un carbono saturado y no forma un carboxilo con carbonilo vecino. Eso corresponde a alcohol.','No hay −COOH, C=O interno ni nitrógeno: las otras familias no coinciden con el grupo presente.');
 row(31,'Carbono y enlaces','Revisamos los elementos, no solo si hay hidrógeno: CH₄ tiene C e H únicamente. CH₃OH añade O, H₂O no tiene C y NaCl no pertenece a esa clase.','Solo CH₄ satisface contener exclusivamente carbono e hidrógeno.');
 row(32,'Carbono y enlaces','El símbolo = une directamente ambos carbonos y representa dos pares compartidos. Un simple usaría una raya y un triple el símbolo ≡.','El enlace entre carbonos es covalente doble; no se trata de transferencia iónica.');
 row(33,'Balance y proporción molar','Con 2H₂ + O₂ → 2H₂O contamos H: 2 × 2 = 4 a la izquierda y 2 × 2 = 4 a la derecha; O: dos a cada lado.','Los coeficientes mínimos 2,1,2 conservan ambos elementos. No cambiamos subíndices de H₂O porque cambiaría la sustancia.');
 row(34,'Mol y masa molar','Cada mol de agua pesa 18 g según el dato. La muestra tiene exactamente esa masa: n = 18 g/(18 g/mol) = 1 mol.','1 mol × 18 g/mol = 18 g comprueba la conversión; dieciocho era masa o masa molar, no cantidad de moles.');
 row(35,'Concentración y dilución','El volumen final de solución es cien mL. Por tanto (10 g/100 mL) × 100 expresa diez gramos por cada cien mL.','La concentración es 10% m/v; no se usó el volumen de agua inicial sino el volumen final de solución indicado.');
 row(36,'Concentración y dilución','Agregar agua aumenta el denominador de cantidad por volumen sin crear soluto. La misma cantidad repartida en mayor solución queda menos concentrada.','Disminuye concentración, mientras la cantidad de soluto permanece y no se vuelve cero instantáneamente.');
 // CONTINUAR_CIENCIAS_PROFESOR
 for(const q of window.SCIENCE_BANK){const r=rows[Number(q.id.slice(4))];if(!r)continue;const base=lessons[r.key],originalSteps=q.steps.slice();
  const application=[...originalSteps,r.reason,r.check];
  const t={revision:'tutor-profesor-2026-10-15',qualityBefore:'básica',quality:'adecuada',aim:'Vamos a identificar el proceso o magnitud que se pide y explicar cómo se obtiene: '+q.question,foundation:base.foundation.slice(),application,check:r.check,intuition:base.intuition.slice(),example:{...base.example,steps:base.example.steps.slice()}};
  q.hint=originalSteps[0];q.concept=r.key;
  q.explanations=q.options.map((o,i)=>i===q.answer?r.check:'Elegiste «'+o+'». '+q.explanations[i]+' '+r.check);
  t.selectedFeedback=q.options.map((_,i)=>i===q.answer?null:{diagnosis:q.explanations[i],repair:application.slice()});
  q.teaching=t;q.steps=[t.aim,...t.foundation,...application];q.easy=[...t.intuition,...application].join('\n\n');q.example=[t.example.problem,...t.example.steps,t.example.bridge].join('\n\n');
 }
})();
