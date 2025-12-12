"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-xl transition-all duration-300 dark:border-white/10 dark:bg-black/20",
                hoverEffect && "hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl dark:hover:bg-white/5",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-white/5 via-transparent to-black/5 dark:from-white/5 dark:to-transparent" />
            {children}
        </div>
    );
}
