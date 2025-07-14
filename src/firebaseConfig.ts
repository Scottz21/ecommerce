import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDDwIG3AUpHb_vT26Og4OriyCHK-fgKGJQ",
  authDomain: "ecommerce-e5400.firebaseapp.com",
  projectId: "ecommerce-e5400",
  storageBucket: "ecommerce-e5400.firebasestorage.app",
  messagingSenderId: "624167771747",
  appId: "1:624167771747:web:945d333ec36ed633d7e256",
  measurementId: "G-2X5VPVYVWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
