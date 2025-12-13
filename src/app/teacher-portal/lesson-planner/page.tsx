"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Save, FileDown, ImageIcon, Clock, BookOpen } from "lucide-react";
import { generateAILessonPlan, LessonPlan } from "@/lib/ai-generator";

export default function LessonPlanner() {
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState("");
    const [requirements, setRequirements] = useState("");
    const [plan, setPlan] = useState<LessonPlan | null>(null);

    const generatePlan = async () => {
        if (!topic || !grade) return;
        setLoading(true);
        setPlan(null); // Clear previous plan
        try {
            const generatedPlan = await generateAILessonPlan(topic, grade, requirements);
            setPlan(generatedPlan);
        } catch (error) {
            console.error("Failed to generate plan", error);
            alert("Failed to generate lesson plan. The AI might be busy or the response was invalid. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Sparkles className="text-b2u-cyan animate-pulse" />
                    AI Lesson Planner
                </h1>
                <p className="text-muted-foreground">Generate comprehensive lesson plans with visual aids in seconds.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <GlassCard className="p-6 space-y-6 h-fit">
                    <div className="space-y-2">
                        <Label>Topic / Subject</Label>
                        <Input
                            placeholder="e.g. Newton's Third Law, Photosynthesis"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Target Grade</Label>
                        <Input
                            placeholder="e.g. Grade 10, A/L Physics"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Specific Requirements (Optional)</Label>
                        <Textarea
                            placeholder="Include a practical experiment, mention specific history..."
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={generatePlan}
                        disabled={loading || !topic}
                        variant="animated"
                        className="w-full"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Plan
                    </Button>
                </GlassCard>

                {/* Output Section */}
                <div className="space-y-4">
                    {plan ? (
                        <div className="space-y-6 animate-in slide-in-from-right-10 fade-in duration-500">
                            <GlassCard className="p-6 bg-white/10 dark:bg-black/20 border-b2u-blue/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-b2u-blue">{plan.topic}</h2>
                                        <p className="text-muted-foreground">Grade: {plan.grade}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost"><Save size={16} /></Button>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Learning Outcomes */}
                            <div className="p-4 rounded-lg bg-b2u-cyan/10 border border-b2u-cyan/20">
                                <h3 className="font-semibold text-b2u-cyan mb-2 flex items-center gap-2">
                                    <BookOpen size={16} /> Learning Outcomes
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                                    {plan.learningOutcomes.map((outcome, i) => (
                                        <li key={i}>{outcome}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sections */}
                            <div className="space-y-4">
                                {plan.sections.map((section, idx) => (
                                    <GlassCard key={idx} className="p-6 hover:border-b2u-blue/30 transition-colors">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold">{section.title}</h3>
                                            <span className="flex items-center text-xs bg-white/10 px-2 py-1 rounded-full">
                                                <Clock size={12} className="mr-1" /> {section.duration}
                                            </span>
                                        </div>

                                        <ul className="space-y-2 mb-4">
                                            {section.content.map((point, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-b2u-blue mt-2 shrink-0" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>

                                        {section.visualAid && (
                                            <div className="mt-4 p-4 rounded-xl border border-dashed border-white/20 bg-black/20 flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer hover:bg-black/30 transition-colors">
                                                <div className="w-12 h-12 rounded-full bg-b2u-purple/20 flex items-center justify-center text-b2u-purple group-hover:scale-110 transition-transform">
                                                    <ImageIcon size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">Suggested Visual Aid: {section.visualAid.type}</p>
                                                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">{section.visualAid.description}</p>
                                                    <Button size="sm" variant="link" className="text-b2u-cyan mt-2">Generate Image</Button>
                                                </div>
                                            </div>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>

                            <GlassCard className="p-6 border-b2u-purple/20 bg-b2u-purple/5">
                                <h3 className="font-bold mb-2">Homework / Assessment</h3>
                                <p className="text-sm text-muted-foreground">{plan.homework}</p>
                            </GlassCard>

                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-muted-foreground">
                            {loading ? (
                                <div className="text-center space-y-2">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-b2u-cyan" />
                                    <p>Consulting AI Knowledge Base...</p>
                                </div>
                            ) : (
                                <p>Enter details to generate a plan</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
