import { QUESTIONS } from './questions.js';

const state = {
  section: null,
  student: null,
  progress: JSON.parse(localStorage.getItem('luMateIBProgress') || '{}'),
  currentQuestion: null,
  currentSubquestionIndex: 0,
  attempts: 0,
  hintsUsed: 0,
  startedAt: null
};

const $ = (selector) => document.querySelector(selector);
const screens = ['section-screen', 'student-screen', 'questions-screen', 'question-screen'];

function showScreen(id) {
  screens.forEach((screen) => document.getElementById(screen).classList.toggle('active', screen === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveProgress() {
  localStorage.setItem('luMateIBProgress', JSON.stringify(state.progress));
}

function progressKey(questionId) {
  const studentId = state.student?.id || 'guest';
  return `${studentId}_${questionId}`;
}

function calculateScore(attempts) {
  if (attempts <= 1) return 100;
  if (attempts === 2) return 98;
  if (attempts === 3) return 95;
  return 90;
}

function normalizeAnswer(value) {
  return value.toLowerCase().replace(/\s+/g, '').replace(',', '.').replace('％', '%');
}

function isAccepted(value, subquestion) {
  const answer = normalizeAnswer(value);
  return subquestion.acceptedAnswers.some((accepted) => {
    const normalized = normalizeAnswer(accepted);
    if (answer === normalized) return true;
    const numericAnswer = Number(answer.replace('%', ''));
    const numericAccepted = Number(normalized.replace('%', ''));
    return Number.isFinite(numericAnswer) && Number.isFinite(numericAccepted) && Math.abs(numericAnswer - numericAccepted) < 0.02;
  });
}

function setSection(section) {
  state.section = section;
  const list = $('#student-list');
  const form = $('#guest-form');
  list.innerHTML = '';
  form.classList.toggle('hidden', section !== 'invitado');

  if (section === 'invitado') {
    $('#student-help').textContent = 'Completa tus datos para continuar.';
    showScreen('student-screen');
    return;
  }

  $('#student-help').textContent = `Estudiantes activos de ${section}.`;

  // Datos provisionales para el MVP. La siguiente fase reemplazará esta función por Firestore.
  const students = section === '11-A'
    ? [
        ['Oliver Acevedo', 'demo-11A-001'], ['Steven Badilla', 'demo-11A-002'], ['Nahomy Céspedes', 'demo-11A-003'],
        ['Brayan Duarte', 'demo-11A-004'], ['Deykel Espinoza', 'demo-11A-005'], ['Ian Espinoza', 'demo-11A-006'],
        ['Arianna Goméz', 'demo-11A-007'], ['José Pablo Pérez', 'demo-11A-008'], ['Jimena Retana', 'demo-11A-009'],
        ['Sebastián Retana', 'demo-11A-010'], ['Latrell Reyes', 'demo-11A-011'], ['Emily Umaña', 'demo-11A-012']
      ]
    : [
        ['Santiago Chinchilla', 'demo-11B-001'], ['Sharon Quesada', 'demo-11B-002'], ['Escarleth Espinoza', 'demo-11B-003'],
        ['Matías Céspedes', 'demo-11B-004'], ['Hanzel Joseph', 'demo-11B-005'], ['Evans López', 'demo-11B-006'],
        ['Isaac Oquendo', 'demo-11B-007'], ['Esteban Pérez', 'demo-11B-008'], ['Samantha Portilla', 'demo-11B-009'],
        ['Abigail Quesada', 'demo-11B-010'], ['Yedani Urbina', 'demo-11B-011'], ['Edgar Zúñiga', 'demo-11B-012']
      ];

  students.forEach(([name, id]) => {
    const button = document.createElement('button');
    button.className = 'student-btn';
    button.innerHTML = `${name}<small>${section}</small>`;
    button.addEventListener('click', () => selectStudent({ id, name }));
    list.appendChild(button);
  });

  showScreen('student-screen');
}

function selectStudent(student) {
  state.student = { ...student, section: state.section };
  $('#student-badge').textContent = `${student.name} · ${state.section}`;
  renderQuestionMenu();
  showScreen('questions-screen');
}

function renderQuestionMenu() {
  const grid = $('#question-grid');
  grid.innerHTML = '';
  QUESTIONS.forEach((question) => {
    const key = progressKey(question.id);
    const saved = state.progress[key];
    const button = document.createElement('button');
    button.className = 'question-btn';
    const stateText = saved?.completed ? '🟢 Completada' : saved?.inProgress ? '🟡 En progreso' : '⚪ Sin iniciar';
    button.innerHTML = `<span class="question-number">${question.id.replace('P0', '')}</span><span>${question.topic}</span><span class="question-state">${stateText}</span>`;
    button.disabled = question.id !== 'P01';
    button.title = question.id === 'P01' ? 'Abrir pregunta' : 'Esta pregunta se incorporará próximamente.';
    button.addEventListener('click', () => openQuestion(question));
    grid.appendChild(button);
  });
}

function openQuestion(question) {
  if (!question.subquestions.length) return;
  state.currentQuestion = question;
  state.currentSubquestionIndex = 0;
  state.attempts = 0;
  state.hintsUsed = 0;
  state.startedAt = Date.now();
  renderSubquestion();
  showScreen('question-screen');
}

function renderSubquestion() {
  const question = state.currentQuestion;
  const sub = question.subquestions[state.currentSubquestionIndex];
  const content = $('#question-content');
  const total = question.subquestions.length;
  const progressText = `${state.currentSubquestionIndex + 1} de ${total}`;

  $('#question-status').textContent = `Parte ${progressText}`;
  content.innerHTML = `
    <p class="eyebrow">${question.title} · ${progressText}</p>
    <div class="question-body">
      <div class="question-label">${sub.label}</div>
      <p>${sub.prompt}</p>
      <div class="math-block">\[${sub.equation}\]</div>
      <div class="answer-row">
        <input id="answer-input" inputmode="decimal" autocomplete="off" placeholder="Escribe tu respuesta">
        <button class="primary-btn" id="check-answer">Comprobar</button>
      </div>
      <div id="feedback-area"></div>
    </div>
  `;
  window.MathJax?.typesetPromise?.();
  $('#check-answer').addEventListener('click', checkAnswer);
  $('#answer-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') checkAnswer();
  });
}

function recordAttempt(sub, answer, correct) {
  const key = progressKey(state.currentQuestion.id);
  if (!state.progress[key]) state.progress[key] = { completedParts: {}, inProgress: true };
  const part = state.progress[key].completedParts[sub.id] || { attempts: 0, hints: [], history: [] };
  part.attempts += 1;
  part.history.push({ answer, correct, at: new Date().toISOString() });
  part.hints = part.hints || [];
  part.timeSpent = Math.round((Date.now() - state.startedAt) / 1000);
  state.progress[key].completedParts[sub.id] = part;
  saveProgress();
  return part;
}

function checkAnswer() {
  const sub = state.currentQuestion.subquestions[state.currentSubquestionIndex];
  const input = $('#answer-input');
  const answer = input.value.trim();
  if (!answer) return;

  state.attempts += 1;
  const correct = isAccepted(answer, sub);
  const part = recordAttempt(sub, answer, correct);
  const feedback = $('#feedback-area');

  if (correct) {
    const score = calculateScore(state.attempts);
    part.score = score;
    part.completed = true;
    feedback.innerHTML = `<div class="feedback success">✓ Correcto. ${state.attempts === 1 ? 'Lo resolviste de forma independiente.' : `Resultado: ${score} %.`}</div>`;
    saveProgress();
    renderNextButton(feedback);
    return;
  }

  feedback.innerHTML = `<div class="feedback error">No es correcto todavía. Revisa tu procedimiento e inténtalo nuevamente.</div>`;
  if (state.hintsUsed < sub.hints.length) {
    const hint = sub.hints[state.hintsUsed];
    state.hintsUsed += 1;
    part.hints.push({ level: hint.level, type: hint.type, at: new Date().toISOString() });
    feedback.insertAdjacentHTML('beforeend', `<div class="hint-box"><strong>Pista ${hint.level}</strong><div>${hint.text}</div></div>`);
    saveProgress();
  } else {
    feedback.insertAdjacentHTML('beforeend', `<div class="hint-box"><strong>Última orientación</strong><div>Revisa las pistas anteriores y vuelve a intentarlo con calma.</div></div>`);
  }
}

function renderNextButton(container) {
  const isLast = state.currentSubquestionIndex === state.currentQuestion.subquestions.length - 1;
  const button = document.createElement('button');
  button.className = 'primary-btn next-btn';
  button.textContent = isLast ? 'Volver a preguntas' : 'Siguiente parte →';
  button.addEventListener('click', () => {
    if (isLast) {
      const key = progressKey(state.currentQuestion.id);
      state.progress[key].completed = true;
      state.progress[key].inProgress = false;
      saveProgress();
      renderQuestionMenu();
      showScreen('questions-screen');
    } else {
      state.currentSubquestionIndex += 1;
      state.attempts = 0;
      state.hintsUsed = 0;
      state.startedAt = Date.now();
      const key = progressKey(state.currentQuestion.id);
      if (!state.progress[key]) state.progress[key] = {};
      state.progress[key].inProgress = true;
      saveProgress();
      renderSubquestion();
    }
  });
  container.appendChild(button);
}

$('#back-to-section').addEventListener('click', () => showScreen('section-screen'));
$('#back-to-questions').addEventListener('click', () => {
  renderQuestionMenu();
  showScreen('questions-screen');
});
document.querySelectorAll('[data-section]').forEach((button) => button.addEventListener('click', () => setSection(button.dataset.section)));
$('#guest-form').addEventListener('submit', (event) => {
  event.preventDefault();
  selectStudent({ id: `guest-${crypto.randomUUID()}`, name: $('#guest-name').value.trim(), origin: $('#guest-origin').value.trim() });
});
