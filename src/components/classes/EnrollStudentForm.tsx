"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface EnrollStudentFormProps {
    classId: string;
    onSuccess: () => void;
}

export function EnrollStudentForm({ classId, onSuccess }: EnrollStudentFormProps) {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, `institutes/${user.uid}/students`), where("status", "==", "active"));
                const snapshot = await getDocs(q);
                setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };
        fetchStudents();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;

        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Not authenticated");

            const res = await fetch(`/api/classes/${classId}/enroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    instituteId: user.uid,
                    studentId: selectedStudent
                })
            });

            if (!res.ok) throw new Error("Enrollment failed");

            onSuccess();
        } catch (error) {
            console.error("Error enrolling student:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Select onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Student to Enroll" />
                    </SelectTrigger>
                    <SelectContent>
                        {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.grade})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={loading || !selectedStudent}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enroll Student
                </Button>
            </DialogFooter>
        </form>
    );
}
