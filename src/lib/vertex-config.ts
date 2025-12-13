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
        // Handle escaped newlines in private_key
        if (credentials.private_key) {
            credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
        googleAuthOptions = { credentials };
    } catch (e) {
        console.error("Vertex AI: Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON", e);
    }
}

// Fallback: Individual env vars (Standard Vercel Pattern)
if (!googleAuthOptions && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    googleAuthOptions = {
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: privateKey,
        }
    };
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
