import { NextResponse } from "next/server";
import { getVertexModel } from "@/lib/vertex-config";

export async function POST(req: Request) {
    try {
        const { imageBase64, question, correctAnswer, rubric, maxScore = 5 } = await req.json();

        const model = await getVertexModel();

        // Clean base64 string
        const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

        const prompt = `
      You are an expert teacher grading a student's answer.
      
      Question: "${question}"
      Correct Answer Key: "${correctAnswer}"
      Grading Rubric: "${rubric || "Award distinct points for correct steps. Partial credit allowed."}"
      Max Score: ${maxScore}

      Look at the image provided which contains the student's handwritten or typed answer.
      Grade it fairly. Return the score, reason, and constructive feedback.
      
      Return as JSON:
      {
        "score": number,
        "maxScore": number,
        "reason": "string",
        "feedback": "string"
      }
    `;

        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: cleanBase64,
                            mimeType: "image/jpeg"
                        }
                    }
                ]
            }]
        });

        const text = result.response.candidates?.[0].content?.parts?.[0].text || "{}";

        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        const gradingData = JSON.parse(cleanedText);

        return NextResponse.json(gradingData);
    } catch (error) {
        console.error("Vertex Grading Error:", error);
        return NextResponse.json(
            { error: "Failed to grade answer" },
            { status: 500 }
        );
    }
}
