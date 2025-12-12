export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // Index 0-3
    explanation?: string;
}

export interface Quiz {
    id: string;
    title: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    questions: QuizQuestion[];
    createdAt: Date;
}

// AI Service - Calls Server Side API
export const generateAIQuiz = async (topic: string, difficulty: string): Promise<Quiz> => {
    try {
        const response = await fetch("/api/gemini/quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic, difficulty }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate quiz");
        }

        const data = await response.json();

        // Convert date string back to Date object if needed, or keep as string
        // The interface expects Date, so we convert
        return {
            ...data,
            createdAt: new Date(data.createdAt || Date.now())
        };
    } catch (error) {
        console.error("Quiz generation error:", error);
        throw error;
    }
};
