import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY, GEMINI_MODEL } from "@/lib/gemini-config";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export async function POST(req: Request) {
    try {
        const { lessonPlan } = await req.json();

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
        });

        const prompt = `
      You are an expert teacher.
      Based on the following lesson plan, create a quiz with 5 multiple-choice questions to test the students' understanding.
      
      Lesson Plan Topic: ${lessonPlan.topic}
      Grade: ${lessonPlan.grade}
      Learning Outcomes: ${lessonPlan.learningOutcomes.join(", ")}
      Content Summary: ${lessonPlan.sections.map((s: any) => s.title + ": " + s.content.join(" ")).join("\n")}

      Return a valid JSON object with the following structure:
      {
        "title": "string (Creative title for the quiz)",
        "topic": "${lessonPlan.topic}",
        "difficulty": "Medium",
        "questions": [
            {
                "id": "q1",
                "question": "string",
                "options": ["string", "string", "string", "string"],
                "correctAnswer": number (0-3),
                "explanation": "string (Why this answer is correct)"
            }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Robust cleaning
        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        const quizData = JSON.parse(cleanedText);

        return NextResponse.json({
            ...quizData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        });

    } catch (error) {
        console.error("Auto Quiz Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate quiz from lesson" },
            { status: 500 }
        );
    }
}
