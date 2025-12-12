"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getDocument } from "@/lib/firestore";
import Link from "next/link";
import { Quiz } from "@/lib/ai-generator";

// Simple ID page component
export default function QuizAttemptPage({ params }: { params: Promise<{ id: string }> }) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>("");

    useEffect(() => {
        params.then((resolvedParams) => {
            setId(resolvedParams.id);
            const fetchQuiz = async () => {
                try {
                    const data = await getDocument("quizzes", resolvedParams.id);
                    if (data) {
                        setQuiz(data as Quiz);
                    }
                } catch (error) {
                    console.error("Failed to fetch quiz", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchQuiz();
        });
    }, [params]);

    const handleAnswerSelect = (optionIndex: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: optionIndex
        });
    };

    const handleNext = () => {
        if (!quiz) return;
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        let score = 0;
        quiz.questions.forEach((q, i) => {
            if (selectedAnswers[i] === q.correctAnswer) {
                score++;
            }
        });
        return score;
    };

    if (loading) return <div className="p-8 text-center">Loading quiz...</div>;
    if (!quiz) return <div className="p-8 text-center">Quiz not found</div>;

    if (showResults) {
        const score = calculateScore();
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <GlassCard className="text-center p-12">
                    <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
                    <div className="text-6xl font-bold text-b2u-green mb-4">
                        {Math.round((score / quiz.questions.length) * 100)}%
                    </div>
                    <p className="text-xl text-muted-foreground mb-8">
                        You scored {score} out of {quiz.questions.length}
                    </p>
                    <Link href="/student-portal/quizzes">
                        <Button>Back to Quizzes</Button>
                    </Link>
                </GlassCard>

                <div className="space-y-4">
                    {quiz.questions.map((q, i) => (
                        <GlassCard key={i} className={`border-l-4 ${selectedAnswers[i] === q.correctAnswer ? 'border-l-b2u-green' : 'border-l-red-500'}`}>
                            <CardHeader>
                                <CardTitle className="flex items-start gap-4">
                                    <span className="text-muted-foreground">{i + 1}.</span>
                                    <span>{q.question}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    {q.options.map((opt, optIndex) => (
                                        <div
                                            key={optIndex}
                                            className={`p-3 rounded border flex justify-between items-center
                                                ${optIndex === q.correctAnswer ? 'bg-b2u-green/10 border-b2u-green text-b2u-green' : ''}
                                                ${selectedAnswers[i] === optIndex && optIndex !== q.correctAnswer ? 'bg-red-500/10 border-red-500 text-red-500' : ''}
                                                ${selectedAnswers[i] !== optIndex && optIndex !== q.correctAnswer ? 'border-white/5 opacity-50' : ''}
                                            `}
                                        >
                                            {opt}
                                            {optIndex === q.correctAnswer && <CheckCircle2 className="h-4 w-4" />}
                                            {selectedAnswers[i] === optIndex && optIndex !== q.correctAnswer && <XCircle className="h-4 w-4" />}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </GlassCard>
                    ))}
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestionIndex];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} disabled={currentQuestionIndex === 0 && false}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Quit
                </Button>
                <div className="text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </div>
            </div>

            <GlassCard className="min-h-[400px] flex flex-col">
                <CardHeader>
                    <CardTitle className="text-xl leading-relaxed">
                        {question.question}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all
                                ${selectedAnswers[currentQuestionIndex] === index
                                    ? "border-b2u-blue bg-b2u-blue/10 shadow-[0_0_15px_rgba(0,10,255,0.2)]"
                                    : "border-white/5 hover:border-white/20 hover:bg-white/5"
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full border 
                                    ${selectedAnswers[currentQuestionIndex] === index
                                        ? "border-b2u-blue bg-b2u-blue text-white"
                                        : "border-white/20"
                                    }`}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                            </div>
                        </button>
                    ))}
                </CardContent>
                <div className="p-6 border-t border-white/10 flex justify-end">
                    <Button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="bg-b2u-blue hover:bg-b2u-blue/90 w-32"
                    >
                        {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
}

// Helper router
const router = { back: () => window.history.back() };
