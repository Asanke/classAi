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
        if (!GOOGLE_API_KEY) {
            console.error("Gemini API Key is missing");
            return NextResponse.json(
                { error: "Configuration Error: API Key is missing" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { topic, grade, requirements } = body;

        console.log(`Generating lesson plan for: ${topic}, Grade: ${grade}`);

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                // responseMimeType: "application/json", // Commented out to allow for potential text preamble/markdown
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

        console.log("Raw Gemini Response:", text); // Debugging

        // Robust cleaning of markdown formatting
        let cleanedText = text.trim();
        // Remove ```json and ``` wrapping
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        let lessonPlan;
        try {
            lessonPlan = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse Gemini response raw:", text);
            console.error("Cleaned text:", cleanedText);
            return NextResponse.json(
                { error: "Invalid response format from AI", details: text },
                { status: 500 }
            );
        }

        return NextResponse.json(lessonPlan);

    } catch (error: any) {
        console.error("Lesson Plan Generation Error:", error);
        return NextResponse.json(
            { error: `Failed to generate lesson plan: ${error.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
