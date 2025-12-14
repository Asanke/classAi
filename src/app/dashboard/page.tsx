"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Users, CalendarCheck, Banknote, AlertCircle, Armchair } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const data = [
    { name: "Jan", total: 45000 },
    { name: "Feb", total: 52000 },
    { name: "Mar", total: 48000 },
    { name: "Apr", total: 61000 },
    { name: "May", total: 55000 },
    { name: "Jun", total: 67000 },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-b2u-blue via-b2u-cyan to-b2u-teal">
                Institute Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                        <Users className="h-4 w-4 text-b2u-blue" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </GlassCard>
                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-b2u-teal" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">84%</div>
                        <p className="text-xs text-muted-foreground">342 students present</p>
                    </CardContent>
                </GlassCard>
                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Income</CardTitle>
                        <Banknote className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">LKR 45k</div>
                        <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                    </CardContent>
                </GlassCard>
                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Arrears</CardTitle>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">LKR 12k</div>
                        <p className="text-xs text-muted-foreground">24 students due</p>
                    </CardContent>
                </GlassCard>

                {/* NEW KPI: Seat Utilization */}
                <GlassCard className="border-b2u-cyan/50 bg-b2u-cyan/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-b2u-blue">Seat Capacity</CardTitle>
                        <Armchair className="h-4 w-4 text-b2u-cyan" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">78%</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Occupancy Rate
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                            <div className="bg-gradient-to-r from-b2u-blue to-b2u-teal h-1.5 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                    </CardContent>
                </GlassCard>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <GlassCard className="col-span-4">
                    <CardHeader>
                        <CardTitle>Income & Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2ea9d1" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#2ea9d1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `LKR ${value / 1000}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="total" stroke="#2ea9d1" fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </GlassCard>

                {/* Recent Activity */}
                <GlassCard className="col-span-3">
                    <CardHeader>
                        <CardTitle>Live Class Status</CardTitle>
                        <CardDescription>Real-time room allocation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-white/10 hover:bg-transparent">
                                    <TableHead>Class</TableHead>
                                    <TableHead>Occupancy</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">
                                        O/L Maths
                                        <div className="text-xs text-muted-foreground">Hall A</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold">45/50</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1">
                                                <div className="bg-red-500 h-1 rounded-full" style={{ width: "90%" }}></div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right"><Badge variant="default" className="bg-b2u-teal hover:bg-b2u-teal/80">Live</Badge></TableCell>
                                </TableRow>
                                <TableRow className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">
                                        A/L Physics
                                        <div className="text-xs text-muted-foreground">Hall B</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold">12/40</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1">
                                                <div className="bg-amber-500 h-1 rounded-full" style={{ width: "30%" }}></div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right"><Badge variant="secondary">Starting</Badge></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </GlassCard>
            </div>

            {/* Teacher Payroll / Payments - NEW SECTION */}
            <div className="grid gap-4">
                <GlassCard>
                    <CardHeader>
                        <CardTitle>Teacher Payroll & Commission</CardTitle>
                        <CardDescription>Manage monthly payments and commission shares</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-white/10 hover:bg-transparent">
                                    <TableHead>Teacher</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Commission Rate</TableHead>
                                    <TableHead>Total Revenue</TableHead>
                                    <TableHead>Due Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">Mr. Perera</TableCell>
                                    <TableCell>Physics (A/L)</TableCell>
                                    <TableCell>70%</TableCell>
                                    <TableCell>LKR 150,000</TableCell>
                                    <TableCell className="text-emerald-500 font-bold">LKR 105,000</TableCell>
                                    <TableCell><Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <button className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded hover:bg-emerald-500/20 transition-colors" onClick={() => alert("Payment Processed")}>
                                            Approve Payout
                                        </button>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="border-b-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium">Ms. Silva</TableCell>
                                    <TableCell>Chemistry (O/L)</TableCell>
                                    <TableCell>60%</TableCell>
                                    <TableCell>LKR 80,000</TableCell>
                                    <TableCell className="text-emerald-500 font-bold">LKR 48,000</TableCell>
                                    <TableCell><Badge variant="outline" className="text-emerald-500 border-emerald-500">Paid</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-xs text-muted-foreground">Completed</span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </GlassCard>
            </div>
        </div>

    );
}
