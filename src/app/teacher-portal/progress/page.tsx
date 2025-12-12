"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function TeacherProgressPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-cyan to-b2u-blue">
                Student Progress
            </h1>
            <GlassCard className="h-[400px] flex items-center justify-center text-center p-8">
                <div>
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Performance Analytics</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Detailed student performance metrics and AI-driven insights will appear here once quiz data is available.
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
