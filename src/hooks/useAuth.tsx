"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export type Role = "admin" | "teacher" | "student" | null;

interface AuthContextType {
    user: User | null;
    role: Role;
    loading: boolean;
    switchRole: (r: Role) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true, switchRole: () => { }, logout: async () => { } });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                // DEMO LOGIC: Hardcoded email mapping as requested
                const email = firebaseUser.email;
                if (email === "admin@gmail.com" || email === "admin2@gmail.com") {
                    setRole("admin");
                } else if (email === "teacher@gmail.com" || email === "teacher2@gmail.com") {
                    setRole("teacher");
                } else if (email === "student@gmail.com" || email === "student2@gmail.com") {
                    setRole("student");
                } else {
                    // Fallback to Firestore or default
                    setRole("student");
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Helper for manual role switching (demo)
    const switchRole = (newRole: Role) => setRole(newRole);

    const logout = async () => {
        await signOut(auth);
        setRole(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, switchRole, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
