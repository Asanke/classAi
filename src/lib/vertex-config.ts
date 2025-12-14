import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI Client
// We use the API Key from environment variables
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.warn("⚠️ GOOGLE_API_KEY is missing from environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export function getVertexModel(modelName: string = 'gemini-1.5-flash') {
    // Return the generative model instance
    // Note: The interface is slightly different, but we'll adapt usage in the API routes
    return genAI.getGenerativeModel({ model: modelName });
}
