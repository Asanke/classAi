"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { BookOpen, BrainCircuit, Users, FileText, Plus } from "lucide-react";
import Link from "next/link";

export default function TeacherPortal() {
    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-b2u-cyan to-b2u-teal">
                        Teacher Workspace
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage your classes and AI tools</p>
                </div>
                <Button variant="animated" className="rounded-full">
                    <Plus className="mr-2" size={18} /> New Session
                </Button>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                <Link href="/teacher-portal/lesson-planner">
                    <GlassCard hoverEffect className="h-full group cursor-pointer border-b2u-cyan/20">
                        <div className="p-6 space-y-4">
                            <div className="h-12 w-12 rounded-xl bg-b2u-cyan/20 flex items-center justify-center text-b2u-cyan group-hover:scale-110 transition-transform">
                                <BrainCircuit size={28} />
                            </div>
                            <h3 className="text-2xl font-bold">AI Lesson Planner</h3>
                            <p className="text-muted-foreground">
                                Generate structured lesson plans, quizzes, and outcomes using NotebookLM style AI.
                            </p>
                        </div>
                    </GlassCard>
                </Link>

                <GlassCard hoverEffect className="h-full group cursor-pointer border-b2u-blue/20">
                    <div className="p-6 space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-b2u-blue/20 flex items-center justify-center text-b2u-blue group-hover:scale-110 transition-transform">
                            <Users size={28} />
                        </div>
                        <h3 className="text-2xl font-bold">Student Analytics</h3>
                        <p className="text-muted-foreground">
                            View class performance, identify weak spots, and track learning outcomes.
                        </p>
                    </div>
                </GlassCard>

                <GlassCard hoverEffect className="h-full group cursor-pointer border-b2u-teal/20">
                    <div className="p-6 space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-b2u-teal/20 flex items-center justify-center text-b2u-teal group-hover:scale-110 transition-transform">
                            <FileText size={28} />
                        </div>
                        <h3 className="text-2xl font-bold">Homework & Quizzes</h3>
                        <p className="text-muted-foreground">
                            Create AI-generated quizzes and auto-grade student submissions.
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
