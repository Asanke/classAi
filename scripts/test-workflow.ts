import { generateAIQuiz } from "../src/lib/ai-generator";

// Base URL for the running Next.js server
const BASE_URL = "http://localhost:3000";

async function runTest() {
    console.log("=== Phase A: Quiz Generation (Teacher) ===");
    try {
        const quizRes = await fetch(`${BASE_URL}/api/gemini/quiz`, {
            method: "POST",
            body: JSON.stringify({ topic: "Economics: Supply and Demand", difficulty: "Medium" })
        });
        const quiz = await quizRes.json();
        console.log("Generated Quiz:", quiz.title);
        // Find a question likely related to the graph if possible, or just use the first.
        const questionToAnswer = quiz.questions[0];
        console.log("Question to Answer:", questionToAnswer.question);

        console.log("\n=== Phase B: Grading (Student with Image) ===");

        // Mock "Demand Curve" Image (Just a small red diagnal line for testing)
        // This is a minimal valid PNG.
        const mockDemandCurve = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGD4Tw0w0gww0gww0gAAgAAC/wD/z8rwAAAAAElFTkSuQmCC";

        console.log("Grading 'Demand Curve' answer...");

        const gradeRes = await fetch(`${BASE_URL}/api/gemini/grade`, {
            method: "POST",
            body: JSON.stringify({
                imageBase64: mockDemandCurve,
                question: "Draw a demand curve.",
                correctAnswer: "A graph with Price on Y-axis, Quantity on X-axis, and a downward sloping curve.",
                rubric: "Check for downward slope. Check axis labels.",
                maxScore: 5
            })
        });
        const grade = await gradeRes.json();
        console.log("Score:", grade.score);
        console.log("Reason:", grade.reason);
        console.log("Feedback:", grade.feedback);

        console.log("\n=== Phase C: Reporting (Parent) ===");
        const reportRes = await fetch(`${BASE_URL}/api/gemini/report`, {
            method: "POST",
            body: JSON.stringify({
                studentName: "Economist Student",
                attempts: [{
                    question: "Draw a demand curve.",
                    grading: grade
                }]
            })
        });
        const report = await reportRes.json();
        console.log("Parent Report Summary:\n", report.report);

    } catch (error) {
        console.error("Test Failed (Ensure localhost:3000 is running):", error);
    }
}

runTest();
