import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GOOGLE_API_KEY, GEMINI_MODEL } from "@/lib/gemini-config";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const schema = {
    description: "Lesson Plan schema",
    type: SchemaType.OBJECT,
    properties: {
        topic: { type: SchemaType.STRING },
        grade: { type: SchemaType.STRING },
        learningOutcomes: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
        },
        sections: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING },
                    duration: { type: SchemaType.STRING },
                    content: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING }
                    },
                    activity: { type: SchemaType.STRING },
                    visualAid: {
                        type: SchemaType.OBJECT,
                        properties: {
                            type: { type: SchemaType.STRING, enum: ["image", "diagram", "chart"] },
                            description: { type: SchemaType.STRING, description: "Detailed prompt for generating this image" },
                            caption: { type: SchemaType.STRING }
                        },
                        nullable: true
                    }
                },
                required: ["title", "duration", "content"]
            }
        },
        homework: { type: SchemaType.STRING }
    },
    required: ["topic", "grade", "learningOutcomes", "sections", "homework"]
};

export async function POST(req: Request) {
    try {
        const { topic, grade, requirements } = await req.json();

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                responseMimeType: "application/json",
                // responseSchema: schema as any, // Schema validation can sometimes be too strict or fail with markdown
            },
        });

        let prompt = `
      Create a comprehensive lesson plan for Grade ${grade} students about "${topic}".
      
      Structure the lesson into logical sections (Introduction, Core Instruction, Practice, Review).
      For each section, suggest a "Visual Aid" if appropriate. This description will be used to generate an image later, so be descriptive.

      Return the response as a single valid JSON object with this structure:
      {
        "topic": "string",
        "grade": "string",
        "learningOutcomes": ["string", "string"],
        "sections": [
            {
                "title": "string",
                "duration": "string",
                "content": ["string", "string"], // Bullet points
                "activity": "string", // Optional
                "visualAid": { // Optional
                    "type": "image" | "diagram" | "chart",
                    "description": "string",
                    "caption": "string"
                }
            }
        ],
        "homework": "string"
      }
    `;

        if (requirements) {
            prompt += `\nAdditional Requirements: ${requirements}`;
        }

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Robust cleaning of markdown formatting
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let lessonPlan;
        try {
            lessonPlan = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse Gemini response raw:", text);
            console.error("Cleaned text:", cleanedText);
            return NextResponse.json(
                { error: "Invalid response format from AI" },
                { status: 500 }
            );
        }

        return NextResponse.json(lessonPlan);

    } catch (error) {
        console.error("Lesson Plan Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate lesson plan" },
            { status: 500 }
        );
    }
}
