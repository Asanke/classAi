"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Login error:", err);
            if (err.code === "auth/invalid-credential" &&
                (formData.email.includes("admin") || formData.email.includes("teacher") || formData.email.includes("student"))) {
                setError("DEMO ACCOUNT MISSING. Please click 'Setup Demo Accounts' below first!");
            } else {
                setError("Invalid email or password");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">Login to Tuition SaaS</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading} variant="animated">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground text-center">
                        Don&apos;t have an institute account?{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                    <div className="w-full text-center border-t pt-2">
                        <Link href="/seed-users" className="text-xs text-muted-foreground hover:text-b2u-blue flex items-center justify-center gap-1">
                            ⚡ Setup Demo Accounts
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
