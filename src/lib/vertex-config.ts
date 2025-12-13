import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex with your Cloud project and location
// These should be set in your environment variables
const project = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_LOCATION || 'us-central1';

const vertex_ai = new VertexAI({
    project: project || 'YOUR_PROJECT_ID',
    location: location
});

export function getVertexModel(modelName: string = 'gemini-1.5-flash') {
    return vertex_ai.getGenerativeModel({
        model: modelName,
    });
}
