"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { generateParentReport } from "@/lib/reporting";
import { Loader2, FileText } from "lucide-react";

export default function ParentPortalPage() {
    const [report, setReport] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async () => {
        setLoading(true);
        const result = await generateParentReport("student_123", "Alex"); // Hardcoded student for demo
        setReport(result);
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 p-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-b2u-cyan to-b2u-blue">
                Parent Portal
            </h1>

            <GlassCard className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Student: Alex</h2>
                        <p className="text-gray-400">Class: 10-A • Science</p>
                    </div>
                    <Button onClick={handleGenerateReport} disabled={loading} className="bg-b2u-purple">
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2 h-4 w-4" />}
                        Generate AI Report
                    </Button>
                </div>

                {report && (
                    <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="text-lg font-semibold mb-4 text-b2u-cyan">Weekly Progress Summary</h3>
                        <div className="prose text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {report}
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
