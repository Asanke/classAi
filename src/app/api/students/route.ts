import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
    try {
        // Mock Auth Check
        // const token = request.headers.get("Authorization")?.split("Bearer ")[1];
        // const decoded = await adminAuth.verifyIdToken(token);

        // Parse query params
        const { searchParams } = new URL(request.url);
        const instituteId = searchParams.get("instituteId");

        if (!instituteId) {
            return NextResponse.json({ error: "Institute ID required" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Server misconfigured (Admin SDK)" }, { status: 500 });
        }

        const studentsRef = adminDb.collection(`institutes/${instituteId}/students`);
        const snapshot = await studentsRef.get();

        const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { instituteId, name, grade, parentPhone, parentName } = body;

        if (!instituteId || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Server misconfigured (Admin SDK)" }, { status: 500 });
        }

        const newStudent = {
            name,
            grade,
            parentName,
            parentPhone,
            active: true,
            createdAt: new Date(),
            paymentStatus: "paid", // Default
            arrears: 0
        };

        const docRef = await adminDb.collection(`institutes/${instituteId}/students`).add(newStudent);

        return NextResponse.json({ id: docRef.id, ...newStudent });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
