// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAW1Je1m1gMLJaGtk_BAieTVcOvbbvWY8",
  authDomain: "hemimerce.firebaseapp.com",
  projectId: "hemimerce",
  storageBucket: "hemimerce.appspot.com",
  messagingSenderId: "369022506676",
  appId: "1:369022506676:web:bb4f2b334e3d3a51eea9e1",
  measurementId: "G-HDLDYKQMZM"
};

const app = initializeApp(firebaseConfig);

// Optional: Initialize Firebase Analytics (ensure analytics is enabled in your project)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Initialize other Firebase services
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };


