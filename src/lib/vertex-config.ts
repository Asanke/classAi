import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex with your Cloud project and location
// These should be set in your environment variables
const project = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_LOCATION || 'us-central1';

// Vercel-friendly: Accept JSON string directly instead of file path
let googleAuthOptions;
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        // CRITICAL FIX: Handle escaped newlines in private_key (common Vercel issue)
        if (credentials.private_key) {
            credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
        googleAuthOptions = { credentials };
        console.log("Vertex AI: Using Service Account Credentials from Env Var");
    } catch (e) {
        console.error("Vertex AI: Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON", e);
    }
}

const vertex_ai = new VertexAI({
    project: project || 'YOUR_PROJECT_ID',
    location: location,
    googleAuthOptions
});

export function getVertexModel(modelName: string = 'gemini-1.5-pro') {
    return vertex_ai.getGenerativeModel({
        model: modelName,
    });
}
