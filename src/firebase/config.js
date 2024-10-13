// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA0vJ02wX9jNezWHviQAybfOw_-8AcwGbo",
  authDomain: "attendance-management-sy-e6a65.firebaseapp.com",
  projectId: "attendance-management-sy-e6a65",
  storageBucket: "attendance-management-sy-e6a65.appspot.com",
  messagingSenderId: "486010885268",
  appId: "1:486010885268:web:3edd81d523532271ea9081"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };
