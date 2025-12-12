
export interface GradingResult {
    score: number;
    maxScore: number;
    reason: string;
    feedback: string;
}

export const gradeStudentAnswer = async (
    imageBase64: string,
    question: string,
    correctAnswer: string,
    rubric?: string
): Promise<GradingResult> => {
    try {
        const response = await fetch("/api/gemini/grade", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageBase64,
                question,
                correctAnswer,
                rubric
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to grade answer");
        }

        return await response.json();
    } catch (error) {
        console.error("Grading error:", error);
        throw error;
    }
};
