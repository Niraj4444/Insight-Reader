// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Dual fallback: use Replit secret if available, otherwise fallback to public key
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCWriSNvJcTwaVdVtGiCMi273w0AJf4qBs",
  authDomain: "digital-library-b.firebaseapp.com",
  projectId: "digital-library-b",
  storageBucket: "digital-library-b.appspot.com",
  messagingSenderId: "587099881192",
  appId: "1:587099881192:web:e317fc9927f8e2044e535d",
  measurementId: "G-LCHJ7SW6NZ",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);