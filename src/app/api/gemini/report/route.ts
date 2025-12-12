import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY, GEMINI_MODEL } from "@/lib/gemini-config";
import { db } from "@/lib/firebase"; // Note: This might be client SDK. 
// Ideally we use firebase-admin for server routes, but often client SDK works in Next.js API routes if init is correct.
// However, to be safe and avoid "window is not defined" issues if firebase.ts relies on browser,
// we might mock the data fetching or ensure firebase.ts is universal.
// For this specific tasks, I'll assume firebase.ts exports a valid db instance for Node environment 
// (or uses firebase-admin which is better). 
// Given the existing project structure, I will attempt to use the existing `getDocument` / `getDocs` if possible, 
// OR simpler: receive the attempts data from the client (Client fetches data, Server generates report).
// Sending data to server is safer for the API Key.

// REVISED STRATEGY: Client fetches Firestore data (Memory), sends to Server. Server uses Gemini (Intelligence).

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export async function POST(req: Request) {
    try {
        const { attempts, studentName } = await req.json();

        if (!attempts || attempts.length === 0) {
            return NextResponse.json({ report: "No recent activity found to report on." });
        }

        const performanceSummary = attempts.map((a: any) =>
            `- Question: ${a.question}\n  Score: ${a.grading.score}/5\n  Feedback: ${a.grading.feedback}`
        ).join("\n\n");

        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        const prompt = `
        You are a gentle, constructive teacher reporting to a parent.
        Student: ${studentName || "The Student"}
        
        Performance Data:
        ${performanceSummary}

        Generate a short paragraph summarizing the student's progress. 
        Highlight strengths and areas for improvement. 
        Tone: Encouraging but honest.
    `;

        const result = await model.generateContent(prompt);
        const report = result.response.text();

        return NextResponse.json({ report });
    } catch (error) {
        console.error("Report Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        );
    }
}
