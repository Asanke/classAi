import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : {};

export function initAdmin() {
    if (!getApps().length) {
        initializeApp({
            credential: cert(serviceAccount),
        });
    }
    return getApp();
}

// Lazy initialization or just export getters if initialized elsewhere
// For this environment avoiding crash if no env var:
let adminDb: FirebaseFirestore.Firestore;
let adminAuth: import("firebase-admin/auth").Auth;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        initAdmin();
        adminDb = getFirestore();
        adminAuth = getAuth();
    }
} catch (e) {
    console.warn("Firebase Admin not initialized. Missing credentials.");
}

export { adminDb, adminAuth };
