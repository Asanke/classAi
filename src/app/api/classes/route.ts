import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const instituteId = searchParams.get("instituteId");

        if (!instituteId) {
            return NextResponse.json({ error: "Institute ID required" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
        }

        const classesRef = adminDb.collection(`institutes/${instituteId}/classes`);
        const snapshot = await classesRef.get();

        const classes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { instituteId, ...classData } = body;

        if (!instituteId || !classData.title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
        }

        const newClass = {
            ...classData,
            active: true,
            createdAt: new Date(),
            studentCount: 0
        };

        const docRef = await adminDb.collection(`institutes/${instituteId}/classes`).add(newClass);

        return NextResponse.json({ id: docRef.id, ...newClass });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
