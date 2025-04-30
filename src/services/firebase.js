import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC3OxgOtLvVnbmfsNeLn-FYuBros9cuuHg",
    authDomain: "resumaker-8258b.firebaseapp.com",
    projectId: "resumaker-8258b",
    storageBucket: "resumaker-8258b.firebasestorage.app",
    messagingSenderId: "1089678955361",
    appId: "1:1089678955361:web:bf23bb4cbcc941a26b6b20",
    measurementId: "G-B7G8JRG5KC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);