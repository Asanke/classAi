import Link from "next/link";
import { Bell, Search, UserCircle, Sun, Moon, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Topbar() {
    const { setTheme, theme } = useTheme();
    const { logout } = useAuth();

    return (
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2 mr-8">
                <div className="bg-gradient-to-r from-b2u-blue to-b2u-teal p-1.5 rounded-lg shadow-lg">
                    <GraduationCap className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-blue to-b2u-teal hidden md:block">
                    Tuition SaaS
                </span>
            </div>

            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search students, classes, or invoices..."
                        className="pl-8 bg-white/5 border-white/10 focus-visible:ring-b2u-cyan/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="mr-2"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                </Button>
                <Link href="/settings">
                    <Button variant="ghost" size="icon">
                        <UserCircle className="h-6 w-6 text-muted-foreground" />
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout && logout()} title="Logout">
                    <LogOut className="h-5 w-5 text-destructive" />
                </Button>
            </div>
        </header>
    );
}
