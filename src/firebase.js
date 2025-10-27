import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKv6vy3ipRapcsrUFUn-_vcBdfASW-ZjA",
  authDomain: "studio-7825796096-4cd93.firebaseapp.com",
  projectId: "studio-7825796096-4cd93",
  storageBucket: "studio-7825796096-4cd93.firebasestorage.app",
  messagingSenderId: "788318590570",
  appId: "1:788318590570:web:7b8b457857bc8cdf7ddc13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
