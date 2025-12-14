import { NextResponse } from "next/server";
import { getVertexModel } from "@/lib/vertex-config";

export async function POST(req: Request) {
    try {
        const { attempts, studentName } = await req.json();

        if (!attempts || attempts.length === 0) {
            return NextResponse.json({ report: "No recent activity found to report on." });
        }

        const performanceSummary = attempts.map((a: any) =>
            `- Question: ${a.question}\n  Score: ${a.grading.score}/5\n  Feedback: ${a.grading.feedback}`
        ).join("\n\n");

        const model = await getVertexModel();

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
