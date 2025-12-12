"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function TestFirebasePage() {
    const [status, setStatus] = useState("Initializing...");
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toISOString()}: ${msg}`]);

    useEffect(() => {
        const runTest = async () => {
            try {
                addLog("Starting Firebase Test");
                addLog(`Auth Configured: ${!!auth}`);
                addLog(`Firestore Configured: ${!!db}`);

                const testEmail = `test_${Date.now()}@example.com`;
                addLog(`Attempting to create user: ${testEmail}`);

                const cred = await createUserWithEmailAndPassword(auth, testEmail, "password123");
                addLog(`User Created: ${cred.user.uid}`);

                addLog("Attempting Firestore Write...");
                await setDoc(doc(db, "test_collection", "test_doc"), {
                    test: true,
                    createdAt: new Date(),
                    uid: cred.user.uid
                });
                addLog("Firestore Write Success");

                setStatus("SUCCESS");
            } catch (error: any) {
                addLog(`ERROR: ${error.message}`);
                console.error(error);
                setStatus("FAILED");
            }
        };

        runTest();
    }, []);

    return (
        <div className="p-10 font-mono">
            <h1 className="text-2xl font-bold mb-4">Firebase Connectivity Test</h1>
            <div className={`text-xl mb-4 ${status === "SUCCESS" ? "text-green-600" : status === "FAILED" ? "text-red-600" : "text-yellow-600"}`}>
                Status: {status}
            </div>
            <div className="bg-gray-100 p-4 rounded border overflow-auto h-96">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                ))}
            </div>
        </div>
    );
}
