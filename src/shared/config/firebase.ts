// src/shared/config/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDz8W0t_j0YU-2WZy66n5yyJWeWXkL-J_Q",
  authDomain: "bonga-exirfirm.firebaseapp.com",
  projectId: "bonga-exirfirm",
  storageBucket: "bonga-exirfirm.firebasestorage.app",
  messagingSenderId: "926638791986",
  appId: "1:926638791986:web:5876127ace9834dac14b2b"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const messaging: Messaging | null = 
  typeof window !== 'undefined' ? getMessaging(app) : null;