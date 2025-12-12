import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GOOGLE_API_KEY, GEMINI_MODEL } from "@/lib/gemini-config";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const schema = {
    description: "Quiz schema",
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING, description: "Title of the quiz" },
        questions: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    id: { type: SchemaType.STRING, description: "Unique ID for the question" },
                    question: { type: SchemaType.STRING, description: "The question text" },
                    options: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: "Array of 4 options"
                    },
                    correctAnswer: { type: SchemaType.INTEGER, description: "Index of the correct answer (0-3)" },
                    explanation: { type: SchemaType.STRING, description: "Explanation for the answer" }
                },
                required: ["id", "question", "options", "correctAnswer"]
            }
        }
    },
    required: ["title", "questions"]
};

export async function POST(req: Request) {
    try {
        const { topic, difficulty } = await req.json();

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const prompt = `
      Create a ${difficulty} difficulty quiz about "${topic}".
      Generate 3 multiple choice questions.
      Ensure the questions test key learning outcomes related to ${topic}.
    `;

        const result = await model.generateContent(prompt);
        const quizData = result.response.text();

        // Parse to ensure it's valid JSON before sending
        const parsedQuiz = JSON.parse(quizData);

        // Add metadata that the model might strictly miss or to ensure consistency
        const finalQuiz = {
            ...parsedQuiz,
            topic,
            difficulty,
            createdAt: new Date().toISOString(), // Send as string, convert in client
            id: Math.random().toString(36).substr(2, 9)
        };

        return NextResponse.json(finalQuiz);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate quiz" },
            { status: 500 }
        );
    }
}
