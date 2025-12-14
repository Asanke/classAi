import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBM3G6VWgrtoHcgV1DFSFJVKBIf0uRlSQQ",
    authDomain: "class-2d5f5.firebaseapp.com",
    projectId: "class-2d5f5",
    storageBucket: "class-2d5f5.firebasestorage.app",
    messagingSenderId: "820518827956",
    appId: "1:820518827956:web:5b292c5054637a397624e1",
    measurementId: "G-644640FXE5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
    console.log("🚀 Creating Admin User...");
    const email = "admin@gmail.com";
    const password = "123456";

    try {
        // Try creating
        await createUserWithEmailAndPassword(auth, email, password);
        console.log(`✅ Success: Created ${email}`);

        // Login to get UID for profile creation
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        // Create Institute/User Profile
        console.log("📝 Creating Firestore Profile...");
        await setDoc(doc(db, "institutes", uid), {
            name: "Demo Institute",
            ownerId: uid,
            email: email,
            createdAt: new Date(),
            subscriptionPlan: "pro"
        });

        await setDoc(doc(db, "institutes", uid, "users", uid), {
            uid: uid,
            email: email,
            displayName: "Demo Admin",
            role: "admin",
            instituteId: uid
        });
        console.log("✅ Profile Created.");

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log(`⚠️ User ${email} already exists.`);
            // Try to login to verify password correct?
            try {
                await signInWithEmailAndPassword(auth, email, password);
                console.log("✅ Verified: Password is correct.");
            } catch (loginErr: any) {
                console.error("❌ User exists but password incorrect:", loginErr.code);
            }
        } else {
            console.error("❌ Error:", error.message);
        }
    }
    process.exit(0);
}

createAdmin();
