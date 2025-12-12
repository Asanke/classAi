"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { BookOpen } from "lucide-react";

export default function StudentSubjectsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-teal to-b2u-blue">My Subjects</h1>
            <div className="grid gap-4 md:grid-cols-3">
                <GlassCard className="p-6 flex items-center gap-4">
                    <div className="bg-b2u-blue/20 p-3 rounded-lg">
                        <BookOpen className="text-b2u-blue" />
                    </div>
                    <div>
                        <h3 className="font-bold">Mathematics</h3>
                        <p className="text-sm text-muted-foreground">Grade 11</p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
