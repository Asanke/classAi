"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreVertical, Mail, Phone, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const teachersData = [
    { id: 1, name: "Sarah Wilson", subject: "Mathematics", email: "sarah.w@example.com", phone: "+94 77 123 4567", status: "Active", classes: 4 },
    { id: 2, name: "David Chen", subject: "Physics", email: "david.c@example.com", phone: "+94 71 987 6543", status: "On Leave", classes: 2 },
    { id: 3, name: "Amanda Perera", subject: "English Literature", email: "amanda.p@example.com", phone: "+94 76 555 1234", status: "Active", classes: 6 },
    { id: 4, name: "Rajiv Kumar", subject: "Chemistry", email: "rajiv.k@example.com", phone: "+94 72 222 3333", status: "Active", classes: 3 },
];

export default function TeachersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-b2u-blue to-b2u-cyan">
                        Manage Teachers
                    </h1>
                    <p className="text-muted-foreground mt-1">Overview of all institute educators</p>
                </div>
                <Button variant="animated">
                    <Plus className="mr-2 h-4 w-4" /> Add Teacher
                </Button>
            </div>

            <GlassCard>
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or subject..."
                            className="pl-8 bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button variant="ghost" size="sm">Filter</Button>
                        <Button variant="ghost" size="sm">Export</Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="border-b-white/10 hover:bg-transparent">
                            <TableHead>Teacher Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Classes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachersData.map((teacher) => (
                            <TableRow key={teacher.id} className="border-b-white/10 hover:bg-white/5 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-b2u-blue/20 to-b2u-cyan/20 flex items-center justify-center text-xs font-bold text-b2u-blue">
                                            {teacher.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        {teacher.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="border-white/10 bg-white/5">
                                        {teacher.subject}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> {teacher.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" /> {teacher.phone}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm">
                                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                                        {teacher.classes} Active
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={teacher.status === 'Active' ? 'bg-b2u-teal/80 hover:bg-b2u-teal' : 'bg-yellow-500/80 hover:bg-yellow-500'}>
                                        {teacher.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </GlassCard>
        </div>
    );
}
