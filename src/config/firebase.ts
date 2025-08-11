import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBycgw0XjtoT3j_GyvgCTUHzncAKPs5UzM",
  authDomain: "easyrentgh25.firebaseapp.com",
  projectId: "easyrentgh25",
  storageBucket: "easyrentgh25.firebasestorage.app",
  messagingSenderId: "824224780519",
  appId: "1:824224780519:web:0007f11e25a87d590fd242",
  measurementId: "G-LZVHTQKRQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

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
