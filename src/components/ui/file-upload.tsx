"use client";

import { cn } from "@/lib/utils";
import { Upload, X, File, Image as ImageIcon, Loader2, Eye } from "lucide-react";
import React, { useRef, useState, ChangeEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

interface FileUploadProps {
    name?: string;
    accept?: string;
    maxSizeMB?: number;
    value?: File | null;
    currentFilePath?: string | null;
    onChange?: (file: File | null) => void;
    onUploadComplete?: (url: string) => void;
    className?: string;
    dropzoneClassName?: string;
    manualUpload?: boolean;
    onFileChange?: (file: File | null) => void;
    customName?: string;
    folder?: string;
}

import { ImageCropper } from "@/components/ui/image-cropper";

// ... existing imports

export function FileUpload({
    name = "file",
    accept = "image/*",
    maxSizeMB = 4,
    value,
    currentFilePath,
    onChange,
    onUploadComplete,
    className,
    dropzoneClassName,
    customName,
    folder,
    manualUpload = false,
    onFileChange
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(currentFilePath || null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    React.useEffect(() => {
        if (!value && currentFilePath && !uploadedFileUrl && !preview) {
           setUploadedFileUrl(currentFilePath);
        } else if (value && !preview) { // Ensure we don't overwrite manual preview
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [value, currentFilePath, uploadedFileUrl, preview]);


    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file: File): boolean => {
        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return false;
        }
        
        setError(null);
        return true;
    };

    const uploadFile = async (file: File) => {
        // Capture previous upload ID and URL to cleanup
        const previousFileId = uploadedFileId;
        const previousUrl = uploadedFileUrl;

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        // cleanup previous session upload or existing file
        if (previousFileId || previousUrl) {
             try {
                 await fetch("/api/upload", {
                     method: "DELETE",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ 
                        fileId: previousFileId,
                        url: previousFileId ? undefined : previousUrl
                     })
                 });
             } catch (err) {
                 console.error("Failed to cleanup overwritten file:", err);
             }
        }

        const formData = new FormData();
        formData.append("file", file);
        if (customName) formData.append("customName", customName);
        if (folder) formData.append("folder", folder);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload", true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = () => {
             if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setUploadedFileUrl(response.url);
                setUploadedFileName(response.name || file.name);
                setUploadedFileId(response.fileId); 
                setUploadProgress(100);
                
                // CRITICAL FIX: Clear the input value so it's not re-submitted with the form
                if (inputRef.current) inputRef.current.value = "";

                if (onUploadComplete) onUploadComplete(response.url);
                if (onChange) onChange(null); 
            } else {
                setError("Upload failed.");
            }
            setIsUploading(false);
        };

        xhr.onerror = () => {
            setError("Upload failed.");
            setIsUploading(false);
        };

        xhr.send(formData);
    };

    const handleFileSelect = (file: File) => {
        if (isUploading) return; // Block interaction during upload

        if (validateFile(file)) {
             if (file.type.startsWith("image/")) {
                setFileToCrop(file);
                setIsCropperOpen(true);
             } else {
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
                
                if (manualUpload) {
                    // Skip auto upload
                    if (onFileChange) onFileChange(file);
                    // Clear previous URL visual if replacing
                    setUploadedFileUrl(null); 
                } else {
                    uploadFile(file);
                }
             }
        } else {
             if (inputRef.current) inputRef.current.value = "";
        }
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleFileSelect(file);
        }
    };

    const onCropComplete = (croppedFile: File) => {
        const objectUrl = URL.createObjectURL(croppedFile);
        setPreview(objectUrl);
        
        // Update the actual input file
        if (inputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(croppedFile);
            inputRef.current.files = dataTransfer.files;
        }

        if (manualUpload) {
             if (onFileChange) onFileChange(croppedFile);
             setUploadedFileUrl(null);
        } else {
             uploadFile(croppedFile);
        }
        
        setFileToCrop(null); // Reset
    };

    const removeFile = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!manualUpload) {
             setIsDeleting(true);
        }

        try {
            if (!manualUpload && (uploadedFileId || uploadedFileUrl)) {
                await fetch("/api/upload", {
                    method: "DELETE",
                    headers: {
                       "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        fileId: uploadedFileId,
                        url: uploadedFileUrl 
                    })
                });
            }

            if (inputRef.current) {
                inputRef.current.value = "";
            }
            setUploadedFileUrl(null);
            setUploadedFileName(null);
            setUploadedFileId(null);
            setPreview(null);
            setUploadProgress(0);
            
            if (manualUpload && onFileChange) onFileChange(null);
            if (onUploadComplete) onUploadComplete("");     
            if (onChange) onChange(null);
            setError(null);
            
        } catch (err) {
            console.error("Failed to delete file on cancel:", err);
        } finally {
            if (!manualUpload) setIsDeleting(false);
        }
    };

    const triggerSelect = () => {
        if (!uploadedFileUrl && !preview) {
            inputRef.current?.click();
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
             <ImageCropper 
                imageFile={fileToCrop}
                open={isCropperOpen}
                onOpenChange={setIsCropperOpen}
                onCropComplete={onCropComplete}
            />

            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full min-h-[150px] p-6 border-2 border-dashed rounded-lg transition-colors bg-background",
                    dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25",
                     (!uploadedFileUrl && !preview) && !isUploading && "cursor-pointer hover:border-primary/50 hover:bg-muted/25",
                     error ? "border-destructive/50 bg-destructive/5" : "",
                     dropzoneClassName
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerSelect}
            >
                <input
                    ref={inputRef}
                    type="file" 
                    name={name}
                    className="hidden"
                    onChange={handleChange}
                    accept={accept}
                />

                <div className="flex flex-col items-center justify-center gap-2 text-center w-full">
                    
                    {isUploading && (
                        <div className="w-full max-w-xs flex flex-col items-center gap-4">
                             {preview && (
                                <div className="w-16 h-16 rounded-md overflow-hidden border">
                                    <img src={preview} alt="Uploading" className="w-full h-full object-cover opacity-50" />
                                </div>
                            )}
                            <div className="w-full space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Uploading...</span>
                                    <span>{Math.round(uploadProgress)}%</span>
                                </div>
                                <Progress value={uploadProgress} className="h-2" />
                            </div>
                        </div>
                    )}

                    {!isUploading && (uploadedFileUrl || preview) && (
                        <div 
                            className="flex items-center gap-4 w-full max-w-sm p-2 border rounded-lg bg-card shadow-sm cursor-default"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                {(uploadedFileUrl && (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(uploadedFileUrl) || accept?.startsWith("image/"))) || preview ? (
                                     <img 
                                        src={uploadedFileUrl || preview || ""} 
                                        alt="Uploaded" 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <File className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium truncate">
                                    {uploadedFileName || "Uploaded File"}
                                </p>
                                <div className="flex items-center gap-2">
                                     <Progress value={100} className="h-1.5 flex-1" />
                                     <span className="text-[10px] text-muted-foreground">100%</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                        title="View Image"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsPreviewOpen(true);
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <DialogContent 
                                        className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-background border shadow-lg flex flex-col"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-describedby={undefined}
                                    >
                                         <div className="p-4 border-b flex items-center justify-between">
                                            <DialogTitle className="font-semibold text-foreground">Attachment Preview</DialogTitle>
                                         </div>
                                         <div className="relative w-full flex-1 min-h-[50vh] flex items-center justify-center bg-muted/20 p-4">
                                            <img 
                                                src={uploadedFileUrl || preview || ""} 
                                                alt="Preview" 
                                                className="max-w-full max-h-[75vh] object-contain rounded-md shadow-sm"
                                            />
                                         </div>
                                    </DialogContent>
                                </Dialog>
                                
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={removeFile}
                                    disabled={isDeleting}
                                    title="Remove Image"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {!isUploading && !uploadedFileUrl && !preview && (
                        <>
                            <div className="p-3 bg-muted rounded-full">
                                <Upload className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-foreground">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    SVG, PNG, JPG (max {maxSizeMB}MB)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
             {error && (
                <p className="text-xs text-destructive font-medium">{error}</p>
            )}
        </div>
    );
}
