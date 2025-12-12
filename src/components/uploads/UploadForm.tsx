"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, X, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadFormProps {
    onSuccess?: () => void;
}

export function UploadForm({ onSuccess }: UploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setSuccess(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf']
        }
    });

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // TODO: Integrate Firebase Storage here
        console.log("Uploaded:", file.name);

        setUploading(false);
        setSuccess(true);
        setFile(null);
        if (onSuccess) onSuccess();
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200",
                    isDragActive ? "border-b2u-cyan bg-b2u-cyan/5" : "border-white/10 hover:border-b2u-cyan/50 hover:bg-white/5",
                    success && "border-green-500/50 bg-green-500/5"
                )}
            >
                <input {...getInputProps()} />
                {success ? (
                    <div className="flex flex-col items-center gap-2 text-green-400 animate-in zoom-in">
                        <CheckCircle className="w-12 h-12" />
                        <p className="font-medium">Upload Successful!</p>
                        <p className="text-xs text-muted-foreground">Submit another?</p>
                    </div>
                ) : file ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white/10 p-4 rounded-full">
                            <File className="w-8 h-8 text-b2u-cyan" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white/5 p-4 rounded-full mb-4">
                            <UploadCloud className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium mb-1">Upload your Assignment</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Drag & drop or click to select
                        </p>
                        <div className="flex gap-2 text-xs text-muted-foreground/60">
                            <span>PDF</span>
                            <span>•</span>
                            <span>JPG</span>
                            <span>•</span>
                            <span>PNG</span>
                            <span>(Max 10MB)</span>
                        </div>
                    </>
                )}
            </div>

            <Button
                className="w-full h-12 text-lg font-medium"
                disabled={!file || uploading}
                onClick={handleUpload}
            >
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    "Submit Assignment"
                )}
            </Button>
        </div>
    );
}
