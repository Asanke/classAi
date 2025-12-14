"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { BookOpen, CalendarCheck, Clock, FileText, TrendingUp, Trophy, CreditCard, MessageCircleQuestion } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StudentPortalPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-b2u-teal to-b2u-blue">
                    My Learning Portal
                </h1>
                <Badge variant="outline" className="text-b2u-teal border-b2u-teal">
                    Grade 11 Student
                </Badge>
            </div>

            {/* Student KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-b2u-blue" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">Mathematics, Science, History, English</p>
                    </CardContent>
                </GlassCard>

                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-b2u-teal" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </GlassCard>

                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Quiz</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2 Days</div>
                        <p className="text-xs text-muted-foreground">Science - Chapter 5</p>
                    </CardContent>
                </GlassCard>

                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">Top 10% of class</p>
                    </CardContent>
                </GlassCard>
            </div>

            {/* Upcoming Classes & Assignments */}
            <div className="grid gap-6 md:grid-cols-2">
                <GlassCard className="col-span-1">
                    <CardHeader>
                        <CardTitle>Upcoming Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-white/10 hover:bg-transparent">
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">Mathematics</TableCell>
                                    <TableCell>Today, 4:00 PM</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className="bg-b2u-blue hover:bg-b2u-blue/80 cursor-pointer">Join Live</Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">Science</TableCell>
                                    <TableCell>Tomorrow, 2:00 PM</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="secondary">View Materials</Badge>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </GlassCard>

                <GlassCard className="col-span-1">
                    <CardHeader>
                        <CardTitle>Upcoming Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-white/10 hover:bg-transparent">
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">Mathematics</TableCell>
                                    <TableCell>Today, 4:00 PM</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className="bg-b2u-blue hover:bg-b2u-blue/80 cursor-pointer">Join Live</Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">Science</TableCell>
                                    <TableCell>Tomorrow, 2:00 PM</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="secondary">View Materials</Badge>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </GlassCard>

                {/* Payments & Actions */}
                <div className="space-y-6">
                    <GlassCard>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-md font-bold">Payments</CardTitle>
                            <Badge variant="destructive">Due: 5,000 LKR</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">Monthly tuition for Science & Math is due.</p>
                            <Button
                                className="w-full bg-gradient-to-r from-b2u-blue to-b2u-purple hover:opacity-90 transition-opacity"
                                onClick={() => alert("Payment Gateway / QR Upload Logic will go here.")}
                            >
                                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                            </Button>
                        </CardContent>
                    </GlassCard>

                    <GlassCard>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => alert("Navigate to Q&A")}>
                                <MessageCircleQuestion className="h-6 w-6 text-b2u-cyan" />
                                <span>Ask Question</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => alert("Navigate to Study Plan")}>
                                <BookOpen className="h-6 w-6 text-b2u-teal" />
                                <span>Study Plan</span>
                            </Button>
                        </CardContent>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
