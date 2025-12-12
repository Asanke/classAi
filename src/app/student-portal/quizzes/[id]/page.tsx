"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDocument, addDocument } from "@/lib/firestore";
import { gradeStudentAnswer, GradingResult } from "@/lib/grading";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Loader2, Upload, Camera, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Quiz, QuizQuestion } from "@/lib/ai-generator";
import Link from "next/link";

export default function QuizAttemptPage() {
    const params = useParams(); // { id: string }
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<{ [key: string]: { image: string | null, grading: GradingResult | null, isGrading: boolean } }>({});
    const [id, setId] = useState<string>("");

    // Fetch Quiz
    useEffect(() => {
        if (!params?.id) return;
        const quizId = Array.isArray(params.id) ? params.id[0] : params.id;
        setId(quizId);

        const fetchQuiz = async () => {
            const data = await getDocument("quizzes", quizId);
            if (data) {
                setQuiz(data as Quiz);
            }
            setLoading(false);
        };
        fetchQuiz();
    }, [params]);

    const handleImageUpload = (questionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAnswers(prev => ({
                    ...prev,
                    [questionId]: {
                        ...prev[questionId],
                        image: reader.result as string,
                        grading: null, // Reset grading if new image
                        isGrading: false
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGrade = async (question: QuizQuestion) => {
        const answer = answers[question.id];
        if (!answer?.image) return;

        setAnswers(prev => ({
            ...prev,
            [question.id]: { ...prev[question.id], isGrading: true }
        }));

        try {
            // Call AI Grading Service
            const result = await gradeStudentAnswer(
                answer.image,
                question.question,
                question.options[question.correctAnswer], // Pass the correct answer text
                "Grade based on correctness of derivation and final answer. Partial credit allowed."
            );

            // Save to Firestore (Memory)
            await addDocument("attempts", {
                studentId: "current_user_id", // Replace with actual auth ID in production
                quizId: id,
                questionId: question.id,
                question: question.question,
                timestamp: new Date(),
                grading: result,
                status: "completed"
            });

            setAnswers(prev => ({
                ...prev,
                [question.id]: { ...prev[question.id], grading: result, isGrading: false }
            }));

        } catch (error) {
            console.error("Grading failed", error);
            alert("Failed to grade answer. Please try again.");
            setAnswers(prev => ({
                ...prev,
                [question.id]: { ...prev[question.id], isGrading: false }
            }));
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>;
    if (!quiz) return <div className="p-12 text-center text-white">Quiz not found</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div className="flex items-center space-x-4">
                <Link href="/student-portal/quizzes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-b2u-cyan to-b2u-blue">
                        {quiz.title}
                    </h1>
                    <p className="text-gray-400">Topic: {quiz.topic} • Difficulty: {quiz.difficulty}</p>
                </div>
            </div>

            <div className="space-y-6">
                {quiz.questions.map((q, index) => {
                    const answerState = answers[q.id] || { image: null, grading: null, isGrading: false };

                    return (
                        <GlassCard key={q.id} className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold">Question {index + 1}</h3>
                                <span className="text-sm text-gray-400">5 Points</span>
                            </div>

                            <p className="text-lg">{q.question}</p>

                            {/* Answer Section */}
                            <div className="space-y-4 mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Upload your answer (Image)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(q.id, e)}
                                                className="hidden"
                                                id={`upload-${q.id}`}
                                            />
                                            <label
                                                htmlFor={`upload-${q.id}`}
                                                className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors w-fit"
                                            >
                                                <Camera className="h-4 w-4" />
                                                <span>{answerState.image ? "Change Image" : "Take Photo / Upload"}</span>
                                            </label>
                                        </div>
                                    </div>
                                    {answerState.image && (
                                        <div className="h-16 w-16 relative rounded-md overflow-hidden border border-white/20">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={answerState.image} alt="Answer" className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                </div>

                                {answerState.image && !answerState.grading && (
                                    <Button
                                        onClick={() => handleGrade(q)}
                                        disabled={answerState.isGrading}
                                        className="w-full bg-gradient-to-r from-b2u-purple to-b2u-blue"
                                    >
                                        {answerState.isGrading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                AI is Grading...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Submit for Grading
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            {/* Grading Result */}
                            {answerState.grading && (
                                <div className={`mt-4 p-4 rounded-lg border animate-in fade-in slide-in-from-top-2 ${answerState.grading.score >= 3 ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                                    }`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-lg flex items-center gap-2">
                                            {answerState.grading.score >= 3 ? (
                                                <CheckCircle2 className="text-green-400 h-5 w-5" />
                                            ) : (
                                                <XCircle className="text-red-400 h-5 w-5" />
                                            )}
                                            Score: {answerState.grading.score} / {answerState.grading.maxScore}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-200 mb-2"><span className="font-semibold">Analysis:</span> {answerState.grading.reason}</p>
                                    <p className="text-sm italic text-gray-400"><span className="font-semibold">Feedback:</span> {answerState.grading.feedback}</p>
                                </div>
                            )}
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}
