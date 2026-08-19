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
          { level: 1, type: 'conceptual', text: 'Piensa en el momento en que comienza el proceso. ¿Qué valor tiene la variable independiente en ese instante?', display: 'small' },
          { level: 2, type: 'interpretation', text: 'El valor inicial se obtiene cuando \(t=0\). ¿Qué ocurre con una potencia cuyo exponente es 0?', display: 'small' },
          { level: 3, type: 'procedural', text: 'Sustituye \(t=0\) en \(D(t)=23(0.85)^t\): \[D(0)=23(0.85)^0\].', display: 'support' },
          { level: 4, type: 'calculator', text: 'En tu Casio fx-CG50 selecciona <strong>MENU → 1 (RUN-MAT)</strong> e introduce \(23(0.85)^0\). El resultado corresponde a la dosis inicial.', display: 'step' }
        ]
      },
      {
        id: 'a_ii',
        label: '(a)(ii)',
        prompt: 'Escriba el porcentaje de medicamento que abandona el organismo cada hora.',
        equation: 'D(t)=23(0.85)^t',
        acceptedAnswers: ['15', '15%', '0.15'],
        hints: [
          { level: 1, type: 'conceptual', text: 'Observa la base \(0.85\). Compárala con \(1\): ¿la cantidad está creciendo o disminuyendo?', display: 'small' },
          { level: 2, type: 'interpretation', text: 'El factor \(0.85\) significa que cada hora permanece el \(85\%\) de la cantidad anterior. ¿Qué porcentaje falta para llegar al \(100\%\)?', display: 'small' },
          { level: 3, type: 'procedural', text: 'Calcula la parte que disminuye: \[1-0.85=0.15.\] Ahora conviértela a porcentaje.', display: 'support' },
          { level: 4, type: 'interpretation', text: 'Como \(0.15=15\%\), el porcentaje que abandona el organismo cada hora es \(15\%\).', display: 'step' }
        ]
      },
      {
        id: 'b',
        label: '(b)',
        prompt: 'Calcule la cantidad de medicamento que queda en el organismo 10 horas después de la inyección.',
        equation: 'D(t)=23(0.85)^t',
        acceptedAnswers: ['4.53', '4.528', '4.5281', '4.52811'],
        hints: [
          { level: 1, type: 'interpretation', text: '¿Qué valor de la variable independiente conocemos en esta parte?', display: 'small' },
          { level: 2, type: 'procedural', text: 'La pregunta indica que han transcurrido 10 horas. Por tanto, debes utilizar \(t=10\).', display: 'small' },
          { level: 3, type: 'procedural', text: 'Sustituye \(t=10\): \[D(10)=23(0.85)^{10}.\]', display: 'support' },
          { level: 4, type: 'calculator', text: 'En tu Casio fx-CG50 selecciona <strong>MENU → 1 (RUN-MAT)</strong> e introduce \(23(0.85)^{10}\). Redondea el resultado según las indicaciones de la pregunta.', display: 'step' }
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
