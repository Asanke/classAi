import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        // Helper function to extract query params if needed, but for ID it's in path
        const { searchParams } = new URL(request.url);
        const instituteId = searchParams.get("instituteId");

        if (!instituteId) {
            return NextResponse.json({ error: "Institute ID required" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
        }

        const docRef = adminDb.doc(`institutes/${instituteId}/students/${id}`);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { instituteId, ...updates } = body;

        if (!instituteId) {
            return NextResponse.json({ error: "Institute ID required" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
        }

        const docRef = adminDb.doc(`institutes/${instituteId}/students/${id}`);
        await docRef.update(updates);

        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: "Update failed", details: error }, { status: 500 });
    }
}
