"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, Brain } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function TeacherQuizzesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-cyan to-b2u-blue">
                    Quiz Management
                </h1>
                <Button variant="animated">
                    <Plus className="mr-2 h-4 w-4" /> Create New Quiz
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/teacher-portal/quiz-generator">
                    <GlassCard className="dashed border-2 border-white/20 flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-white/5 transition-colors group h-full">
                        <div className="p-4 rounded-full bg-b2u-cyan/10 group-hover:scale-110 transition-transform">
                            <Brain className="h-8 w-8 text-b2u-cyan" />
                        </div>
                        <p className="mt-4 font-medium">Generate with AI</p>
                    </GlassCard>
                </Link>
            </div>

            <GlassCard>
                <CardHeader>
                    <CardTitle>Active Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No active quizzes found.</p>
                </CardContent>
            </GlassCard>
        </div>
    );
}
