"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AIAssistant } from "./AIAssistant";
import { SpaceNetwork } from "@/components/ui/space-network";


export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname === "/";

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans relative">
            <SpaceNetwork />
            {/* Background Text Overlay - moved here to be behind content but above network */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
                <h1 className="text-[15vw] font-black text-foreground whitespace-nowrap transform -rotate-12 select-none">
                    TUITION SAAS
                </h1>
            </div>

            {!isAuthPage && <Sidebar />}
            <main className={`flex-1 transition-all duration-300 ${!isAuthPage ? "ml-64" : "w-full"}`}>
                {!isAuthPage && <Topbar />}
                <div className="p-8 md:p-12 space-y-8"> {/* Increased padding as requested */}
                    {children}
                </div>
            </main>
            {!isAuthPage && <AIAssistant />}
        </div>
    );
}
