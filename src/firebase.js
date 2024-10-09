// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database"; // Import Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyDAW1Je1m1gMLJaGtk_BAieTVcOvbbvWY8",
  authDomain: "hemimerce.firebaseapp.com",
  projectId: "hemimerce",
  storageBucket: "hemimerce.appspot.com",
  messagingSenderId: "369022506676",
  appId: "1:369022506676:web:bb4f2b334e3d3a51eea9e1",
  measurementId: "G-HDLDYKQMZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app); // Initialize Realtime Database

export { auth, db }; // Export db



