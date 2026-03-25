// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8ej1jCj9MnDw3QgNgCc9KEhN6WVyRT0A", 
    authDomain: "test-2150a.firebaseapp.com", 
    projectId: "test-2150a", 
    storageBucket: "test-2150a.firebasestorage.app", 
    messagingSenderId: "1033871619202", 
    appId: "1:1033871619202:web:446dcbcf7175552c39f09b", 
    measurementId: "G-0NGF27N0ZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);