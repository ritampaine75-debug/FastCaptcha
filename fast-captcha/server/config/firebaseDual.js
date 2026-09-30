import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getDatabase, ref, set, get, remove } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyCChxWVg-w1TiertkXlUrfUgcC19y-CPNw",
  authDomain: "hiiii-72d78.firebaseapp.com",
  databaseURL: "https://hiiii-72d78-default-rtdb.firebaseio.com",
  projectId: "hiiii-72d78",
  storageBucket: "hiiii-72d78.firebasestorage.app",
  messagingSenderId: "560685164053",
  appId: "1:560685164053:web:7f672f7503160ec868901c"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const rtdb = getDatabase(app);
const memoryStore = new Map();

export async function saveCaptchaChallenge(record) {
  memoryStore.set(record.challengeId, record);
  try {
    const rRef = ref(rtdb, `fastcaptcha_challenges/${record.challengeId}`);
    set(rRef, { ...record, savedAt: Date.now() }).catch(() => {});
    const dRef = doc(firestore, 'fastcaptcha_challenges', record.challengeId);
    setDoc(dRef, { ...record, savedAt: Date.now() }).catch(() => {});
  } catch (e) {}

  return { success: true, primarySource: 'Dual Firebase Sync', dualSynced: true };
}

export async function consumeCaptchaChallenge(challengeId) {
  let found = null;
  if (memoryStore.has(challengeId)) {
    found = memoryStore.get(challengeId);
    memoryStore.delete(challengeId);
  }
  if (!found) {
    try {
      const rRef = ref(rtdb, `fastcaptcha_challenges/${challengeId}`);
      const snap = await get(rRef);
      if (snap.exists()) found = snap.val();
    } catch (e) {}
  }
  if (!found) {
    try {
      const dRef = doc(firestore, 'fastcaptcha_challenges', challengeId);
      const dSnap = await getDoc(dRef);
      if (dSnap.exists()) found = dSnap.data();
    } catch (e) {}
  }
  if (!found) return null;

  try {
    const rRef = ref(rtdb, `fastcaptcha_challenges/${challengeId}`);
    remove(rRef).catch(() => {});
    const dRef = doc(firestore, 'fastcaptcha_challenges', challengeId);
    deleteDoc(dRef).catch(() => {});
  } catch (e) {}

  return found;
}
