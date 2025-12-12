"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Phone, Mail, Calendar, CreditCard } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthChange } from "@/lib/auth";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const fetchStudent = async () => {
            const user = auth.currentUser; // Assuming standard auth state or waiting for onAuthChange
            if (user) {
                const docRef = doc(db, `institutes/${user.uid}/students/${id}`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setStudent({ id: docSnap.id, ...docSnap.data() });
                }
            }
            setLoading(false);
        };

        const unsubscribe = onAuthChange((user) => {
            if (user) fetchStudent();
        });
        return () => unsubscribe();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const user = auth.currentUser;
            if (user && student) {
                const docRef = doc(db, `institutes/${user.uid}/students/${id}`);
                await updateDoc(docRef, {
                    name: student.name,
                    grade: student.grade,
                    parentName: student.parentName,
                    parentPhone: student.parentPhone,
                    parentEmail: student.parentEmail || ""
                });
            }
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!student) return <div className="p-8">Student not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">{student.name}</h1>
                <Button variant="outline">Back to List</Button>
            </div>

            <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Profile</CardTitle>
                            <CardDescription>View and edit student information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Grade</Label>
                                        <Input value={student.grade} onChange={(e) => setStudent({ ...student, grade: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Parent Name</Label>
                                        <Input value={student.parentName} onChange={(e) => setStudent({ ...student, parentName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Parent Phone</Label>
                                        <Input value={student.parentPhone} onChange={(e) => setStudent({ ...student, parentPhone: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={saving}>
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attendance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance History</CardTitle>
                            <CardDescription>Recent class attendance records</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <Calendar className="h-12 w-12 mb-4 opacity-20" />
                                <p>No attendance records found yet.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                            <CardDescription>Details of fees paid</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <CreditCard className="h-12 w-12 mb-4 opacity-20" />
                                <p>No payment records found yet.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
