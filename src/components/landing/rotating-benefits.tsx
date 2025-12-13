"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Zap, Brain, Shield, BarChart3, Users } from "lucide-react";

const benefits = [
    {
        id: 1,
        text: "AI-Powered Insights",
        subtext: "Real-time analytics for better decision making",
        icon: Brain,
        color: "text-b2u-blue",
    },
    {
        id: 2,
        text: "Automated Grading",
        subtext: "Save hours of time with instant result processing",
        icon: Zap,
        color: "text-b2u-cyan",
    },
    {
        id: 3,
        text: "Parent Communication",
        subtext: "Seamless updates and progress tracking",
        icon: Users,
        color: "text-b2u-teal",
    },
    {
        id: 4,
        text: "Secure & Private",
        subtext: "Enterprise-grade security for your institute",
        icon: Shield,
        color: "text-green-400",
    },
    {
        id: 5,
        text: "Financial Reports",
        subtext: "Track payments and expenses effortlessly",
        icon: BarChart3,
        color: "text-purple-400",
    },
];

export function RotatingBenefits() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % benefits.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col gap-4 mt-8 h-24 relative perspective-1000">
            <AnimatePresence mode="wait">
                <motion.div
                    key={benefits[index].id}
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: -90, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-4"
                >
                    <div className={`p-3 rounded-xl bg-white/10 ${benefits[index].color} backdrop-blur-md`}>
                        {(() => {
                            const Icon = benefits[index].icon;
                            return <Icon size={32} />;
                        })()}
                    </div>
                    <div>
                        <h3 className={`text-2xl font-bold ${benefits[index].color}`}>
                            {benefits[index].text}
                        </h3>
                        <p className="text-muted-foreground text-lg">
                            {benefits[index].subtext}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="flex gap-2 mt-4">
                {benefits.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-b2u-cyan" : "w-1.5 bg-muted/30"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
