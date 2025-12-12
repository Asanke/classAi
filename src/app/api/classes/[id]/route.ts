import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const { searchParams } = new URL(request.url);
        const instituteId = searchParams.get("instituteId");

        if (!instituteId) {
            return NextResponse.json({ error: "Institute ID required" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
        }

        // Parallel fetch: class details + enrolled students (subcollection if we design it that way)
        // For now, fetching class details. 
        // Design choice: Students enrolled can be a subcollection 'enrollments' or an array in class doc.
        // Subcollection is better for scalability.

        const docRef = adminDb.doc(`institutes/${instituteId}/classes/${id}`);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
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

        const docRef = adminDb.doc(`institutes/${instituteId}/classes/${id}`);
        await docRef.update(updates);

        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: "Update failed", details: error }, { status: 500 });
    }
}
