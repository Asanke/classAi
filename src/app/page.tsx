"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth, Role } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function PortalPage() {
  const { switchRole } = useAuth();
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    // Set role in context (mimicking login)
    if (switchRole) switchRole(role);

    // Redirect based on role
    if (role === 'admin') router.push('/dashboard');
    else if (role === 'teacher') router.push('/teacher-portal');
    else if (role === 'student') router.push('/student-portal');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-b2u-blue/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-b2u-teal/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 z-50 relative">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-b2u-blue to-b2u-teal p-2 rounded-lg shadow-lg">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-blue to-b2u-teal">
            Tuition SaaS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-white/10">Log In</Button>
          </Link>
          <Link href="/register">
            <Button variant="animated" className="rounded-full px-6">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Text */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-b2u-blue via-b2u-cyan to-b2u-teal animate-gradient bg-[length:200%_200%]">
                Learning Empire
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The all-in-one portal for Institutes, Teachers, and Students. Experience the future of education management with AI-powered insights.
            </p>
            <div className="flex gap-4 pt-4">
              <Button variant="animated" size="lg" className="rounded-full px-8">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-b2u-cyan/10">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column: Role Selection */}
          <GlassCard className="p-8 space-y-6 border-b2u-cyan/30 bg-white/5 dark:bg-black/40">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Select Your Portal</h2>
              <p className="text-muted-foreground">Choose your role to sign in</p>
            </div>

            <div className="grid gap-4">
              <div onClick={() => handleRoleSelect("admin")} className="cursor-pointer group">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-b2u-blue/10 hover:border-b2u-blue/50 transition-all duration-300 flex items-center gap-4 group-hover:scale-[1.02] group-hover:shadow-lg">
                  <div className="p-3 rounded-lg bg-b2u-blue/20 text-b2u-blue group-hover:bg-b2u-blue group-hover:text-white transition-colors">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">Institute Admin</h3>
                    <p className="text-xs text-muted-foreground">Manage classes, payments, and staff</p>
                  </div>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-b2u-blue" />
                </div>
              </div>

              <div onClick={() => handleRoleSelect("teacher")} className="cursor-pointer group">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-b2u-cyan/10 hover:border-b2u-cyan/50 transition-all duration-300 flex items-center gap-4 group-hover:scale-[1.02] group-hover:shadow-lg">
                  <div className="p-3 rounded-lg bg-b2u-cyan/20 text-b2u-cyan group-hover:bg-b2u-cyan group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">Teacher Portal</h3>
                    <p className="text-xs text-muted-foreground">Lesson plans, quizzes, and grading</p>
                  </div>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-b2u-cyan" />
                </div>
              </div>

              <div onClick={() => handleRoleSelect("student")} className="cursor-pointer group">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-b2u-teal/10 hover:border-b2u-teal/50 transition-all duration-300 flex items-center gap-4 group-hover:scale-[1.02] group-hover:shadow-lg">
                  <div className="p-3 rounded-lg bg-b2u-teal/20 text-b2u-teal group-hover:bg-b2u-teal group-hover:text-white transition-colors">
                    <Users size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">Student Portal</h3>
                    <p className="text-xs text-muted-foreground">Access lessons, quizzes, and history</p>
                  </div>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-b2u-teal" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
