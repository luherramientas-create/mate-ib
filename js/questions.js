export const QUESTIONS = [
  {
    id: 'P01',
    title: 'Pregunta 1',
    topic: 'Función exponencial',
    context: `La cantidad de un medicamento (en miligramos) presente en el organismo \(t\) horas después de haberlo inyectado viene dada por \(D(t)=23(0.85)^t\), \(t\geq 0\). Antes de esta inyección, la cantidad de medicamento presente en el organismo era cero.`,
    subquestions: [
      {
        id: 'a_i',
        label: '(a)(i)',
        prompt: 'Escriba la dosis inicial del medicamento.',
        equation: 'D(t)=23(0.85)^t',
        acceptedAnswers: ['23', '23.0'],
        hints: [
          { level: 1, type: 'conceptual', text: '¿Qué representa el valor inicial en un modelo exponencial?', display: 'small' },
          { level: 2, type: 'interpretation', text: 'El valor inicial corresponde a la cantidad que hay cuando comienza el proceso. ¿Qué valor tiene \(t\) en ese momento?', display: 'small' },
          { level: 3, type: 'procedural', text: 'Sustituye \(t=0\) en la expresión \(D(t)=23(0.85)^t\).', display: 'support' },
          { level: 4, type: 'calculator', text: 'En tu Casio fx-CG50, selecciona MENU → 1 (RUN-MAT) e introduce \(23(0.85)^0\). ¿Qué resultado obtienes?', display: 'step' }
        ]
      },
      {
        id: 'a_ii',
        label: '(a)(ii)',
        prompt: 'Escriba el porcentaje de medicamento que abandona el organismo cada hora.',
        equation: 'D(t)=23(0.85)^t',
        acceptedAnswers: ['15', '15%', '0.15'],
        hints: [
          { level: 1, type: 'conceptual', text: 'Observa el valor \(0.85\). ¿Es mayor o menor que 1?', display: 'small' },
          { level: 2, type: 'interpretation', text: 'El factor \(0.85\) indica que cada hora permanece el 85 % de la cantidad anterior.', display: 'small' },
          { level: 3, type: 'procedural', text: 'Para determinar cuánto disminuye, calcula \(1-0.85\).', display: 'support' },
          { level: 4, type: 'interpretation', text: 'Expresa \(0.15\) como porcentaje. Recuerda que \(0.15=15\%\).', display: 'step' }
        ]
      },
      {
        id: 'b',
        label: '(b)',
        prompt: 'Calcule la cantidad de medicamento que queda en el organismo 10 horas después de la inyección.',
        equation: 'D(t)=23(0.85)^t',
        acceptedAnswers: ['4.53', '4.528', '4.5281'],
        hints: [
          { level: 1, type: 'interpretation', text: '¿Qué valor de \(t\) necesitas utilizar para responder la pregunta?', display: 'small' },
          { level: 2, type: 'procedural', text: 'Sustituye \(t=10\) en \(D(t)=23(0.85)^t\). Es decir, \(D(10)=23(0.85)^{10}\).', display: 'support' },
          { level: 3, type: 'calculator', text: 'En tu Casio fx-CG50, selecciona MENU → 1 (RUN-MAT) e introduce \(23(0.85)^{10}\).', display: 'step' }
        ]
      }
    ]
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `P0${i + 2}`,
    title: `Pregunta ${i + 2}`,
    topic: 'Próximamente',
    subquestions: []
  }))
];
