"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Save, FileDown } from "lucide-react";

export default function LessonPlanner() {
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState("");
    const [plan, setPlan] = useState<string | null>(null);

    const generatePlan = () => {
        if (!topic || !grade) return;
        setLoading(true);

        // Mock AI Generation delay
        setTimeout(() => {
            setPlan(`
# Lesson Plan: ${topic}
## Grade: ${grade}

### 1. Learning Outcomes
- Understand the core concepts of ${topic}.
- Apply theoretical knowledge to practical examples.
- Solve 3 complex problems related to the subject.

### 2. Introduction (10 mins)
- **Hook**: Ask students "How does ${topic} affect daily life?"
- **Activity**: Quick poll or show a 2-min video clip.

### 3. Core Instruction (30 mins)
- Explain key definitions using the whiteboard.
- **Analogy**: Compare ${topic} to a real-world system.
- Walk through Example 1 step-by-step.

### 4. Interactive Practice (15 mins)
- Group students into pairs.
- Distribute "Quiz Card A".
- **AI Tracking**: Monitor which groups finish first.

### 5. Assessment & Homework
- **Exit Ticket**: One thing they learned.
- **Homework**: Complete Section 4.2 in the workbook.
- **Next Class**: We will cover Advanced Applications.
            `);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Sparkles className="text-b2u-cyan animate-pulse" />
                    AI Lesson Planner
                </h1>
                <p className="text-muted-foreground">Generate comprehensive lesson plans in seconds.</p>
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
                        <Textarea placeholder="Include a practical experiment..." />
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
                        <GlassCard className="p-8 min-h-[500px] animate-in slide-in-from-right-10 fade-in duration-500 bg-white/10 dark:bg-black/20">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-b2u-blue">Generated Plan</h2>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost"><Save size={16} /></Button>
                                    <Button size="sm" variant="ghost"><FileDown size={16} /></Button>
                                </div>
                            </div>
                            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-mono text-sm leading-relaxed">
                                {plan}
                            </div>
                        </GlassCard>
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
