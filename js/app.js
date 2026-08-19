import { QUESTIONS } from './questions.js';
import { loadActiveStudents, saveAttemptToFirestore, saveProgressToFirestore } from './firebase.js';

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

function saveLocalProgress() {
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

function autonomyLabel(attempts) {
  if (attempts <= 1) return '🟢 Lo resolviste de forma independiente';
  if (attempts === 2) return '🟡 Necesitaste una pequeña orientación';
  if (attempts === 3) return '🟠 Necesitaste apoyo para desarrollar el procedimiento';
  return '🔵 Necesitaste una guía paso a paso';
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/\s+/g, '').replace(',', '.').replace('％', '%');
}

function isAccepted(value, subquestion) {
  const answer = normalizeAnswer(value);
  const accepted = subquestion.acceptedAnswers || [];
  if (accepted.some((item) => answer === normalizeAnswer(item))) return true;
  if (subquestion.exact) return false;
  const numericAnswer = Number(answer.replace('%', ''));
  if (!Number.isFinite(numericAnswer)) return false;
  const tolerance = Number.isFinite(subquestion.tolerance) ? subquestion.tolerance : 0.02;
  return accepted.some((item) => {
    const normalized = normalizeAnswer(item);
    const numericAccepted = Number(normalized.replace('%', ''));
    return Number.isFinite(numericAccepted) && Math.abs(numericAnswer - numericAccepted) <= tolerance;
  });
}

function renderMath(container) {
  if (!container) return;
  const typeset = () => {
    if (!window.MathJax?.typesetPromise) return false;
    window.MathJax.typesetClear?.([container]);
    window.MathJax.typesetPromise([container]).catch((error) => console.error('MathJax:', error));
    return true;
  };
  if (typeset()) return;
  let tries = 0;
  const waitForMathJax = () => {
    if (typeset() || tries >= 40) return;
    tries += 1;
    window.setTimeout(waitForMathJax, 50);
  };
  waitForMathJax();
}

async function setSection(section) {
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
  $('#student-help').textContent = `Cargando estudiantes activos de ${section}…`;
  showScreen('student-screen');
  try {
    const students = await loadActiveStudents(section);
    if (!students.length) {
      $('#student-help').textContent = `No se encontraron estudiantes activos en ${section}.`;
      return;
    }
    $('#student-help').textContent = `Selecciona tu nombre (${students.length} estudiantes activos).`;
    students.forEach((student) => {
      const button = document.createElement('button');
      button.className = 'student-btn';
      button.innerHTML = `${student.name}<small>${section}</small>`;
      button.addEventListener('click', () => selectStudent({ ...student, section }));
      list.appendChild(button);
    });
  } catch (error) {
    console.error('Firebase / estudiantes:', error);
    $('#student-help').textContent = 'No fue posible cargar la lista desde Firebase. Revisa la conexión y las reglas de acceso.';
    list.innerHTML = `<div class="feedback error">Firebase respondió con un error de acceso o configuración. La aplicación no utilizará una lista ficticia.</div>`;
  }
}

function selectStudent(student) {
  state.student = { ...student, section: state.section };
  $('#student-badge').textContent = `${student.name} · ${state.section}`;
  renderQuestionMenu();
  showScreen('questions-screen');
}

function getQuestionState(questionId) {
  const saved = state.progress[progressKey(questionId)];
  if (saved?.completed) return '🟢 Completada';
  if (saved?.inProgress) return '🟡 En progreso';
  return '⚪ Sin iniciar';
}

function renderQuestionMenu() {
  const grid = $('#question-grid');
  grid.innerHTML = '';
  QUESTIONS.forEach((question) => {
    const button = document.createElement('button');
    button.className = 'question-btn';
    const available = question.subquestions.length > 0;
    button.innerHTML = `<span class="question-number">${question.id.replace('P0', '')}</span><span>${question.topic}</span><span class="question-state">${getQuestionState(question.id)}</span>`;
    button.disabled = !available;
    button.title = available ? 'Abrir pregunta' : 'Pregunta no disponible';
    if (available) button.addEventListener('click', () => openQuestion(question));
    grid.appendChild(button);
  });
}

function openQuestion(question, resume = false) {
  if (!question.subquestions.length) return;
  state.currentQuestion = question;
  const saved = state.progress[progressKey(question.id)];
  const savedParts = saved?.completedParts || {};
  const firstIncomplete = question.subquestions.findIndex((sub) => !savedParts[sub.id]?.completed);
  state.currentSubquestionIndex = resume && firstIncomplete >= 0 ? firstIncomplete : 0;
  state.attempts = savedParts[question.subquestions[state.currentSubquestionIndex].id]?.attempts || 0;
  state.hintsUsed = savedParts[question.subquestions[state.currentSubquestionIndex].id]?.hints?.length || 0;
  state.startedAt = Date.now();
  if (!state.progress[progressKey(question.id)]) state.progress[progressKey(question.id)] = { completedParts: {}, inProgress: true };
  state.progress[progressKey(question.id)].inProgress = true;
  saveLocalProgress();
  renderSubquestion();
  showScreen('question-screen');
}

function renderQuestionSidebar() {
  return `
    <aside class="question-sidebar" aria-label="Navegación de preguntas">
      <div class="sidebar-title">Preguntas</div>
      <div class="sidebar-list">
        ${QUESTIONS.map((question) => {
          const available = question.subquestions.length > 0;
          const current = state.currentQuestion?.id === question.id;
          return `<button class="sidebar-question ${current ? 'current' : ''}" data-question-id="${question.id}" ${available ? '' : 'disabled'}>
            <span class="sidebar-number">${question.id.replace('P0', '')}</span>
            <span class="sidebar-status">${getQuestionState(question.id)}</span>
          </button>`;
        }).join('')}
      </div>
    </aside>
  `;
}

function bindQuestionSidebar() {
  document.querySelectorAll('.sidebar-question:not(:disabled)').forEach((button) => {
    button.addEventListener('click', async () => {
      const question = QUESTIONS.find((item) => item.id === button.dataset.questionId);
      if (!question) return;
      await persistProgress(state.currentQuestion?.id);
      openQuestion(question, true);
    });
  });
}

function renderSubquestion() {
  const question = state.currentQuestion;
  const sub = question.subquestions[state.currentSubquestionIndex];
  const content = $('#question-content');
  const total = question.subquestions.length;
  const progressText = `${state.currentSubquestionIndex + 1} de ${total}`;

  $('#question-status').textContent = `Parte ${progressText}`;
  content.innerHTML = `
    <div class="question-workspace">
      ${renderQuestionSidebar()}
      <div class="question-main">
        <div class="mobile-question-nav">
          <button class="mobile-nav-toggle" id="mobile-question-toggle" type="button" aria-expanded="false">☰ Preguntas</button>
          <div id="mobile-question-menu" class="mobile-question-menu hidden"></div>
        </div>
        <p class="eyebrow">${question.title} · ${progressText}</p>
        <div class="question-body">
          <div class="question-context">${question.context || ''}</div>
          <div class="question-label">${sub.label}</div>
          <p>${sub.prompt}</p>
          <div class="math-block">\\(${sub.equation}\\)</div>
          <div class="answer-row">
            <input id="answer-input" inputmode="text" autocomplete="off" placeholder="Escribe tu respuesta">
            <button class="primary-btn" id="check-answer">Comprobar</button>
          </div>
          <div id="feedback-area"></div>
        </div>
      </div>
    </div>
  `;

  renderMath(content);
  bindQuestionSidebar();

  const mobileToggle = $('#mobile-question-toggle');
  const mobileMenu = $('#mobile-question-menu');
  mobileMenu.innerHTML = QUESTIONS.map((item) => {
    const available = item.subquestions.length > 0;
    return `<button class="mobile-question-item ${state.currentQuestion.id === item.id ? 'current' : ''}" data-question-id="${item.id}" ${available ? '' : 'disabled'}>${item.id.replace('P0', '')} · ${item.topic} · ${getQuestionState(item.id)}</button>`;
  }).join('');
  mobileToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    mobileToggle.setAttribute('aria-expanded', String(!isHidden));
  });
  mobileMenu.querySelectorAll('.mobile-question-item:not(:disabled)').forEach((button) => {
    button.addEventListener('click', async () => {
      const next = QUESTIONS.find((item) => item.id === button.dataset.questionId);
      if (!next) return;
      await persistProgress(state.currentQuestion?.id);
      openQuestion(next, true);
    });
  });

  $('#check-answer').addEventListener('click', checkAnswer);
  $('#answer-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') checkAnswer();
  });
}

async function recordAttempt(sub, answer, correct) {
  const key = progressKey(state.currentQuestion.id);
  if (!state.progress[key]) state.progress[key] = { completedParts: {}, inProgress: true };
  const part = state.progress[key].completedParts[sub.id] || { attempts: 0, hints: [], history: [] };
  part.attempts += 1;
  part.history.push({ answer, correct, at: new Date().toISOString() });
  part.hints = part.hints || [];
  part.timeSpent = Math.round((Date.now() - state.startedAt) / 1000);
  state.progress[key].completedParts[sub.id] = part;
  saveLocalProgress();
  try {
    await saveAttemptToFirestore({
      student: state.student,
      section: state.section,
      questionId: state.currentQuestion.id,
      subquestionId: sub.id,
      answer,
      correct,
      attemptNumber: state.attempts,
      hintsUsed: state.hintsUsed,
      highestHintLevel: state.hintsUsed,
      hintTypes: part.hints.map((hint) => hint.type),
      score: correct ? calculateScore(state.attempts) : null,
      timeSpent: part.timeSpent
    });
  } catch (error) {
    console.error('Firebase / intento:', error);
  }
  return part;
}

async function persistProgress(questionId) {
  if (!questionId) return;
  const key = progressKey(questionId);
  saveLocalProgress();
  try {
    await saveProgressToFirestore({
      student: state.student,
      section: state.section,
      questionId,
      progress: state.progress[key]
    });
  } catch (error) {
    console.error('Firebase / progreso:', error);
  }
}

async function checkAnswer() {
  const sub = state.currentQuestion.subquestions[state.currentSubquestionIndex];
  const input = $('#answer-input');
  const answer = input.value.trim();
  if (!answer) return;
  state.attempts += 1;
  const correct = isAccepted(answer, sub);
  const part = await recordAttempt(sub, answer, correct);
  const feedback = $('#feedback-area');

  if (correct) {
    const score = calculateScore(state.attempts);
    part.score = score;
    part.completed = true;
    feedback.innerHTML = `<div class="feedback success">✓ Correcto.<br><strong>${autonomyLabel(state.attempts)}</strong><br>Resultado: ${score} %.</div>`;
    await persistProgress(state.currentQuestion.id);
    renderNextButton(feedback);
    renderMath(feedback);
    return;
  }

  feedback.innerHTML = `<div class="feedback error">No es correcto todavía. Revisa tu procedimiento e inténtalo nuevamente.</div>`;
  if (state.hintsUsed < sub.hints.length) {
    const hint = sub.hints[state.hintsUsed];
    state.hintsUsed += 1;
    part.hints.push({ level: hint.level, type: hint.type, at: new Date().toISOString() });
    feedback.insertAdjacentHTML('beforeend', `<div class="hint-box"><strong>Pista ${hint.level}</strong><div>${hint.text}</div></div>`);
    saveLocalProgress();
    await persistProgress(state.currentQuestion.id);
    renderMath(feedback);
  } else {
    feedback.insertAdjacentHTML('beforeend', `<div class="hint-box"><strong>Última orientación</strong><div>Revisa las pistas anteriores y vuelve a intentarlo con calma.</div></div>`);
    renderMath(feedback);
  }
}

function renderNextButton(container) {
  const isLast = state.currentSubquestionIndex === state.currentQuestion.subquestions.length - 1;
  const button = document.createElement('button');
  button.className = 'primary-btn next-btn';
  button.textContent = isLast ? 'Volver a preguntas' : 'Siguiente parte →';
  button.addEventListener('click', async () => {
    if (isLast) {
      const key = progressKey(state.currentQuestion.id);
      state.progress[key].completed = true;
      state.progress[key].inProgress = false;
      await persistProgress(state.currentQuestion.id);
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
      await persistProgress(state.currentQuestion.id);
      renderSubquestion();
    }
  });
  container.appendChild(button);
}

$('#back-to-section').addEventListener('click', () => showScreen('section-screen'));
$('#back-to-questions').addEventListener('click', async () => {
  await persistProgress(state.currentQuestion?.id);
  renderQuestionMenu();
  showScreen('questions-screen');
});
document.querySelectorAll('[data-section]').forEach((button) => button.addEventListener('click', () => setSection(button.dataset.section)));
$('#guest-form').addEventListener('submit', (event) => {
  event.preventDefault();
  selectStudent({ id: `guest-${crypto.randomUUID()}`, name: $('#guest-name').value.trim(), origin: $('#guest-origin').value.trim() });
});
