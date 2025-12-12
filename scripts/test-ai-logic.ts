// Standalone Test Script for AI Generator
// Run with: npx tsx scripts/test-ai-logic.ts

import { generateAIQuiz } from "../src/lib/ai-generator";

async function runTest() {
    console.log("🧪 STARTING TEST: AI Quiz Generator");
    console.log("-----------------------------------");

    // Test 1: Math Topic
    console.log("1️⃣ Testing Topic: 'Math'...");
    const mathQuiz = await generateAIQuiz("Math", "Medium");
    if (mathQuiz.questions.length === 3 && mathQuiz.questions[0].question.includes("value of x")) {
        console.log("✅ Math Logic: PASS");
    } else {
        console.error("❌ Math Logic: FAIL", mathQuiz);
    }

    // Test 2: Science Topic
    console.log("2️⃣ Testing Topic: 'Science'...");
    const scienceQuiz = await generateAIQuiz("Science", "Hard");
    if (scienceQuiz.questions[0].question.includes("powerhouse")) {
        console.log("✅ Science Logic: PASS");
    } else {
        console.error("❌ Science Logic: FAIL", scienceQuiz);
    }

    // Test 3: Random Topic (Fallback)
    console.log("3️⃣ Testing Topic: 'History' (Fallback)...");
    const historyQuiz = await generateAIQuiz("History", "Easy");
    if (historyQuiz.questions[0].question.includes("History")) {
        console.log("✅ Generic Logic: PASS");
    } else {
        console.error("❌ Generic Logic: FAIL", historyQuiz);
    }

    console.log("-----------------------------------");
    console.log("🎉 ALL TESTS COMPLETED");
}

runTest().catch(console.error);
