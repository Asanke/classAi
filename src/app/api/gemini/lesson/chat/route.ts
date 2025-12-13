import { NextResponse } from "next/server";
import { getVertexModel } from "@/lib/vertex-config";

export async function POST(req: Request) {
    try {
        const { currentPlan, prompt: userPrompt, image } = await req.json();

        const model = await getVertexModel();

        let promptText = `
      You are an expert curriculum developer. 
      I will provide you with an existing JSON lesson plan and a user instruction to modify it.
      
      Current Lesson Plan JSON:
      ${JSON.stringify(currentPlan, null, 2)}

      User Instruction: "${userPrompt}"
      
      ${image ? "The user has also provided an image for context. Please incorporate relevant details from the image if applicable." : ""}

      Please return the UPDATED lesson plan as a valid JSON object. 
      Do NOT change the structure of the JSON. Only modify the content based on the instruction.
      Return ONLY the JSON.
    `;

        const parts: any[] = [{ text: promptText }];

        if (image) {
            // content is base64 string without data:image/png;base64, prefix if sent from client properly
            // ensure client sends just base64 data
            parts.push({
                inlineData: {
                    data: image.split(",")[1] || image,
                    mimeType: "image/jpeg", // Assuming JPEG or PNG. Gemini handles common types.
                },
            });
        }

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: parts }]
        });
        const text = result.response.candidates?.[0].content?.parts?.[0].text || "";

        // Robust cleaning
        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        const updatedPlan = JSON.parse(cleanedText);

        return NextResponse.json(updatedPlan);

    } catch (error) {
        console.error("Lesson Modification Error:", error);
        return NextResponse.json(
            { error: "Failed to modify lesson plan" },
            { status: 500 }
        );
    }
}
