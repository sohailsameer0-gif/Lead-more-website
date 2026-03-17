
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBo33X3fxVC_51XBdjOr3RUwLsNq5rRNQA",
  authDomain: "leadmorewebsite.firebaseapp.com",
  databaseURL: "https://leadmorewebsite-default-rtdb.firebaseio.com",
  projectId: "leadmorewebsite",
  storageBucket: "leadmorewebsite.firebasestorage.app",
  messagingSenderId: "5188145529",
  appId: "1:5188145529:web:fe771673c442ea9c2f5fa8"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
