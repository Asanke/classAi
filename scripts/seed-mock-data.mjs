import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDGbO0LTl5FTV99U4N8Qkdq-jKAwTqdWbo",
    authDomain: "class-2d5f5.firebaseapp.com",
    projectId: "class-2d5f5",
    storageBucket: "class-2d5f5.firebasestorage.app",
    messagingSenderId: "820518827956",
    appId: "1:820518827956:web:5b292c5054637a397624e1",
    measurementId: "G-644640FXE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seed() {
    console.log("🚀 Starting Client-Side Seed (ESM)...");

    try {
        // 1. Login as Admin
        console.log("🔐 Logging in as admin@gmail.com...");
        const userCredential = await signInWithEmailAndPassword(auth, "admin@gmail.com", "123456");
        const user = userCredential.user;
        const uid = user.uid;
        console.log(`✅ Logged in: ${uid}`);

        // 2. Mock Data
        const instituteId = uid;

        // Define Classes
        const classes = [
            { name: "O/L Mathematics", fee: 2500, day: "Saturday", time: "08:00 AM", teacherId: "teacher-001" },
            { name: "O/L Science", fee: 2000, day: "Sunday", time: "10:00 AM", teacherId: "teacher-001" },
            { name: "A/L Physics", fee: 3500, day: "Monday", time: "04:00 PM", teacherId: "teacher-002" }
        ];

        console.log("📚 Seeding Classes...");
        const classIds = [];
        for (const c of classes) {
            const ref = await addDoc(collection(db, "institutes", instituteId, "classes"), c);
            classIds.push(ref.id);
            console.log(`   - Created Class: ${c.name} (${ref.id})`);
        }

        // Define Students
        const students = [
            { name: "Kasun Perera", email: "kasun@example.com", parentPhone: "0771234567" },
            { name: "Amal Dias", email: "amal@example.com", parentPhone: "0779876543" },
            { name: "Nimali Cooray", email: "nimali@example.com", parentPhone: "0715556666" }
        ];

        console.log("🎓 Seeding Students & Attendance...");
        for (let i = 0; i < students.length; i++) {
            const s = students[i];
            const sRef = await addDoc(collection(db, "institutes", instituteId, "students"), {
                ...s,
                enrolledClasses: [classIds[0]]
            });

            await addDoc(collection(db, "institutes", instituteId, "attendance"), {
                classId: classIds[0],
                studentId: sRef.id,
                studentName: s.name,
                date: new Date().toISOString().split('T')[0],
                status: "present",
                timestamp: new Date()
            });

            // Grades
            const score = i === 0 ? 92 : i === 1 ? 75 : 45;
            await addDoc(collection(db, "institutes", instituteId, "grades"), {
                studentId: sRef.id,
                studentName: s.name,
                classId: classIds[0],
                examName: "Term Test 1",
                score: score,
                total: 100,
                date: new Date()
            });

            // Payments
            await addDoc(collection(db, "institutes", instituteId, "payments"), {
                studentId: sRef.id,
                studentName: s.name,
                classId: classIds[0],
                amount: classes[0].fee,
                month: "December",
                status: i === 0 ? "paid" : "pending",
                date: new Date()
            });

            console.log(`   - Seeded Student: ${s.name}`);
        }

        console.log("✅ Seeding Complete!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seed Error:", error.message);
        if (error.code === 'auth/invalid-credential') {
            console.error("   -> The demo account admin@gmail.com does not exist or password changed.");
        }
        process.exit(1);
    }
}

seed();
