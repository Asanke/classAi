import { NextResponse } from "next/server";
import { getVertexModel } from "@/lib/vertex-config";

const schema = {
    description: "Quiz schema",
    type: "OBJECT", // SchemaType.OBJECT
    properties: {
        title: { type: "STRING", description: "Title of the quiz" },
        questions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    id: { type: "STRING", description: "Unique ID for the question" },
                    question: { type: "STRING", description: "The question text" },
                    options: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description: "Array of 4 options"
                    },
                    correctAnswer: { type: "INTEGER", description: "Index of the correct answer (0-3)" },
                    explanation: { type: "STRING", description: "Explanation for the answer" }
                },
                required: ["id", "question", "options", "correctAnswer"]
            }
        }
    },
    required: ["title", "questions"]
};

export async function POST(req: Request) {
    try {
        const { topic, difficulty, learningOutcomes } = await req.json();

        const model = await getVertexModel();

        // Note: generationConfig with responseSchema works best with Gemini 1.5 Pro/Flash
        // but Vertex SDK usage might differ slightly. simpler to prompt for JSON.

        let prompt = `
      Create a ${difficulty} difficulty quiz about "${topic}".
      Generate 3 multiple choice questions.
    `;

        if (learningOutcomes) {
            prompt += `
      The questions MUST specifically test these intended learning outcomes:
      "${learningOutcomes}"
      Ensure the questions directly assess whether a student has achieved these outcomes.
      `;
        } else {
            prompt += `
      Ensure the questions test key learning outcomes related to ${topic}.
      `;
        }

        prompt += `
        Return a valid JSON object matching this schema:
        {
            "title": "Quiz Title",
            "questions": [
                {
                    "id": "q1",
                    "question": "Question text",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswer": 0,
                    "explanation": "Why correct"
                }
            ]
        }
        Return ONLY the JSON.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.candidates?.[0].content?.parts?.[0].text || "{}";

        // Robust cleaning
        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        const parsedQuiz = JSON.parse(cleanedText);

        const finalQuiz = {
            ...parsedQuiz,
            topic,
            difficulty,
            createdAt: new Date().toISOString(),
            id: Math.random().toString(36).substr(2, 9)
        };

        return NextResponse.json(finalQuiz);
    } catch (error) {
        console.error("Vertex Grading Error:", error);
        return NextResponse.json(
            { error: "Failed to generate quiz" },
            { status: 500 }
        );
    }
}
