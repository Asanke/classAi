"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TeacherClassesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-cyan to-b2u-blue">
                My Classes
            </h1>
            <GlassCard>
                <CardHeader>
                    <CardTitle>Allocated Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg">
                        <div className="bg-b2u-blue/20 p-3 rounded-md">
                            <Users className="text-b2u-blue" />
                        </div>
                        <div>
                            <h3 className="font-bold">Grade 11 Mathematics</h3>
                            <p className="text-sm text-muted-foreground">Monday & Wednesday • 3:30 PM</p>
                        </div>
                        <div className="ml-auto">
                            <span className="text-xs bg-b2u-teal/20 text-b2u-teal px-2 py-1 rounded">Active</span>
                        </div>
                    </div>
                </CardContent>
            </GlassCard>
        </div>
    );
}
