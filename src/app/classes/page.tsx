"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddClassForm } from "@/components/classes/AddClassForm";
import { Plus, Users, Calendar, Clock } from "lucide-react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthChange } from "@/lib/auth";
import Link from "next/link";

export default function ClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthChange((user) => {
            if (user) {
                const q = query(collection(db, `institutes/${user.uid}/classes`));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setClasses(data);
                    setLoading(false);
                });
                return () => unsubscribe();
            } else {
                setClasses([]);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Classes</h1>
                    <p className="text-muted-foreground">Manage your detailed class schedules</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Class</DialogTitle>
                            <DialogDescription>
                                Set up a new class schedule and fee structure.
                            </DialogDescription>
                        </DialogHeader>
                        <AddClassForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div>Loading classes...</div>
            ) : classes.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground border rounded-md border-dashed">
                    <p>No classes found. Create your first class to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <Link href={`/classes/${cls.id}`} key={cls.id} className="block transition-transform hover:scale-[1.02]">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-start">
                                        <span>{cls.title}</span>
                                        <span className="text-sm font-normal px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                                            Grade {cls.grade}
                                        </span>
                                    </CardTitle>
                                    <CardDescription>{cls.subject} • LKR {cls.fee}/mo</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{cls.day}s</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{cls.startTime} - {cls.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>0 Students Enrolled</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
