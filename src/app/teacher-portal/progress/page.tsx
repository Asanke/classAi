"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock Data for Phase 2 Demo
const students = [
    { name: "John Doe", studentId: "ST001", avgScore: 88, zScore: 1.5, status: "Excellent" },
    { name: "Jane Smith", studentId: "ST002", avgScore: 92, zScore: 1.8, status: "Excellent" },
    { name: "Sam Wilson", studentId: "ST003", avgScore: 75, zScore: 0.2, status: "Average" },
    { name: "Lisa Ray", studentId: "ST004", avgScore: 65, zScore: -0.8, status: "Needs Improvement" },
    { name: "Tom Brown", studentId: "ST005", avgScore: 45, zScore: -2.1, status: "Critical" },
];

export default function TeacherProgressPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-cyan to-b2u-blue">
                Student Analytics & Z-Scores
            </h1>

            <div className="grid gap-6 md:grid-cols-3">
                <GlassCard className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-400">Top Performers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" /> Z-Score {'>'} 1.0
                        </p>
                    </CardContent>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-500">Average Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">Z-Score -1.0 to 1.0</p>
                    </CardContent>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-500">At Risk (Action Needed)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" /> Z-Score {'<'} -1.0
                        </p>
                    </CardContent>
                </GlassCard>
            </div>

            <GlassCard>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-b2u-blue" />
                        Class Z-Score Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-white/10">
                                <TableHead>Student Name</TableHead>
                                <TableHead>Avg Score</TableHead>
                                <TableHead>Z-Score</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.studentId} className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">
                                        <div>{student.name}</div>
                                        <div className="text-xs text-muted-foreground">{student.studentId}</div>
                                    </TableCell>
                                    <TableCell>{student.avgScore}%</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            student.zScore > 0 ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
                                        }>
                                            {student.zScore > 0 ? "+" : ""}{student.zScore}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={
                                            student.status === "Excellent" ? "bg-green-500/20 text-green-500" :
                                                student.status === "Critical" ? "bg-red-500/20 text-red-500" :
                                                    "bg-yellow-500/20 text-yellow-500"
                                        }>
                                            {student.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {student.status === "Critical" && (
                                            <Badge variant="destructive" className="cursor-pointer">Assign Revision</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </GlassCard>
        </div>
    );
}
