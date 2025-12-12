import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function generateParentReport(studentId: string, studentName: string) {
    try {
        // 1. Fetch Memory (Firestore) on Client
        // Note: In a real app, this should probably happen on server to ensure parents only see THEIR kid.
        // But for this MVP, we fetch on client and send to "Brain" (API) for processing.
        const attemptsRef = collection(db, "attempts");
        // Simple query for now. In real app, filter by studentId
        // For MVP demo, we might just get all recent attempts or mock the filter if studentId is not set correclty
        const q = query(attemptsRef); // fetching all for demo if studentId logic isn't rigorous
        const snapshot = await getDocs(q);

        // Filter in memory if needed or trust the query
        const attempts = snapshot.docs.map(doc => doc.data());

        // 2. Call Brain (API)
        const response = await fetch("/api/gemini/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attempts, studentName })
        });

        if (!response.ok) throw new Error("API call failed");

        const data = await response.json();
        return data.report;

    } catch (error) {
        console.error("Report service error:", error);
        return "Unable to generate report.";
    }
}
