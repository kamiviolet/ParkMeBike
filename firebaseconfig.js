// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
} from 'firebase/firestore';




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyFSkUXDn4Jw0CArYfZ_B_n7SXzqTrbdM",
  authDomain: "park-me-bike-fd0d1.firebaseapp.com",
  projectId: "park-me-bike-fd0d1",
  storageBucket: "park-me-bike-fd0d1.appspot.com",
  messagingSenderId: "679767738699",
  appId: "1:679767738699:web:5a04b378ca79e9aaa5c0ce",
  measurementId: "G-4GCLLHFNB3"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Auth
export function createUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      return { success: false, error: error.message };
    });
}

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      return { success: false, error: error.message };
    });
}

export function signOutUser() {
  return signOut(auth)
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      return { success: false, error: error.message };
    });
}
