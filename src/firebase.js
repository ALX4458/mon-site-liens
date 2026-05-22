import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8mzzVtam15K8h17V6TrcGbEDzm0ZV7Sw",
  authDomain: "alex-crack.firebaseapp.com",
  projectId: "alex-crack",
  storageBucket: "alex-crack.firebasestorage.app",
  messagingSenderId: "794597652216",
  appId: "1:794597652216:web:7cb0c7d02a238fee902d0d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);