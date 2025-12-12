import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages, role } = await req.json();
        const lastMessage = messages[messages.length - 1].text.toLowerCase();

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        let responseText = "I'm not sure how to help with that.";

        // Context-aware logic
        if (role === "admin") {
            if (lastMessage.includes("class") || lastMessage.includes("schedule")) {
                responseText = "You can manage class schedules in the 'Classes' section. Do you need to assign a teacher or change a hall?";
            } else if (lastMessage.includes("payment") || lastMessage.includes("money") || lastMessage.includes("fees")) {
                responseText = "Financial summaries are available in the Dashboard. Would you like to generate a revenue report?";
            } else if (lastMessage.includes("student") || lastMessage.includes("enroll")) {
                responseText = "To enroll a new student, use the 'Students' tab. You can also bulk import via CSV.";
            } else {
                responseText = "As an Admin, I can help you with Class Management, Financials, and User Roles. What do you need?";
            }
        } else if (role === "teacher") {
            if (lastMessage.includes("quiz") || lastMessage.includes("test")) {
                responseText = "You can generate AI quizzes in the 'Quizzes' tab. Would you like to create one for a specific topic?";
            } else if (lastMessage.includes("attendance")) {
                responseText = "Mark attendance by selecting a class provided in your schedule.";
            } else if (lastMessage.includes("lesson") || lastMessage.includes("plan")) {
                responseText = "I can help generate lesson plans based on your syllabus. Use the 'Lesson Planner' tool.";
            } else {
                responseText = "Hello Teacher! I can assist with Quizzes, Attendance, and Lesson Planning.";
            }
        } else if (role === "student") {
            if (lastMessage.includes("grade") || lastMessage.includes("score") || lastMessage.includes("result")) {
                responseText = "Your latest grades are available in the 'Progress' tab. You scored 85% in the last Math quiz!"; // Mock data
            } else if (lastMessage.includes("class") || lastMessage.includes("schedule") || lastMessage.includes("time")) {
                responseText = "Your next class is Mathematics at 4:00 PM today.";
            } else if (lastMessage.includes("homework") || lastMessage.includes("assignment")) {
                responseText = "You have 2 pending assignments due this Friday. Check the 'Assignments' section.";
            } else if (lastMessage.includes("upload") || lastMessage.includes("submit")) {
                responseText = "You can upload your answers in the 'Uploads' section (Coming Soon!).";
            } else {
                responseText = "Hi! I can help you check your Grades, Schedule, or upcoming Homework.";
            }
        } else {
            responseText = "Welcome! Please log in to get personalized assistance.";
        }

        return NextResponse.json({ text: responseText });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ text: "Sorry, I encountered an error." }, { status: 500 });
    }
}
