// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKR4zLWPA1DPleM3CwiX9gMOfO4FJURxg",
  authDomain: "clone-f5fdf.firebaseapp.com",
  projectId: "clone-f5fdf",
  storageBucket: "clone-f5fdf.appspot.com",
  messagingSenderId: "365387552314",
  appId: "1:365387552314:web:bbbcd1678e1df5ae740703",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
