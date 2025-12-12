"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EnrollStudentForm } from "@/components/classes/EnrollStudentForm";
import { Loader2, Calendar, Clock, UserPlus, Users } from "lucide-react";
import { doc, getDoc, collection, onSnapshot, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthChange } from "@/lib/auth";

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [classData, setClassData] = useState<any>(null);
    const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthChange(async (user) => {
            if (user) {
                // Fetch Class Details
                const docRef = doc(db, `institutes/${user.uid}/classes/${id}`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setClassData({ id: docSnap.id, ...docSnap.data() });
                }

                // Real-time Enrollments Listener
                // Note: In a real app we might fetch the actual student details for each enrollment.
                // For MVP, if enrollment doc contains snapshot or just ID, we fetch full implementation later.
                // Here assuming we fetch collection of enrollments and then might need to fetch student names.
                // For simplicity, let's assume we store minimal display info in enrollment or fetch map.

                // Revised Strategy: Just fetch student IDs from enrollments subcollection, then fetch their profiles.
                // This is complex for real-time. 
                // Simpler MVP: List enrollments.
                const enrollmentsRef = collection(db, `institutes/${user.uid}/classes/${id}/enrollments`);
                const unsubscribeEnrollments = onSnapshot(enrollmentsRef, async (snapshot) => {
                    const studentIds = snapshot.docs.map(doc => doc.id);
                    if (studentIds.length > 0) {
                        // Warning: 'in' query limited to 10 items usually or 30. 
                        // Better to fetch individually or store names in enrollment doc.
                        // For now, let's just show the IDs or fetch if small count.
                        // Let's implement storing name in enrollment on creation? No, data duplication.
                        // Let's just fetch all students and filter client side for MVP (not scalable but working for now).

                        // Actually, let's fetch individual docs.
                        const studentPromises = studentIds.map(sid => getDoc(doc(db, `institutes/${user.uid}/students/${sid}`)));
                        const studentDocs = await Promise.all(studentPromises);
                        const students = studentDocs.map(d => ({ id: d.id, ...d.data() }));
                        setEnrolledStudents(students);
                    } else {
                        setEnrolledStudents([]);
                    }
                });
                setLoading(false);
                return () => unsubscribeEnrollments();
            }
        });
        return () => unsubscribeAuth();
    }, [id]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!classData) return <div className="p-8">Class not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">{classData.title}</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" /> Enroll Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enroll Student</DialogTitle>
                            <DialogDescription>
                                Add an existing student to this class.
                            </DialogDescription>
                        </DialogHeader>
                        <EnrollStudentForm classId={String(id)} onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Class Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" /> {classData.day}s
                        </div>
                        <div className="flex items-center text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" /> {classData.startTime} - {classData.endTime}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" /> {enrolledStudents.length} Students
                        </div>
                        <div className="pt-4 border-t">
                            <div className="text-sm font-medium">Monthly Fee</div>
                            <div className="text-2xl font-bold">LKR {classData.fee}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Enrolled Students</CardTitle>
                        <CardDescription>Students currently attending this class</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Parent Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enrolledStudents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No students enrolled.</TableCell>
                                    </TableRow>
                                ) : (
                                    enrolledStudents.map((student: any) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.parentPhone}</TableCell>
                                            <TableCell>Active</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
