"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CalendarCheck,
    CreditCard,
    BarChart3,
    Settings,
    FileText,
    GraduationCap,
    HelpCircle,
    LogOut,
    UploadCloud
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Sidebar() {
    const pathname = usePathname();
    const { role, user, logout } = useAuth(); // Assuming useAuth exposes role

    // Define menus for each role
    const adminMenu = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Students & Parents", href: "/students", icon: Users },
        { name: "Classes & Schedules", href: "/classes", icon: BookOpen },
        { name: "Attendance", href: "/attendance", icon: CalendarCheck },
        { name: "Payments", href: "/payments", icon: CreditCard },
        { name: "Teachers", href: "/teachers", icon: GraduationCap },
        { name: "Reports", href: "/reports", icon: BarChart3 },
    ];

    const teacherMenu = [
        { name: "Teacher Workspace", href: "/teacher-portal", icon: LayoutDashboard },
        { name: "Lesson Plans", href: "/teacher-portal/lesson-planner", icon: FileText },
        { name: "My Classes", href: "/teacher-portal/classes", icon: BookOpen }, // View only
        { name: "Student Progress", href: "/teacher-portal/progress", icon: BarChart3 },
        { name: "Quiz Results", href: "/teacher-portal/quizzes", icon: HelpCircle },
    ];

    const studentMenu = [
        { name: "My Portal", href: "/student-portal", icon: LayoutDashboard },
        { name: "My Subjects", href: "/student-portal/subjects", icon: BookOpen },
        { name: "Lesson History", href: "/student-portal/history", icon: FileText },
        { name: "Quizzes", href: "/student-portal/quizzes", icon: HelpCircle },
        { name: "Uploads", href: "/student-portal/uploads", icon: UploadCloud },
    ];

    // Select menu based on role
    // Default to adminMenu if no role for now (or empty)
    const items = role === "teacher" ? teacherMenu : role === "student" ? studentMenu : adminMenu;

    return (
        <aside className="w-64 bg-white/5 border-r border-white/10 h-screen flex flex-col fixed left-0 top-0 backdrop-blur-xl z-40">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-blue to-b2u-teal">
                    Tuition SaaS
                </h1>
                {role && (
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1 block">
                        {role} Portal
                    </span>
                )}
            </div>
            <nav className="flex-1 px-4 space-y-2 py-4">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group block"
                        >
                            {/* Glass Bubble Animation on Hover/Active */}
                            {(isActive) && (
                                <motion.div
                                    layoutId="bubble"
                                    className="absolute inset-0 bg-gradient-to-r from-b2u-blue/20 to-b2u-teal/20 rounded-xl border border-white/10 shadow-[0_4px_20px_0_rgba(46,209,168,0.15)] backdrop-blur-md"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className={`relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 z-10 ${isActive ? 'text-b2u-cyan' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-b2u-cyan' : 'text-muted-foreground group-hover:text-b2u-teal'}`} />
                                {item.name}
                            </div>
                            {/* Hover Bubble Effect (CSS based for smoother interaction on non-active) */}
                            <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-white/5" />
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-b2u-blue to-b2u-teal flex items-center justify-center text-white font-bold shadow-lg">
                            {user?.email?.[0].toUpperCase() || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{user?.email?.split('@')[0] || "User"}</p>
                            <p className="text-xs text-b2u-cyan uppercase">{role || "Guest"}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
