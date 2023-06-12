// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQEQKevUKp-mnS2Du13_uTpDuBHD4qfpQ",
  authDomain: "park-me-bike.firebaseapp.com",
  projectId: "park-me-bike",
  storageBucket: "park-me-bike.appspot.com",
  messagingSenderId: "857359915558",
  appId: "1:857359915558:web:a5bc2a28b7d002d0f2e4e7",
  measurementId: "G-DYYTZFJSCT",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
