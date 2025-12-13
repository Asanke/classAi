import { db } from "@/lib/firebase"; // Keep imports if needed, though this file seems client-side centric for API calls

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

export interface VisualAid {
    type: "image" | "diagram" | "chart";
    description: string;
    caption: string;
}

export interface LessonPlanSection {
    title: string;
    duration: string;
    content: string[];
    activity?: string;
    visualAid?: VisualAid;
}

export interface LessonPlan {
    topic: string;
    grade: string;
    learningOutcomes: string[];
    sections: LessonPlanSection[];
    homework: string;
}

// AI Service - Calls Server Side API
export const generateAIQuiz = async (topic: string, difficulty: string, learningOutcomes?: string): Promise<Quiz> => {
    try {
        const response = await fetch("/api/gemini/quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic, difficulty, learningOutcomes }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to generate quiz");
        }

        const data = await response.json();

        return {
            ...data,
            createdAt: new Date(data.createdAt || Date.now())
        };
    } catch (error) {
        console.error("Quiz generation error:", error);
        throw error;
    }
};

export const generateAILessonPlan = async (topic: string, grade: string, requirements?: string): Promise<LessonPlan> => {
    try {
        const response = await fetch("/api/gemini/lesson", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic, grade, requirements }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.details || "Failed to generate lesson plan");
        }

        return await response.json();
    } catch (error) {
        console.error("Lesson plan generation error:", error);
        throw error;
    }
};
