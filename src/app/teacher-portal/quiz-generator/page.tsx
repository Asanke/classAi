"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateAIQuiz, Quiz } from "@/lib/ai-generator";
import { useRouter } from "next/navigation";
import { addDocument } from "@/lib/firestore";
import { Textarea } from "@/components/ui/textarea";

export default function QuizGeneratorPage() {
    const router = useRouter();
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("Medium");
    const [learningOutcomes, setLearningOutcomes] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        try {
            const generatedQuiz = await generateAIQuiz(topic, difficulty, learningOutcomes);
            setQuiz(generatedQuiz);
        } catch (error) {
            console.error("Failed to generate quiz", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!quiz) return;
        try {
            await addDocument("quizzes", {
                ...quiz,
                assignedTo: ["all"], // Simplifying for MVP
                status: "active"
            });
            alert("Quiz saved successfully!");
            router.push("/teacher-portal/quizzes");
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Failed to save quiz");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <Link href="/teacher-portal/quizzes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-cyan to-b2u-blue">
                    AI Quiz Generator
                </h1>
            </div>

            <GlassCard className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Topic</label>
                        <Input
                            placeholder="e.g. Photosynthesis, Quadratic Equations"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Difficulty</label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                    <label className="text-sm font-medium">Learning Outcomes (Optional)</label>
                    <Textarea
                        placeholder="e.g. Students should be able to define X and apply Y..."
                        value={learningOutcomes}
                        onChange={(e) => setLearningOutcomes(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                        The AI will prioritize questions that test these specific outcomes.
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={handleGenerate}
                        disabled={!topic || isGenerating}
                        className="bg-gradient-to-r from-b2u-purple to-b2u-blue hover:opacity-90 transition-opacity"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Brain className="mr-2 h-4 w-4" />
                                Generate Quiz
                            </>
                        )}
                    </Button>
                </div>
            </GlassCard>

            {quiz && (
                <div className="space-y-6 fade-in animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Generated Quiz: {quiz.title}</h2>
                        <Button onClick={handleSave} variant="outline" className="border-b2u-green text-b2u-green hover:bg-b2u-green/10">
                            <Save className="mr-2 h-4 w-4" />
                            Save to Library
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {quiz.questions.map((q, i) => (
                            <GlassCard key={q.id} className="p-6">
                                <div className="flex items-start gap-4">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-bold">
                                        {i + 1}
                                    </span>
                                    <div className="space-y-4 flex-1">
                                        <p className="font-medium text-lg">{q.question}</p>
                                        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                                            {q.options.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`p-3 rounded-lg border ${optIndex === q.correctAnswer
                                                        ? "border-b2u-green/50 bg-b2u-green/5"
                                                        : "border-white/10 bg-white/5"
                                                        }`}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
