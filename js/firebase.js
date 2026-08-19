import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import {
  getAuth,
  signInAnonymously,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCjE7kpwMZcFRVJsJcWPIQwEzgH-YrcXk0',
  authDomain: 'registro-edu-aa4c8.firebaseapp.com',
  projectId: 'registro-edu-aa4c8',
  storageBucket: 'registro-edu-aa4c8.firebasestorage.app',
  messagingSenderId: '1032924835108',
  appId: '1:1032924835108:web:f21d00c988d9898b3497b1'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const INSTITUTION_PATH = [
  'instituciones',
  'liceoCariari',
  'cursosLectivos',
  '2026',
  'modalidades',
  'bachilleratoInternacional',
  'niveles',
  '11',
  'secciones'
];

// Canonical assessment root:
// evaluaciones/2026/funcionesExponenciales/{studentId}/preguntas/{questionId}/...
// `funcionesExponenciales` is a collection and `{studentId}` is its document.
const ASSESSMENT_PATH = [
  'evaluaciones',
  '2026',
  'funcionesExponenciales'
];

const LOCAL_PROGRESS_KEY = 'luMateIBProgress';

let authReady = false;

function readLocalProgress() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeLocalProgress(progress) {
  localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress));
}

// No asumimos que un registro es antiguo = sincronizado.
// Solo se considera confirmado si ya tiene `synced: true` o un `syncId`
// generado por una escritura confirmada en Firebase.
function initializeIncrementalSyncState() {
  const progress = readLocalProgress();
  let changed = false;

  Object.values(progress).forEach((questionProgress) => {
    Object.values(questionProgress?.completedParts || {}).forEach((part) => {
      (part.history || []).forEach((entry) => {
        if (!entry || typeof entry !== 'object') return;

        if (entry.synced !== true && entry.syncId) {
          entry.synced = true;
          changed = true;
        }
      });
    });
  });

  if (changed) writeLocalProgress(progress);
}

function markLocalAttemptSynced(studentId, questionId, subquestionId, attemptNumber, syncId) {
  const progress = readLocalProgress();
  const key = `${studentId}_${questionId}`;
  const part = progress[key]?.completedParts?.[subquestionId];
  const history = part?.history || [];
  const entry = history[Number(attemptNumber) - 1];
  if (!entry) return;

  entry.synced = true;
  entry.syncId = syncId;
  writeLocalProgress(progress);
}

function calculateHistoricalScore(attemptNumber, correct) {
  if (!correct) return null;
  if (attemptNumber <= 1) return 100;
  if (attemptNumber === 2) return 98;
  if (attemptNumber === 3) return 95;
  return 90;
}

async function findStudentIdentity(studentId) {
  for (const section of ['11-A', '11-B']) {
    const studentRef = doc(db, ...INSTITUTION_PATH, section, 'estudiantes', studentId);
    const snapshot = await getDoc(studentRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: studentId,
        name: [data.nombre, data.ap1, data.ap2].filter(Boolean).join(' '),
        section,
        origin: null
      };
    }
  }
  return null;
}

export async function ensureAnonymousAuth() {
  if (authReady && auth.currentUser?.isAnonymous) {
    return auth.currentUser;
  }

  if (auth.currentUser && !auth.currentUser.isAnonymous) {
    await signOut(auth);
  }

  if (auth.currentUser?.isAnonymous) {
    authReady = true;
    return auth.currentUser;
  }

  const credential = await signInAnonymously(auth);
  authReady = true;
  return credential.user;
}

export async function loadActiveStudents(section) {
  await ensureAnonymousAuth();
  initializeIncrementalSyncState();

  const studentsRef = collection(db, ...INSTITUTION_PATH, section, 'estudiantes');
  const studentsQuery = query(studentsRef, where('estado', '==', 'activo'));
  const snapshot = await getDocs(studentsQuery);

  return snapshot.docs
    .map((studentDoc) => {
      const data = studentDoc.data();
      return {
        id: studentDoc.id,
        name: [data.nombre, data.ap1, data.ap2].filter(Boolean).join(' '),
        cedulaDisplay: data.cedulaDisplay || data.cedula || ''
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

async function syncPendingLocalAttempts(studentId) {
  const progress = readLocalProgress();
  const identity = await findStudentIdentity(studentId);
  if (!identity) return;

  for (const [key, questionProgress] of Object.entries(progress)) {
    if (!key.startsWith(`${studentId}_`)) continue;

    const questionId = key.slice(`${studentId}_`.length);
    const completedParts = questionProgress?.completedParts || {};

    for (const [subquestionId, part] of Object.entries(completedParts)) {
      const history = part?.history || [];

      for (let index = 0; index < history.length; index += 1) {
        const entry = history[index];
        if (!entry || entry.synced === true) continue;

        const attemptNumber = index + 1;
        const timeSpent = part.timeSpent ?? null;
        const correct = Boolean(entry.correct);
        const score = calculateHistoricalScore(attemptNumber, correct);

        try {
          await saveAttemptToFirestore({
            student: identity,
            section: identity.section,
            questionId,
            subquestionId,
            answer: entry.answer ?? '',
            correct,
            attemptNumber,
            hintsUsed: 0,
            highestHintLevel: 0,
            hintTypes: [],
            score,
            timeSpent
          });
        } catch (error) {
          console.error('Firebase / sincronización pendiente:', error);
        }
      }
    }
  }
}

// Anonymous clients do not read assessment data back from Firestore.
// Al seleccionar al estudiante, esta función sincroniza únicamente intentos
// locales que todavía no tienen `synced: true`.
export async function loadProgressFromFirestore(studentId) {
  await ensureAnonymousAuth();
  initializeIncrementalSyncState();
  await syncPendingLocalAttempts(studentId);
  return {};
}

export async function getAnonymousUid() {
  const user = await ensureAnonymousAuth();
  if (!user?.uid) throw new Error('No fue posible obtener el UID anónimo.');
  return user.uid;
}

export async function saveAttemptToFirestore({
  student,
  section,
  questionId,
  subquestionId,
  answer,
  correct,
  attemptNumber,
  hintsUsed,
  highestHintLevel,
  hintTypes,
  score,
  timeSpent
}) {
  const authUid = await getAnonymousUid();

  // ID determinista: si una escritura falla y se reintenta, se actualiza
  // el mismo documento en vez de crear un intento duplicado.
  const syncId = `attempt-${authUid}-${questionId}-${subquestionId}-${attemptNumber}`;
  const attemptRef = doc(
    db,
    ...ASSESSMENT_PATH,
    student.id,
    'preguntas',
    questionId,
    'subpreguntas',
    subquestionId,
    'intentos',
    syncId
  );

  await setDoc(attemptRef, {
    studentId: student.id,
    studentName: student.name,
    origin: student.origin || null,
    section,
    questionId,
    subquestionId,
    answer,
    correct,
    attemptNumber,
    hintsUsed,
    highestHintLevel,
    hintTypes,
    score: score ?? null,
    timeSpent: timeSpent ?? null,
    authUid,
    createdAt: serverTimestamp()
  }, { merge: true });

  markLocalAttemptSynced(student.id, questionId, subquestionId, attemptNumber, syncId);
}

export async function saveProgressToFirestore({ student, section, questionId, progress }) {
  const authUid = await getAnonymousUid();

  const progressRef = doc(
    db,
    ...ASSESSMENT_PATH,
    student.id,
    'preguntas',
    questionId
  );

  await setDoc(progressRef, {
    studentId: student.id,
    studentName: student.name,
    origin: student.origin || null,
    section,
    questionId,
    ...progress,
    authUid,
    updatedAt: serverTimestamp()
  }, { merge: true });
}
