"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth, Role } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { FluidBackground } from "@/components/ui/fluid-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { RotatingBenefits } from "@/components/landing/rotating-benefits";

export default function PortalPage() {
  const { switchRole } = useAuth();
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    if (switchRole) switchRole(role);
    if (role === 'admin') router.push('/dashboard');
    else if (role === 'teacher') router.push('/teacher-portal');
    else if (role === 'student') router.push('/student-portal');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      <FluidBackground />

      {/* Background Gradients (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-b2u-blue/10 dark:bg-b2u-blue/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-b2u-teal/10 dark:bg-b2u-teal/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-b2u-blue to-b2u-teal p-2 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-blue to-b2u-teal">
            Tuition SaaS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-full">Log In</Button>
          </Link>
          <Link href="/register">
            <Button variant="animated" className="rounded-full px-6 shadow-md hover:shadow-xl transition-all">Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Text */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-8"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-b2u-blue via-b2u-cyan to-b2u-teal animate-gradient bg-[length:200%_200%]">
                Learning Empire
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              The all-in-one portal for Institutes, Teachers, and Students.
              Experience the future of education management with
              <span className="font-semibold text-foreground"> AI-powered insights</span>.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <RotatingBenefits />
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 pt-4">
              <Button variant="animated" size="lg" className="rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-cyan-500/20">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-lg backdrop-blur-sm hover:bg-black/5 dark:hover:bg-white/10 border-foreground/10">
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column: Role Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <GlassCard className="p-8 space-y-6 border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Select Your Portal</h2>
                <p className="text-muted-foreground">Choose your role to sign in</p>
              </div>

              <div className="grid gap-4">
                {[
                  { id: "admin", icon: ShieldCheck, title: "Institute Admin", desc: "Manage classes, payments, and staff", color: "text-b2u-blue", bg: "bg-b2u-blue", border: "hover:border-b2u-blue/50", hoverBg: "hover:bg-b2u-blue/5" },
                  { id: "teacher", icon: BookOpen, title: "Teacher Portal", desc: "Lesson plans, quizzes, and grading", color: "text-b2u-cyan", bg: "bg-b2u-cyan", border: "hover:border-b2u-cyan/50", hoverBg: "hover:bg-b2u-cyan/5" },
                  { id: "student", icon: Users, title: "Student Portal", desc: "Access lessons, quizzes, and history", color: "text-b2u-teal", bg: "bg-b2u-teal", border: "hover:border-b2u-teal/50", hoverBg: "hover:bg-b2u-teal/5" }
                ].map((role) => (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id as Role)}
                    className="cursor-pointer group"
                  >
                    <div className={`p-4 rounded-2xl border border-transparent bg-white/50 dark:bg-white/5 ${role.border} ${role.hoverBg} transition-all duration-300 flex items-center gap-4 group-hover:scale-[1.02] group-hover:shadow-lg backdrop-blur-sm`}>
                      <div className={`p-3 rounded-xl ${role.bg}/10 ${role.color} group-hover:${role.bg} group-hover:text-white transition-colors duration-300`}>
                        <role.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{role.title}</h3>
                        <p className="text-xs text-muted-foreground">{role.desc}</p>
                      </div>
                      <ArrowRight className={`opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 ${role.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
