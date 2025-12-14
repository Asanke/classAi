import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBM3G6VWgrtoHcgV1DFSFJVKBIf0uRlSQQ",
    authDomain: "class-2d5f5.firebaseapp.com",
    projectId: "class-2d5f5",
    storageBucket: "class-2d5f5.firebasestorage.app",
    messagingSenderId: "820518827956",
    appId: "1:820518827956:web:5b292c5054637a397624e1",
    measurementId: "G-644640FXE5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

let analytics: any = null;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, db, functions, analytics };
