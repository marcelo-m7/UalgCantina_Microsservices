// src/lib/firebase.ts
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore'; // Uncomment if you use Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNnTxESatobQsRYU9U6khUpnZ3L_S3Y8Q",
  authDomain: "ualg-cantina.firebaseapp.com",
  projectId: "ualg-cantina",
  storageBucket: "ualg-cantina.firebasestorage.app",
  messagingSenderId: "820778911723",
  appId: "1:820778911723:web:8ce8863f78670ccd5d3bae"
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
// const db = getFirestore(app); // Uncomment if you use Firestore
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider /*, db */ };
