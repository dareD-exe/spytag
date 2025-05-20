// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Temporary hardcoded config for debugging - REMOVE IN PRODUCTION!
const firebaseConfig = {
  apiKey: "AIzaSyD9fXgWsadY6nakJJbnQsilcc_XCImHscc",
  authDomain: "clash-stats-ef723.firebaseapp.com",
  projectId: "clash-stats-ef723",
  storageBucket: "clash-stats-ef723.firebasestorage.app",
  messagingSenderId: "189344366542",
  appId: "1:189344366542:web:364c2e049a412eaffdf59f",
  measurementId: "G-VZJW9DK1JC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 