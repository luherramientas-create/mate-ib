export const QUESTIONS = [
  {
    id: 'P01',
    title: 'Pregunta 1',
    topic: 'Función exponencial',
    subquestions: [
      {
        id: 'a_i',
        label: '(a)(i)',
        prompt: 'Determine la cantidad inicial representada por el modelo.',
        equation: 'P(t)=23(0.85)^t',
        acceptedAnswers: ['23', '23.0'],
        hints: [
          { level: 1, type: 'conceptual', text: '¿Qué representa el valor inicial en un modelo exponencial?', display: 'small' },
          { level: 2, type: 'interpretation', text: 'El valor inicial corresponde a la cantidad que hay cuando comienza el proceso. ¿Qué valor tiene t en ese momento?', display: 'small' },
          { level: 3, type: 'procedural', text: 'Sustituye t=0 en la expresión: P(t)=23(0.85)^t.', display: 'support' },
          { level: 4, type: 'calculator', text: 'En tu Casio fx-CG50, selecciona MENU → 1 (RUN-MAT) e introduce 23(0.85)^0. ¿Qué resultado obtienes?', display: 'step' }
        ]
      },
      {
        id: 'a_ii',
        label: '(a)(ii)',
        prompt: 'Determine el porcentaje en que disminuye la cantidad en cada periodo.',
        equation: 'P(t)=23(0.85)^t',
        acceptedAnswers: ['15', '15%', '0.15', '0.15%'],
        hints: [
          { level: 1, type: 'conceptual', text: 'Observa el valor 0.85. ¿Es mayor o menor que 1?', display: 'small' },
          { level: 2, type: 'interpretation', text: 'Cuando el factor multiplicativo es menor que 1, la cantidad disminuye en cada periodo.', display: 'small' },
          { level: 3, type: 'procedural', text: 'Para determinar cuánto disminuye, calcula 1-0.85.', display: 'support' },
          { level: 4, type: 'interpretation', text: 'Expresa 0.15 como porcentaje. Recuerda que 0.15=15%.', display: 'step' }
        ]
      },
      {
        id: 'b',
        label: '(b)',
        prompt: 'Evalúe el modelo cuando t=10.',
        equation: 'P(t)=23(0.85)^t',
        acceptedAnswers: ['4.53', '4.52', '4.54'],
        hints: [
          { level: 1, type: 'interpretation', text: '¿Qué valor de t necesitas utilizar para responder la pregunta?', display: 'small' },
          { level: 2, type: 'procedural', text: 'Sustituye t=10 en P(t)=23(0.85)^t. Es decir, P(10)=23(0.85)^10.', display: 'support' },
          { level: 3, type: 'calculator', text: 'En tu Casio fx-CG50, selecciona MENU → 1 (RUN-MAT) e introduce 23(0.85)^10.', display: 'step' }
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
