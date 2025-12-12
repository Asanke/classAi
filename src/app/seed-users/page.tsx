"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function SeedUsersPage() {
    const [status, setStatus] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const users = [
        { email: "admin2@gmail.com", role: "admin", name: "Demo Admin V2" },
        { email: "teacher2@gmail.com", role: "teacher", name: "Demo Teacher V2" },
        { email: "student2@gmail.com", role: "student", name: "Demo Student V2" }
    ];

    const seed = async () => {
        setLoading(true);
        const logs: string[] = [];

        for (const u of users) {
            try {
                // 1. Create Auth User
                await createUserWithEmailAndPassword(auth, u.email, "123456"); // Firebase requires min 6 chars, using 123456 instead of 1234
                logs.push(`✅ Created Auth: ${u.email} (Pass: 123456)`);

                // 2. Create Firestore Doc (Optional but good for real data)
                // We are not strictly using this for role check yet (checking email directly in useAuth), but good to have.
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    logs.push(`⚠️ Exists: ${u.email} (Ready to login)`);
                } else if (error.code === 'auth/weak-password') {
                    logs.push(`❌ Weak Password: ${u.email} (Firebase requires 6 chars, used 123456)`);
                } else {
                    logs.push(`❌ Error ${u.email}: ${error.message}`);
                }
            }
        }

        setStatus(logs);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassCard className="max-w-md w-full p-8 space-y-4">
                <h1 className="text-2xl font-bold text-center">Seed Demo Users (V2)</h1>
                <p className="text-sm text-muted-foreground text-center">
                    Creates admin2, teacher2, student2 accounts.<br />
                    Password will be: <b>123456</b>
                </p>

                <Button onClick={seed} disabled={loading} className="w-full bg-b2u-blue hover:bg-b2u-blue/80">
                    {loading ? "Seeding..." : "Create Demo Accounts"}
                </Button>

                <div className="space-y-2 mt-4 text-xs font-mono bg-black/20 p-4 rounded">
                    {status.length === 0 && <p className="text-muted-foreground">Waiting to start...</p>}
                    {status.map((log, i) => (
                        <div key={i} className={log.includes('❌') ? 'text-red-400' : 'text-green-400'}>
                            {log}
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
