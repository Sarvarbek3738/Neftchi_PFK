import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPxYz28ZsISAr1dNkEivFHcNo5Jy2Pu9s",
  authDomain: "my-loyha.firebaseapp.com",
  projectId: "my-loyha",
  storageBucket: "my-loyha.firebasestorage.app",
  messagingSenderId: "1017947270026",
  appId: "1:1017947270026:web:a4d10bb83cab71a58a7673",
  measurementId: "G-CLH0YMNLFQ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
