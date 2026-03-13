"use client"
import { SaveSubCategoryAction } from '@/actions/SaveSubCategoryAction';
import { uploadFileToServer } from '@/lib/client-upload';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import AlertSoftSuccessDemo from '@/components/ui/alert-23';
import { Switch } from "@/components/ui/switch";
import { deleteRow } from '@/actions/delete-action';
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SubCategoryData = {
    SubCategoryID?: number;
    CategoryID: number;
    SubCategoryName?: string;
    LogoPath?: string | null;
    IsActive?: boolean | null;
    Description?: string | null;
    UserID?: number;
}

interface SubCategoryFormProps {
    subCategory?: SubCategoryData;
    categoryId?: number; // For new sub-categories
}

export default function SubCategoryForm({ subCategory, categoryId }: SubCategoryFormProps) {
    const router = useRouter(); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [isDeleting, setIsDeleting] = useState(false);

    // If editing, use subCategory.CategoryID, else use passed categoryId
    const effectiveCategoryId = subCategory?.CategoryID || categoryId;

    const [isActive, setIsActive] = useState<boolean>(subCategory?.IsActive ?? true);
    const [attachmentName, setAttachmentName] = useState<string>(subCategory?.SubCategoryName || "subcategory-logo");
    
    // Controlled state for Logo Path
    const [logoPath, setLogoPath] = useState<string | null>(subCategory?.LogoPath || null);
    
    // Staged file for manual upload
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        
        try {
            // Manual Upload Step
            if (selectedFile) {
                try {
                    toast.info("Uploading icon...");
                    const uploadResult = await uploadFileToServer(selectedFile, "/expense-manager/subcategories", attachmentName);
                     if (uploadResult?.url) {
                        formData.set("LogoPath", uploadResult.url);
                        setLogoPath(uploadResult.url); 
                    }
                } catch (uploadError) {
                    console.error("File upload failed", uploadError);
                    toast.error("Failed to upload icon.");
                    setIsSubmitting(false);
                    return;
                }
            } else if (logoPath === null || logoPath === "") {
                formData.set("LogoPath", "");
            } else {
                 formData.set("LogoPath", logoPath);
            }

            const result = await SaveSubCategoryAction(formData);

            if (result.success) {
                toast.custom(() => (
                    <AlertSoftSuccessDemo 
                        title="Success"
                        description={result.message}
                        variant="success"
                    />
                ));
                router.push(`/admin/categories/${effectiveCategoryId}`);
                router.refresh();
            } else {
                toast.custom(() => (
                    <AlertSoftSuccessDemo 
                        title="Error"
                        description={result.message}
                        variant="error"
                    />
                ));
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.custom(() => (
                <AlertSoftSuccessDemo 
                    title="Error"
                    description="An unexpected error occurred."
                    variant="error"
                />
            ));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!subCategory?.SubCategoryID || !effectiveCategoryId) return;
        setIsDeleting(true);
        try {
            await deleteRow("sub_categories", subCategory.SubCategoryID.toString(), `/admin/categories/${effectiveCategoryId}`);
            toast.custom(() => (
                <AlertSoftSuccessDemo title="Deleted" description="Sub-Category deleted successfully." variant="success" />
            ));
            router.push(`/admin/categories/${effectiveCategoryId}`);
            router.refresh();
        } catch (error) {
             console.error(error);
             toast.custom(() => (
                <AlertSoftSuccessDemo title="Error" description={error instanceof Error ? error.message : "Failed to delete sub-category."} variant="error" />
            ));
        } finally {
            setIsDeleting(false);
        }
    }

    if (!effectiveCategoryId) {
        return <div>Error: Category ID missing</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto pb-10">
            <input type="hidden" name="id" value={subCategory?.SubCategoryID || ""} />
            <input type="hidden" name="CategoryID" value={effectiveCategoryId} />
            <input type="hidden" name="UserID" value={subCategory?.UserID || "1"} />
            <input type="hidden" name="IsActive" value={String(isActive)} />

            <div className="flex items-center justify-between mb-6">
                 <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {subCategory ? "Edit Sub-Category" : "Create Sub-Category"}
                    </h1>
                     <p className="text-muted-foreground">
                        {subCategory ? `Manage details for ${subCategory.SubCategoryName}` : "Add a new sub-category."}
                    </p>
                </div>
                {subCategory && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm" type="button">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="SubCategoryName">Name</Label>
                                <Input 
                                    type="text" 
                                    id="SubCategoryName"
                                    name="SubCategoryName" 
                                    defaultValue={subCategory?.SubCategoryName || ""} 
                                    required 
                                    placeholder="e.g. Electricity, Bonus"
                                    className="h-10"
                                    onChange={(e) => setAttachmentName(e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="Description">Description</Label>
                                <Textarea 
                                    id="Description"
                                    name="Description" 
                                    defaultValue={subCategory?.Description || ""} 
                                    placeholder="Optional notes..."
                                    className="min-h-[100px] resize-y"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label htmlFor="IsActive-switch" className="text-base">Active</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Enable/Disable.
                                    </p>
                                </div>
                                <Switch
                                    id="IsActive-switch"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Icon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <FileUpload 
                                    name="file" 
                                    accept="image/*"
                                    value={null} 
                                    currentFilePath={logoPath}
                                    customName={attachmentName}
                                    folder="/expense-manager/subcategories"
                                    manualUpload={true}
                                    onFileChange={(file) => {
                                        setSelectedFile(file);
                                        if (file === null) setLogoPath(null);
                                    }}
                                    className="bg-background"
                                />
                                <input 
                                    type="hidden" 
                                    name="LogoPath" 
                                    value={logoPath || ""} 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                subCategory ? "Update Sub-Category" : "Create Sub-Category"
                            )}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="lg" 
                            className="w-full"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
