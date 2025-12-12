import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GOOGLE_API_KEY, GEMINI_MODEL } from "@/lib/gemini-config";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const schema = {
    description: "Grading result schema",
    type: SchemaType.OBJECT,
    properties: {
        score: { type: SchemaType.NUMBER, description: "Score awarded (e.g. 0-5)" },
        maxScore: { type: SchemaType.NUMBER, description: "Maximum possible score" },
        reason: { type: SchemaType.STRING, description: "Detailed explanation for the score" },
        feedback: { type: SchemaType.STRING, description: "Constructive feedback for the student" }
    },
    required: ["score", "maxScore", "reason", "feedback"]
};

export async function POST(req: Request) {
    try {
        const { imageBase64, question, correctAnswer, rubric, maxScore = 5 } = await req.json();

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema as any,
            },
        });

        // Clean base64 string if it contains metadata
        const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

        const prompt = `
      You are an expert teacher grading a student's answer.
      
      Question: "${question}"
      Correct Answer Key: "${correctAnswer}"
      Grading Rubric: "${rubric || "Award distinct points for correct steps. Partial credit allowed."}"
      Max Score: ${maxScore}

      Look at the image provided which contains the student's handwritten or typed answer.
      Grade it fairly. Return the score, reason, and constructive feedback.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: cleanBase64,
                    mimeType: "image/jpeg", // Assuming JPEG for simplicity, can make dynamic if needed
                },
            },
        ]);

        const gradingData = JSON.parse(result.response.text());

        return NextResponse.json(gradingData);
    } catch (error) {
        console.error("Gemini Grading Error:", error);
        return NextResponse.json(
            { error: "Failed to grade answer" },
            { status: 500 }
        );
    }
}
