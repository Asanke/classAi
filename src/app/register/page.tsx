"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; // Ensure db is exported from firebase.ts
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ROLES } from "@/lib/roles";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        instituteName: "",
        ownerName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");

        try {
            console.log("Starting registration...");
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            console.log("Auth user created:", user.uid);

            // 2. Update Profile
            await updateProfile(user, {
                displayName: formData.ownerName,
            });
            console.log("Profile updated");

            // 3. Create Institute Document
            const instituteId = user.uid;

            await setDoc(doc(db, "institutes", instituteId), {
                name: formData.instituteName,
                ownerId: user.uid,
                email: formData.email,
                phone: formData.phone,
                createdAt: new Date(),
                subscriptionPlan: "free",
            });
            console.log("Institute doc created");

            // 4. Create User Profile
            await setDoc(doc(db, `institutes/${instituteId}/users`, user.uid), {
                uid: user.uid,
                email: formData.email,
                displayName: formData.ownerName,
                role: ROLES.ADMIN,
                instituteId: instituteId,
            });
            console.log("User profile created. Redirecting...");

            router.push("/dashboard");
        } catch (err: any) {
            console.error("Registration error full:", err);
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">Register Institute</CardTitle>
                    <CardDescription className="text-center">
                        Create a new account for your tuition institute
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="instituteName">Institute Name</Label>
                                <Input
                                    id="instituteName"
                                    placeholder="Wisdom Academy"
                                    required
                                    value={formData.instituteName}
                                    onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input
                                    id="ownerName"
                                    placeholder="John Doe"
                                    required
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@institute.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="0771234567"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading} variant="animated">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
