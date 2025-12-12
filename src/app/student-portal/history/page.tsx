"use client";

import { GlassCard } from "@/components/ui/glass-card";

export default function StudentHistoryPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-teal to-b2u-blue">Lesson History</h1>
            <GlassCard className="p-12 text-center text-muted-foreground">
                You have not attended any lessons yet.
            </GlassCard>
        </div>
    );
}
