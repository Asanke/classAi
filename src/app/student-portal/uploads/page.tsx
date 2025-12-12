"use client";

import { UploadForm } from "@/components/uploads/UploadForm";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { FileText, Clock, CheckCircle2 } from "lucide-react";

export default function StudentUploadsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="My Uploads"
                description="Submit your assignments, homework, and question papers here."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">New Submission</h2>
                            <p className="text-sm text-muted-foreground">Select the relevant subject and upload your work.</p>
                        </div>
                        <UploadForm />
                    </Card>
                </div>

                {/* History Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold px-1">Recent Submissions</h2>
                    <div className="space-y-4">
                        {[
                            { title: "Algebra Homework 3.pdf", subject: "Mathematics", date: "Today, 10:30 AM", status: "Submitted" },
                            { title: "Physics Lab Report.docx", subject: "Science", date: "Yesterday, 4:15 PM", status: "Graded" },
                            { title: "History Essay - WWII.pdf", subject: "History", date: "Dec 10, 2025", status: "Submitted" },
                        ].map((item, i) => (
                            <Card key={i} className="p-4 border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-b2u-blue/10 text-b2u-cyan group-hover:scale-110 transition-transform duration-300">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground">{item.subject} • {item.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {item.status}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
