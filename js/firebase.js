import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  addDoc,
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

let authReady = false;

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

// Anonymous clients do not read assessment data back from Firestore.
export async function loadProgressFromFirestore(studentId) {
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

  const attemptsRef = collection(
    db,
    ...ASSESSMENT_PATH,
    student.id,
    'preguntas',
    questionId,
    'subpreguntas',
    subquestionId,
    'intentos'
  );

  await addDoc(attemptsRef, {
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
  });
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
