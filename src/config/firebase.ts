import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBycgw0XjtoT3j_GyvgCTUHzncAKPs5UzM",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "easyrentgh25.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "easyrentgh25",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "easyrentgh25.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "824224780519",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:824224780519:web:0007f11e25a87d590fd242",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-LZVHTQKRQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (conditionally for production)
let analytics: any = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}
export { analytics };

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: '' // Remove any domain restrictions
});

// Add required scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;
