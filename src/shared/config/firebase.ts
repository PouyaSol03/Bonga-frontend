// src/shared/config/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, isSupported as isFcmSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDz8W0t_j0YU-2WZy66n5yyJWeWXkL-J_Q",
  authDomain: "bonga-exirfirm.firebaseapp.com",
  projectId: "bonga-exirfirm",
  storageBucket: "bonga-exirfirm.firebasestorage.app",
  messagingSenderId: "926638791986",
  appId: "1:926638791986:web:5876127ace9834dac14b2b"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let messagingPromise: Promise<Messaging | null> | null = null;

export async function isMessagingSupported(): Promise<boolean> {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !('Notification' in window) ||
    !('PushManager' in window)
  ) {
    return false;
  }

  try {
    return await isFcmSupported();
  } catch {
    return false;
  }
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;

  if (!messagingPromise) {
    messagingPromise = (async () => {
      try {
        const supported = await isMessagingSupported();
        if (supported) {
          return getMessaging(app);
        }
      } catch (err) {
        console.warn('[FCM] Error initializing getMessaging:', err);
      }
      return null;
    })();
  }

  return messagingPromise;
}