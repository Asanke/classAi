import { NextResponse } from "next/server";
import { getVertexModel } from "@/lib/vertex-config";

export async function POST(req: Request) {
    try {
        const { topic, grade, requirements } = await req.json();

        console.log(`Generating lesson plan for: ${topic}, Grade: ${grade}`);

        const model = await getVertexModel();

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
        // Vertex AI SDK specific: Access text from candidates
        const text = result.response.candidates?.[0].content?.parts?.[0].text || "";

        console.log("Raw Vertex Response:", text); // Debugging

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
