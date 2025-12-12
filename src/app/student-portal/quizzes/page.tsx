"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2 } from "lucide-react";
import { getCollection } from "@/lib/firestore";
import Link from "next/link";
import { Quiz } from "@/lib/ai-generator";

export default function StudentQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await getCollection("quizzes");
                // In a real app, filter by assignedTo
                setQuizzes(data as Quiz[]);
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-teal to-b2u-blue">
                    My Quizzes
                </h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                    <GlassCard key={quiz.id} className="border-l-4 border-l-b2u-cyan">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="border-b2u-cyan text-b2u-cyan">{quiz.topic}</Badge>
                                <span className="text-xs text-muted-foreground">{quiz.difficulty}</span>
                            </div>
                            <CardTitle className="mt-2 text-xl truncate" title={quiz.title}>{quiz.title}</CardTitle>
                            <CardDescription>{quiz.questions?.length || 0} Questions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/student-portal/quizzes/${quiz.id}`}>
                                <Button className="w-full bg-b2u-cyan hover:bg-b2u-cyan/80 text-white group">
                                    <Play className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    Start Quiz
                                </Button>
                            </Link>
                        </CardContent>
                    </GlassCard>
                ))}

                {quizzes.length === 0 && (
                    <GlassCard className="col-span-full p-12 text-center text-muted-foreground">
                        <p>No quizzes assigned yet.</p>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
