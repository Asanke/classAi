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

// Mock AI Service - In production, this would call OpenAI/Gemini API
export const generateAIQuiz = async (topic: string, difficulty: string): Promise<Quiz> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Dynamic generation based on topic keywords (Stub logic)
    const isMath = topic.toLowerCase().includes("math") || topic.toLowerCase().includes("algebra");
    const isScience = topic.toLowerCase().includes("science") || topic.toLowerCase().includes("physics");

    let questions: QuizQuestion[] = [];

    if (isMath) {
        questions = [
            {
                id: "q1",
                question: "What is the value of x in 2x + 4 = 12?",
                options: ["2", "3", "4", "5"],
                correctAnswer: 2,
                explanation: "2x = 8, so x = 4"
            },
            {
                id: "q2",
                question: "What is the square root of 144?",
                options: ["10", "11", "12", "13"],
                correctAnswer: 2,
            },
            {
                id: "q3",
                question: "Solve for x: x^2 - 9 = 0",
                options: ["3", "-3", "3 and -3", "9"],
                correctAnswer: 2,
            }
        ];
    } else if (isScience) {
        questions = [
            {
                id: "q1",
                question: "What is the powerhouse of the cell?",
                options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"],
                correctAnswer: 1,
            },
            {
                id: "q2",
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correctAnswer: 1,
            },
            {
                id: "q3",
                question: "What reflects light in the solar system?",
                options: ["Sun", "Stars", "Moon", "Black Hole"],
                correctAnswer: 2,
            }
        ];
    } else {
        // Generic fallback
        questions = [
            {
                id: "q1",
                question: `What is a key concept in ${topic}?`,
                options: ["Concept A", "Concept B", "Concept C", "Concept D"],
                correctAnswer: 0,
            },
            {
                id: "q2",
                question: `Who is a famous figure in ${topic}?`,
                options: ["Person A", "Person B", "Person C", "Person D"],
                correctAnswer: 1,
            },
            {
                id: "q3",
                question: `Why is ${topic} important?`,
                options: ["Reason X", "Reason Y", "Reason Z", "None of the above"],
                correctAnswer: 0,
            }
        ];
    }

    return {
        id: Math.random().toString(36).substr(2, 9),
        title: `${topic} - ${difficulty} Quiz`,
        topic: topic,
        difficulty: difficulty as any,
        questions,
        createdAt: new Date()
    };
};
