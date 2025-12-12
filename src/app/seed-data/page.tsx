"use client";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function SeedDataPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleSeed = async () => {
        if (!user) {
            setStatus("Please login first.");
            return;
        }

        setLoading(true);
        setStatus("Seeding data...");

        try {
            // Seed Classes with B2U naming convention
            const classes = [
                { name: "Grade 11 Mathematics (O/L)", subject: "Mathematics", fee: 2500, time: "Saturday 8:00 AM" },
                { name: "Grade 11 Science (O/L)", subject: "Science", fee: 2000, time: "Sunday 10:00 AM" },
                { name: "A/L Physics 2026", subject: "Physics", fee: 3500, time: "Monday 4:00 PM" },
                { name: "A/L Chemistry 2026", subject: "Chemistry", fee: 3500, time: "Wednesday 4:00 PM" }
            ];

            const classIds = [];
            for (const c of classes) {
                const docRef = await addDoc(collection(db, "institutes", user.uid, "classes"), c);
                classIds.push(docRef.id);
            }

            // Seed Students
            const students = [
                { name: "Kamal Perera", grade: "Grade 11", parentPhone: "0771234567", email: "kamal@example.com" },
                { name: "Nimali Silva", grade: "Grade 11", parentPhone: "0777654321", email: "nimali@example.com" },
                { name: "Sunil Fernando", grade: "Grade 12", parentPhone: "0712345678", email: "sunil@example.com" },
                { name: "Amara Bandara", grade: "Grade 13", parentPhone: "0751234567", email: "amara@example.com" }
            ];

            for (const s of students) {
                await addDoc(collection(db, "institutes", user.uid, "students"), {
                    ...s,
                    enrolledClasses: [classIds[0]] // Enroll in first class by default
                });
            }

            setStatus(`Seeded ${classes.length} Classes and ${students.length} Students successfully!`);
        } catch (error) {
            console.error(error);
            setStatus("Error seeding data. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
            <GlassCard className="p-8 max-w-md w-full text-center space-y-6">
                <h1 className="text-2xl font-bold">Development Data Seeder</h1>
                <p className="text-muted-foreground">Adds sample Classes and Students to your account for testing.</p>

                {status && (
                    <div className="p-4 bg-b2u-cyan/10 text-b2u-cyan rounded-md border border-b2u-cyan/20">
                        {status}
                    </div>
                )}

                <Button
                    onClick={handleSeed}
                    disabled={loading}
                    size="lg"
                    variant="animated"
                    className="w-full"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Seed Test Data
                </Button>
            </GlassCard>
        </div>
    );
}
