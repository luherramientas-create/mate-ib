const h = (texts) => texts.map((text, index) => ({
  level: index + 1,
  type: ['conceptual', 'interpretation', 'procedural', 'calculator'][index],
  text: String.raw`${text}`,
  display: ['small', 'small', 'support', 'step'][index]
}));

export const QUESTIONS = [
  {
    id: 'P01', title: 'Pregunta 1', topic: 'Función exponencial',
    context: String.raw`La cantidad de un medicamento (en miligramos) presente en el organismo \(t\) horas después de haberlo inyectado viene dada por \(D(t)=23(0.85)^t\), \(t\geq 0\). Antes de esta inyección, la cantidad de medicamento presente en el organismo era cero.`,
    subquestions: [
      { id:'a_i', label:'(a)(i)', prompt:'Escriba la dosis inicial del medicamento.', equation:'D(t)=23(0.85)^t', acceptedAnswers:['23','23.0'], hints:h([
        'Piensa en el momento en que comienza el proceso. ¿Qué valor tiene la variable independiente en ese instante?',
        'El valor inicial se obtiene cuando \\(t=0\\). ¿Qué ocurre con una potencia cuyo exponente es 0?',
        'Sustituye \\(t=0\\): \\(D(0)=23(0.85)^0\\).',
        'En Casio fx-CG50: MENU → 1 (RUN-MAT) e introduce \\(23(0.85)^0\\).'
      ]) },
      { id:'a_ii', label:'(a)(ii)', prompt:'Escriba el porcentaje de medicamento que abandona el organismo cada hora.', equation:'D(t)=23(0.85)^t', acceptedAnswers:['15','15%','0.15'], hints:h([
        'Observa la base \\(0.85\\). Compárala con \\(1\\).',
        'Cada hora permanece el \\(85\\%\\) de la cantidad anterior. ¿Qué porcentaje falta para llegar al \\(100\\%\\)?',
        'Calcula \\(1-0.85=0.15\\) y convierte la parte decimal a porcentaje.',
        'Como \\(0.15=15\\%\\), el porcentaje que abandona el organismo cada hora es \\(15\\%\\).'
      ]) },
      { id:'b', label:'(b)', prompt:'Calcule la cantidad de medicamento que queda en el organismo 10 horas después de la inyección.', equation:'D(t)=23(0.85)^t', acceptedAnswers:['4.53','4.528','4.5281','4.52811'], hints:h([
        '¿Qué valor de la variable independiente conocemos?',
        'Han transcurrido 10 horas. Por tanto, utiliza \\(t=10\\).',
        'Sustituye: \\(D(10)=23(0.85)^{10}\\).',
        'En Casio fx-CG50: MENU → 1 (RUN-MAT) → introduce \\(23(0.85)^{10}\\) y redondea según corresponda.'
      ]) }
    ]
  },
  {
    id: 'P02', title: 'Pregunta 2', topic: 'Modelo exponencial con base e',
    context: String.raw`Natasha lleva a cabo un experimento sobre el crecimiento del moho. Ella cree que el crecimiento se puede modelizar mediante una función exponencial \[P(t)=Ae^{kt},\] donde \(P\) es el área que está cubierta por moho (en \(\mathrm{mm}^2\)), \(t\) es el tiempo (en días) transcurrido desde el inicio del experimento, y \(A\) y \(k\) son constantes. El área cubierta por moho es igual a \(112\,\mathrm{mm}^2\) al inicio del experimento e igual a \(360\,\mathrm{mm}^2\) al cabo de 5 días.`,
    subquestions: [
      { id:'a', label:'(a)', prompt:'Escriba el valor de \(A\).', equation:'P(t)=Ae^{kt}', acceptedAnswers:['112'], hints:h([
        '¿Qué significa "al inicio del experimento" para la variable \(t\)?',
        'Al inicio, \(t=0\). ¿Qué valor toma \(e^0\)?',
        'Sustituye \(t=0\) y el dato inicial en \(P(t)=Ae^{kt}\).',
        'Queda \(112=Ae^{k(0)}=A\). Por tanto, \(A=112\).'
      ]) },
      { id:'b', label:'(b)', prompt:'Halle el valor de \(k\).', equation:'P(t)=Ae^{kt}', acceptedAnswers:['0.234','0.233','0.2340','0.2335'], tolerance:0.002, hints:h([
        'Ya conoces el valor de \(A\). ¿Qué dato corresponde a \(t=5\)?',
        'Usa \(P(5)=360\) y el valor de \(A\) que encontraste.',
        'Forma la ecuación \(112e^{5k}=360\).',
        'En Casio fx-CG50 usa MENU → A → Equation → F3 Solver para resolver \(112e^{5k}=360\).'
      ]) }
    ]
  },
  {
    id: 'P03', title: 'Pregunta 3', topic: 'Crecimiento/decrecimiento y asíntota',
    context: String.raw`El catedrático Vinculum investigó la temporada de migración del ave bulbul, desde los humedales que constituyen su hábitat natural a un clima más templado. Halló que durante la temporada migratoria la población \(P\) de estas aves está modelada por \[P=1350+400(1{,}25)^{-t},\qquad t\geq0,\] donde \(t\) es el número de días transcurridos desde el comienzo de la temporada migratoria.`,
    subquestions: [
      { id:'a_i', label:'(a)(i)', prompt:'Halle la población de bulbules, al inicio de la temporada migratoria.', equation:'P=1350+400(1{,}25)^{-t}', acceptedAnswers:['1750'], hints:h([
        '¿Qué valor de \(t\) representa el inicio de la temporada?',
        'Al inicio, \(t=0\). Sustituye ese valor en el modelo.',
        'Calcula \(P=1350+400(1{,}25)^0\).',
        'En Casio fx-CG50: MENU → 1 (RUN-MAT) → introduce \(1350+400(1.25)^0\).'
      ]) },
      { id:'a_ii', label:'(a)(ii)', prompt:'Halle la población de bulbules, en los humedales cuando han transcurrido 5 días.', equation:'P=1350+400(1{,}25)^{-t}', acceptedAnswers:['1480','1481'], hints:h([
        '¿Qué valor de \(t\) corresponde a 5 días?',
        'Sustituye \(t=5\) en el modelo.',
        'Calcula \(P=1350+400(1{,}25)^{-5}\).',
        'En Casio fx-CG50: MENU → 1 (RUN-MAT) → introduce la expresión completa y redondea al número de aves.'
      ]) },
      { id:'b', label:'(b)', prompt:'Calcule el tiempo que tarda la población en descender por debajo de los 1400 ejemplares.', equation:'1400=1350+400(1{,}25)^{-t}', acceptedAnswers:['9.32','9.31885','9.3'], tolerance:0.03, hints:h([
        'La frase "descender por debajo de 1400" indica que debes comparar la población con 1400.',
        'Primero encuentra cuándo \(P=1400\).',
        'Forma \(1400=1350+400(1{,}25)^{-t}\).',
        'En Casio: MENU → A → Equation → F3 Solver. Resuelve para \(t\) y luego interpreta el resultado en días.'
      ]) },
      { id:'c', label:'(c)', prompt:'Conforme a este modelo, halle cuál es el valor mínimo de la población de bulbules durante la temporada migratoria.', equation:'P=1350+400(1{,}25)^{-t}', acceptedAnswers:['1350','1351'], hints:h([
        'Observa qué ocurre con la parte exponencial cuando \(t\) aumenta.',
        '¿A qué valor se acerca \(400(1{,}25)^{-t}\)?',
        'La gráfica tiene una asíntota horizontal en \(P=1350\).',
        'Por tanto, según el modelo, el valor mínimo al que se aproxima la población es \(1350\).'
      ]) }
    ]
  },
  {
    id: 'P04', title: 'Pregunta 4', topic: 'Modelos exponenciales y conversión de tiempo',
    context: String.raw`Una científica está realizando un experimento sobre el crecimiento de una determinada especie de bacteria. La población \(P\) de estas bacterias se puede modelizar mediante la función \[P(t)=1200\times k^t,\qquad t\geq0,\] donde \(t\) es el número de horas que han transcurrido desde que empezó el experimento y \(k\) es una constante positiva. 3 horas después de que empezara el experimento, la población de estas bacterias era igual a \(18750\). La científica realiza un segundo experimento con una especie diferente de bacterias. La población \(S\) de estas bacterias se puede modelizar mediante la función \[S(t)=5000\times1{,}65^t,\qquad t\geq0,\] donde \(t\) es el número de horas que han transcurrido desde que empezaron los dos experimentos.`,
    subquestions: [
      { id:'a_i', label:'(a)(i)', prompt:'Escribe el valor de \(P(0)\).', equation:'P(t)=1200\times k^t', acceptedAnswers:['1200'], hints:h([
        '¿Qué valor de \(t\) representa el inicio del experimento?',
        'Sustituye \(t=0\). ¿Qué valor tiene \(k^0\)?',
        'Calcula \(P(0)=1200\times k^0\).',
        'Por tanto, \(P(0)=1200\).'
      ]) },
      { id:'a_ii', label:'(a)(ii)', prompt:'Interprete lo que significa este valor en este contexto.', equation:'P(0)=1200', acceptedAnswers:['la población inicial de bacterias','la poblacion inicial de bacterias','población inicial de bacterias','poblacion inicial','1200 es la población inicial','1200 es la poblacion inicial'], conceptualKeywords:['poblacion','inicial','bacterias'], hints:h([
        '¿Qué representa \(P(t)\) en el problema?',
        'El valor se obtuvo cuando \(t=0\). ¿Qué momento representa?',
        'Relaciona \(P(0)\) con la población y el inicio del experimento.',
        'La respuesta debe indicar que 1200 es la población inicial de bacterias.'
      ]) },
      { id:'b', label:'(b)', prompt:'Halle el valor de \(k\).', equation:'1200\times k^3=18750', acceptedAnswers:['2.5','2.50'], hints:h([
        'Conoces una población después de 3 horas. ¿Qué valor de \(t\) debes usar?',
        'Sustituye \(P(3)=18750\) en el modelo.',
        'Forma la ecuación \(1200k^3=18750\).',
        'En Casio: MENU → A → Equation → F3 Solver para resolver \(1200k^3=18750\).'
      ]) },
      { id:'c', label:'(c)', prompt:'Halle cuál era la población de bacterias 1 hora y 30 minutos después de que empezara el experimento.', equation:'P(t)=1200\times2.5^t', acceptedAnswers:['4740','4743.41','4743.4'], tolerance:0.02, hints:h([
        'El modelo utiliza horas. ¿Cómo expresas 1 hora y 30 minutos en horas?',
        'Convierte los 30 minutos a horas: \(30\div60\).',
        'Entonces \(t=1.5\) y debes calcular \(P(1.5)=1200(2.5)^{1.5}\).',
        'En Casio: MENU → 1 (RUN-MAT) → introduce \(1200(2.5)^{1.5}\). La respuesta es aproximadamente \(4740\) bacterias.'
      ]) },
      { id:'d', label:'(d)', prompt:'Halle el valor de \(t\) cuando las dos poblaciones de bacterias son iguales.', equation:'P(t)=1200\times2.5^t,\qquad S(t)=5000\times1.65^t', acceptedAnswers:['3.43','3.43456','3.434'], tolerance:0.01, hints:h([
        'Si las poblaciones son iguales, ¿qué relación debe cumplirse entre \(P(t)\) y \(S(t)\)?',
        'Iguala los dos modelos.',
        'Forma \(1200(2.5)^t=5000(1.65)^t\).',
        'En Casio: MENU → A → Equation → F3 Solver y resuelve para \(t\). El resultado es aproximadamente \(3.43\) horas.'
      ]) },
      { id:'e', label:'(e)', prompt:'Halle el valor de \(m\); dé la respuesta como un número entero.', equation:'S(t)=5000\times1.65^t', acceptedAnswers:['40','40.0'], exact:true, hints:h([
        'El tiempo total es 2 horas más una cantidad de minutos. ¿En qué unidad está expresado \(t\)?',
        'Primero encuentra el tiempo total en horas usando \(S(t)=19000\).',
        'Resuelve \(5000(1.65)^t=19000\). Luego separa la parte entera de las horas y convierte la parte decimal a minutos multiplicando por 60.',
        'La calculadora da \(t\approx2.66586\). Entonces \(0.66586\times60\approx39.95\), por lo que \(m=40\) minutos.'
      ]) },
      { id:'f', label:'(f)', prompt:'Determine cuánto tiempo tardarán las bacterias en llenar el recipiente.', equation:'S(t)=5000\times1.65^t', acceptedAnswers:['44.2','44.24','44.2480'], tolerance:0.05, hints:h([
        'Primero determina cuántas bacterias se necesitan para llenar el recipiente.',
        'Cada bacteria ocupa \(1\times10^{-18}\,\mathrm{m}^3\) y el recipiente tiene \(2.1\times10^{-5}\,\mathrm{m}^3\).',
        'Calcula \((2.1\times10^{-5})/(1\times10^{-18})\) y usa ese número como valor de \(S(t)\).',
        'En Casio: MENU → A → Equation → F3 Solver con \(S(t)\) igual al número necesario de bacterias. Obtendrás aproximadamente \(44.2\) horas.'
      ]) }
    ]
  },
  {
    id: 'P05', title: 'Pregunta 5', topic: 'Modelo con asíntota y validación',
    context: String.raw`Diego es un profesor de ese colegio. Cree que el número de alumnos \(n\) que ha tenido gripe en los \(t\) primeros días del curso escolar se puede modelizar mediante la función \[n(t)=250-240(2)^ {kt},\qquad k\in\mathbb{R}.\] Se sabe que en los 10 primeros días del curso escolar, hubo 130 alumnos que tuvieron gripe. Cuando llega el último día del curso escolar, se sabe que hay 300 alumnos que han tenido gripe.`,
    subquestions: [
      { id:'d', label:'(d)', prompt:'Utilice el modelo de Diego para calcular el número de alumnos que empezaron el curso escolar con gripe.', equation:'n(t)=250-240(2)^{kt}', acceptedAnswers:['10'], hints:h([
        '¿Qué valor de \(t\) representa el inicio del curso escolar?',
        'Al inicio, \(t=0\). Sustituye ese valor en el modelo.',
        'Calcula \(n(0)=250-240(2)^{k(0)}\).',
        'Como \(2^0=1\), queda \(n(0)=250-240=10\) alumnos.'
      ]) },
      { id:'e', label:'(e)', prompt:'Halle el valor de \(k\).', equation:'n(t)=250-240(2)^{kt}', acceptedAnswers:['-0.1','−0.1'], tolerance:0.001, hints:h([
        'Ahora conoces que a los 10 días había 130 alumnos. ¿Qué valor de \(t\) debes usar?',
        'Sustituye \(n(10)=130\).',
        'Forma \(130=250-240(2)^{10k}\).',
        'En Casio: MENU → A → Equation → F3 Solver para resolver \(130=250-240(2)^{10k}\). Obtendrás \(k=-0.1\).'
      ]) },
      { id:'f', label:'(f)', prompt:'Utilizando este modelo, calcule cuántos días transcurrirán desde el inicio del curso escolar hasta que haya 200 alumnos que hayan tenido gripe.', equation:'n(t)=250-240(2)^{-0.1t}', acceptedAnswers:['22.6','22.6303','23'], tolerance:0.03, hints:h([
        'Ahora ya conoces \(k\). ¿Qué valor de \(n\) debes alcanzar?',
        'Iguala el modelo a 200.',
        'Forma \(200=250-240(2)^{-0.1t}\).',
        'En Casio: MENU → A → Equation → F3 Solver. Obtendrás \(t\approx22.6\) días; si se necesita un número entero de días, son 23 días.'
      ]) },
      { id:'g', label:'(g)', prompt:'Comente lo adecuado que resulta el modelo de Diego.', equation:'n(t)=250-240(2)^{-0.1t}', acceptedAnswers:['el modelo no predice que n llegue a 300','el modelo no predice que n llegue a 300 alumnos','el modelo no es apropiado','no es apropiado','el modelo no alcanza 300'], hints:h([
        'Observa el número 250 en el modelo. ¿Qué papel puede desempeñar?',
        'La función tiene una asíntota horizontal. ¿Puede \(n(t)\) superar 250?',
        'Compara el comportamiento del modelo con el dato de 300 alumnos al final del curso.',
        'El modelo no predice que \(n\) alcance 300; se aproxima a 250. Por ello, el modelo de Diego no es adecuado.'
      ]) }
    ]
  },
  {
    id: 'P06', title: 'Pregunta 6', topic: 'Asíntota e inversa',
    context: String.raw`Celeste calentó una taza de café y luego dejó que se enfriase hasta que alcanzó la temperatura ambiente. Celeste averiguó que la temperatura del café \(T\), medida en \(^\circ\mathrm{C}\), se podía modelizar mediante la siguiente función: \[T(t)=71e^{-0{,}0514t}+23,\qquad t\geq0,\] donde \(t\) es el tiempo (en minutos) transcurrido desde que el café empezó a enfriarse.`,
    subquestions: [
      { id:'a', label:'(a)', prompt:'Halle la temperatura del café transcurridos 16 minutos desde que empezó a enfriarse.', equation:'T(t)=71e^{-0.0514t}+23', acceptedAnswers:['54.2','54.1956'], tolerance:0.02, hints:h([
        '¿Qué valor de \(t\) corresponde a 16 minutos?',
        'Sustituye \(t=16\) en la función.',
        'Calcula \(T(16)=71e^{-0.0514(16)}+23\).',
        'En Casio: MENU → 1 (RUN-MAT) → introduce la expresión y obtén aproximadamente \(54.2\,^{\circ}\mathrm{C}\).'
      ]) },
      { id:'b', label:'(b)', prompt:'Escriba la ecuación de la asíntota horizontal.', equation:'T(t)=71e^{-0.0514t}+23', acceptedAnswers:['T=23','y=23','T(t)=23'], hints:h([
        'En un modelo de la forma \(k\cdot a^t+c\), ¿qué término determina la asíntota horizontal?',
        'Observa el término constante \(+23\).',
        'Cuando \(t\) aumenta, el término exponencial se acerca a 0.',
        'Por tanto, la asíntota horizontal es \(T=23\).'
      ]) },
      { id:'c', label:'(c)', prompt:'Escriba la temperatura ambiente.', equation:'T=23', acceptedAnswers:['23','23°C','23 C'], hints:h([
        'La temperatura ambiente corresponde al valor al que se aproxima el café.',
        '¿Qué relación existe entre la temperatura ambiente y la asíntota horizontal?',
        'Usa el resultado del apartado (b).',
        'La temperatura ambiente es \(23\,^{\circ}\mathrm{C}\).'
      ]) },
      { id:'d', label:'(d)', prompt:'Sabiendo que \(T^{-1}(50)=k\), halle el valor de \(k\).', equation:'50=71e^{-0.0514k}+23', acceptedAnswers:['18.8','18.8101'], tolerance:0.03, hints:h([
        'Si \(T^{-1}(50)=k\), ¿qué significa esto en términos de la función original?',
        'Busca el tiempo \(t\) para el cual la temperatura es 50 °C.',
        'Forma \(50=71e^{-0.0514k}+23\).',
        'En Casio: MENU → A → Equation → F3 Solver para encontrar \(k\). El resultado es aproximadamente \(18.8\) minutos.'
      ]) }
    ]
  },
  {
    id: 'P07', title: 'Pregunta 7', topic: 'Decaimiento radiactivo',
    context: String.raw`El carbono radioactivo es un material que se desintegra con el tiempo. La masa \(m(t)\), en nanogramos, de carbono radioactivo que contiene el fósil de una planta, cuando han transcurrido \(t\) años, se puede modelizar mediante la función \[m(t)=120e^{-0{,}000121t},\] donde \(t\) es el tiempo transcurrido desde que la planta murió.`,
    subquestions: [
      { id:'a', label:'(a)', prompt:'Escriba la masa inicial del carbono radioactivo.', equation:'m(t)=120e^{-0.000121t}', acceptedAnswers:['120'], exact:true, hints:h([
        'La masa inicial corresponde al instante en que la planta murió.',
        '¿Qué valor de \(t\) representa el instante inicial?',
        'Sustituye \(t=0\) en el modelo.',
        'Como \(e^0=1\), la masa inicial es exactamente \(120\,\mathrm{ng}\).'
      ]) },
      { id:'b', label:'(b)', prompt:'Halle la masa del carbono radioactivo luego de 20000 años.', equation:'m(t)=120e^{-0.000121t}', acceptedAnswers:['10.7','10.6705'], tolerance:0.03, hints:h([
        '¿Qué valor de \(t\) corresponde a 20000 años?',
        'Sustituye \(t=20000\).',
        'Calcula \(m(20000)=120e^{-0.000121(20000)}\).',
        'En Casio: MENU → 1 (RUN-MAT) → introduce la expresión. Obtendrás aproximadamente \(10.7\,\mathrm{ng}\).'
      ]) },
      { id:'c', label:'(c)', prompt:'Calcule el menor número de años completos que tarda en desintegrarse más de la mitad de la muestra.', equation:'m(t)=120e^{-0.000121t}', acceptedAnswers:['5729'], exact:true, hints:h([
        'La mitad de la masa inicial es \(60\,\mathrm{ng}\). ¿Qué significa "más de la mitad de la muestra" en términos de masa restante?',
        'Busca cuándo la masa baja de \(60\).',
        'Forma \(120e^{-0.000121t}\leq60\) y resuelve para \(t\).',
        'En Casio: MENU → A → Equation → F3 Solver, o utiliza el gráfico. El valor es aproximadamente \(5728.49\) años; el menor número de años completos es \(5729\).'
      ]) }
    ]
  },
  {
    id: 'P08', title: 'Pregunta 8', topic: 'Modelo exponencial con dos muestras',
    context: String.raw`La cantidad de material radioactivo que contiene una muestra, en microgramos, se puede modelizar mediante \[f(t)=ab^t,\qquad t\geq0,\] donde \(t\) representa el número de días transcurridos desde que se recogió la muestra. Paula recoge dos muestras de este material: la muestra X y la muestra Y. La cantidad inicial de material radioactivo que contiene la muestra X es igual a \(100\) microgramos y luego de transcurridos \(138\) días la cantidad de material radioactivo presente es igual a \(50\) microgramos. La muestra Y, transcurridos 30 días desde la recogida de las muestras, contenía \(4\) microgramos de material radioactivo.`,
    subquestions: [
      { id:'a_i', label:'(a)(i)', prompt:'Para la muestra X: escriba el valor de \(a\).', equation:'f(t)=ab^t', acceptedAnswers:['100'], hints:h([
        '¿Qué representa \(a\) cuando \(t=0\)?',
        'La cantidad inicial de la muestra X es 100 microgramos.',
        'Sustituye \(t=0\) y observa que \(b^0=1\).',
        'Por tanto, \(a=100\).'
      ]) },
      { id:'a_ii', label:'(a)(ii)', prompt:'Para la muestra X: halle \(b\), sabiendo que \(b>0\).', equation:'f(t)=100b^t', acceptedAnswers:['0.995','0.994989'], tolerance:0.001, hints:h([
        'Conoces dos cantidades de la muestra X: 100 microgramos al inicio y 50 microgramos después de 138 días.',
        'Sustituye \(t=138\) y \(f(138)=50\).',
        'Forma \(50=100b^{138}\).',
        'En Casio: MENU → A → Equation → F3 Solver para resolver \(50=100b^{138}\), con \(b>0\). Obtendrás \(b\approx0.995\).'
      ]) },
      { id:'b', label:'(b)', prompt:'Utilice el valor de \(b\) que halló en el apartado (a)(ii) para hallar la cantidad inicial de material radioactivo que contenía la muestra Y.', equation:'f(t)=ab^t', acceptedAnswers:['4.65','4.65051'], tolerance:0.01, hints:h([
        'Para la muestra Y conoces una cantidad a los 30 días: \(f(30)=4\).',
        'Utiliza el mismo valor de \(b\) encontrado para la muestra X.',
        'Forma \(4=a(0.994989)^{30}\).',
        'En Casio: MENU → A → Equation → F3 Solver para encontrar \(a\). Obtendrás aproximadamente \(4.65\) microgramos.'
      ]) }
    ]
  }
];
