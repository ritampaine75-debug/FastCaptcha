import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { getDatabase, ref, set, get, remove } from 'firebase/database';

/**
 * Firebase Client Configuration with Dual RTDB + Firestore
 */
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

let firestoreInstance: ReturnType<typeof getFirestore> | null = null;
let rtdbInstance: ReturnType<typeof getDatabase> | null = null;

try {
  firestoreInstance = getFirestore(app);
} catch (err) {
  console.warn('[FirebaseDual] Firestore init warning:', err);
}

try {
  rtdbInstance = getDatabase(app);
} catch (err) {
  console.warn('[FirebaseDual] RTDB init warning:', err);
}

export interface CaptchaRecord {
  challengeId: string;
  nonceSeed: string;
  prefix: string;
  timestamp: number;
  expiresAt: number;
  signature: string;
  ip: string;
  verified?: boolean;
}

const memoryBackupStore = new Map<string, CaptchaRecord>();

export interface DualHealthStats {
  rtdbStatus: 'online' | 'degraded' | 'offline' | 'simulated_offline';
  firestoreStatus: 'online' | 'degraded' | 'offline' | 'simulated_offline';
  rtdbLatencyMs: number;
  firestoreLatencyMs: number;
  activeChallengesCount: number;
  failoverEventsCount: number;
  lastFailoverReason: string | null;
  lastSyncTimestamp: number;
  simulatedOutage: {
    rtdb: boolean;
    firestore: boolean;
  };
}

const stats: DualHealthStats = {
  rtdbStatus: 'online',
  firestoreStatus: 'online',
  rtdbLatencyMs: 24,
  firestoreLatencyMs: 38,
  activeChallengesCount: 0,
  failoverEventsCount: 0,
  lastFailoverReason: null,
  lastSyncTimestamp: Date.now(),
  simulatedOutage: {
    rtdb: false,
    firestore: false,
  },
};

export function setSimulatedOutage(target: 'rtdb' | 'firestore' | 'none', enabled: boolean = true) {
  if (target === 'none') {
    stats.simulatedOutage.rtdb = false;
    stats.simulatedOutage.firestore = false;
    stats.rtdbStatus = 'online';
    stats.firestoreStatus = 'online';
  } else if (target === 'rtdb') {
    stats.simulatedOutage.rtdb = enabled;
    stats.rtdbStatus = enabled ? 'simulated_offline' : 'online';
  } else if (target === 'firestore') {
    stats.simulatedOutage.firestore = enabled;
    stats.firestoreStatus = enabled ? 'simulated_offline' : 'online';
  }
  return stats;
}

export function getDualHealthStatus(): DualHealthStats {
  stats.activeChallengesCount = memoryBackupStore.size;
  return { ...stats };
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`[FailoverEngine] ${label} timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export async function saveCaptchaChallenge(record: CaptchaRecord): Promise<{ success: boolean; primarySource: string; secondarySync: boolean }> {
  memoryBackupStore.set(record.challengeId, record);
  stats.lastSyncTimestamp = Date.now();

  const promises: { name: string; task: Promise<any> }[] = [];

  if (rtdbInstance && !stats.simulatedOutage.rtdb) {
    const rtdbWrite = async () => {
      const start = Date.now();
      const challengeRef = ref(rtdbInstance!, `fastcaptcha_challenges/${record.challengeId}`);
      await set(challengeRef, { ...record, savedAt: Date.now() });
      stats.rtdbLatencyMs = Date.now() - start;
      stats.rtdbStatus = 'online';
    };
    promises.push({ name: 'RTDB', task: withTimeout(rtdbWrite(), 2500, 'RTDB Write') });
  } else {
    stats.rtdbStatus = stats.simulatedOutage.rtdb ? 'simulated_offline' : 'offline';
  }

  if (firestoreInstance && !stats.simulatedOutage.firestore) {
    const firestoreWrite = async () => {
      const start = Date.now();
      const docRef = doc(firestoreInstance!, 'fastcaptcha_challenges', record.challengeId);
      await setDoc(docRef, { ...record, savedAt: Date.now() });
      stats.firestoreLatencyMs = Date.now() - start;
      stats.firestoreStatus = 'online';
    };
    promises.push({ name: 'Firestore', task: withTimeout(firestoreWrite(), 2500, 'Firestore Write') });
  } else {
    stats.firestoreStatus = stats.simulatedOutage.firestore ? 'simulated_offline' : 'offline';
  }

  if (promises.length === 0) {
    stats.failoverEventsCount++;
    stats.lastFailoverReason = 'Both cloud databases unreachable; using In-Memory failover store';
    return { success: true, primarySource: 'In-Memory RAM Store', secondarySync: false };
  }

  const results = await Promise.allSettled(promises.map(p => p.task));
  const succeeded = results.filter(r => r.status === 'fulfilled');

  if (succeeded.length === 0) {
    stats.failoverEventsCount++;
    stats.lastFailoverReason = 'Dual Cloud write timeout/error -> Activated instant RAM failover';
    return { success: true, primarySource: 'In-Memory Failover', secondarySync: false };
  }

  const primaryName = promises[results.findIndex(r => r.status === 'fulfilled')].name;
  return {
    success: true,
    primarySource: primaryName,
    secondarySync: succeeded.length > 1,
  };
}

export async function consumeCaptchaChallenge(challengeId: string): Promise<CaptchaRecord | null> {
  let foundRecord: CaptchaRecord | null = null;

  if (memoryBackupStore.has(challengeId)) {
    foundRecord = memoryBackupStore.get(challengeId)!;
    memoryBackupStore.delete(challengeId);
  }

  if (!foundRecord && rtdbInstance && !stats.simulatedOutage.rtdb) {
    try {
      const challengeRef = ref(rtdbInstance, `fastcaptcha_challenges/${challengeId}`);
      const snapshot: any = await withTimeout(get(challengeRef), 1800, 'RTDB Read');
      if (snapshot && typeof snapshot.exists === 'function' && snapshot.exists()) {
        foundRecord = snapshot.val() as CaptchaRecord;
      }
    } catch (err: any) {
      stats.failoverEventsCount++;
      stats.lastFailoverReason = `RTDB read fail: ${err.message}`;
    }
  }

  if (!foundRecord && firestoreInstance && !stats.simulatedOutage.firestore) {
    try {
      const docRef = doc(firestoreInstance, 'fastcaptcha_challenges', challengeId);
      const docSnap: any = await withTimeout(getDoc(docRef), 1800, 'Firestore Read');
      if (docSnap && typeof docSnap.exists === 'function' && docSnap.exists()) {
        foundRecord = docSnap.data() as CaptchaRecord;
      }
    } catch (err: any) {
      stats.failoverEventsCount++;
      stats.lastFailoverReason = `Firestore read fail: ${err.message}`;
    }
  }

  if (!foundRecord) return null;

  // Erase from both databases
  if (rtdbInstance && !stats.simulatedOutage.rtdb) {
    const challengeRef = ref(rtdbInstance, `fastcaptcha_challenges/${challengeId}`);
    remove(challengeRef).catch(() => {});
  }

  if (firestoreInstance && !stats.simulatedOutage.firestore) {
    const docRef = doc(firestoreInstance, 'fastcaptcha_challenges', challengeId);
    deleteDoc(docRef).catch(() => {});
  }

  return foundRecord;
}
