import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params; // classId
        const body = await request.json();
        const { instituteId, studentId } = body;

        if (!instituteId || !studentId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
        }

        // 1. Add to class's 'enrollments' subcollection
        const enrollmentRef = adminDb.collection(`institutes/${instituteId}/classes/${id}/enrollments`).doc(studentId);
        await enrollmentRef.set({
            enrolledAt: new Date(),
            studentId,
            status: "active"
        });

        // 2. Add to student's 'enrollments' map/array or subcollection for reverse lookup
        const studentRef = adminDb.doc(`institutes/${instituteId}/students/${studentId}`);
        // Using array union for simple list of classes a student is in
        await studentRef.update({
            enrolledClasses: FieldValue.arrayUnion(id)
        });

        // 3. Increment student count
        await adminDb.doc(`institutes/${instituteId}/classes/${id}`).update({
            studentCount: FieldValue.increment(1)
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Enrollment failed", details: error }, { status: 500 });
    }
}
