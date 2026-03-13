"use client"
import { SaveCategoryAction } from '@/actions/SaveCategoryAction';
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

type CategoryData = {
    CategoryID?: number;
    CategoryName?: string;
    LogoPath?: string | null;
    IsExpense?: boolean | null;
    IsIncome?: boolean | null;
    IsActive?: boolean | null;
    Description?: string | null;
    UserID?: number;
}

interface CategoryFormProps {
    category?: CategoryData;
}

export default function CategoryForm({ category }: CategoryFormProps) {
    const router = useRouter(); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [isDeleting, setIsDeleting] = useState(false);

    // State for controlled inputs
    const [isActive, setIsActive] = useState<boolean>(category?.IsActive ?? true);
    const [isExpense, setIsExpense] = useState<boolean>(category?.IsExpense ?? false);
    const [isIncome, setIsIncome] = useState<boolean>(category?.IsIncome ?? false);
    const [attachmentName, setAttachmentName] = useState<string>(category?.CategoryName || "category-logo");
    
    // Controlled state for Logo Path
    const [logoPath, setLogoPath] = useState<string | null>(category?.LogoPath || null);
    
    // Staged file for manual upload
    // const [selectedFile, setSelectedFile] = useState<File | null>(null); // Removed

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        
        try {
            // Manual Upload logic removed - handled by Server Action via FileUpload input
            // if (selectedFile) ... removed

            const result = await SaveCategoryAction(formData);

            if (result.success) {
                toast.custom(() => (
                    <AlertSoftSuccessDemo 
                        title="Success"
                        description={result.message}
                        variant="success"
                    />
                ));
                router.push("/admin/categories");
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
        if (!category?.CategoryID) return;
        setIsDeleting(true);
        try {
            await deleteRow("categories", category.CategoryID.toString(), "/admin/categories");
            toast.custom(() => (
                <AlertSoftSuccessDemo title="Deleted" description="Category deleted successfully." variant="success" />
            ));
            router.push("/admin/categories");
            router.refresh();
        } catch (error) {
             console.error(error);
             toast.custom(() => (
                <AlertSoftSuccessDemo title="Error" description={error instanceof Error ? error.message : "Failed to delete category."} variant="error" />
            ));
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto pb-10">
            <input type="hidden" name="id" value={category?.CategoryID || ""} />
            <input type="hidden" name="UserID" value={category?.UserID || "1"} />
            <input type="hidden" name="IsActive" value={String(isActive)} />
            <input type="hidden" name="IsExpense" value={String(isExpense)} />
            <input type="hidden" name="IsIncome" value={String(isIncome)} />

            <div className="flex items-center justify-between mb-6">
                 <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {category ? "Edit Category" : "Create Category"}
                    </h1>
                     <p className="text-muted-foreground">
                        {category ? `Manage details for ${category.CategoryName}` : "Add a new category to your system."}
                    </p>
                </div>
                {category && (
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
                                    This action cannot be undone. This will permanently delete the category.
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
                            <CardTitle>Category Details</CardTitle>
                            <CardDescription>Basic information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="CategoryName">Category Name</Label>
                                <Input 
                                    type="text" 
                                    id="CategoryName"
                                    name="CategoryName" 
                                    defaultValue={category?.CategoryName || ""} 
                                    required 
                                    placeholder="e.g. Groceries, Salary"
                                    className="h-10"
                                    onChange={(e) => setAttachmentName(e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="Description">Description</Label>
                                <Textarea 
                                    id="Description"
                                    name="Description" 
                                    defaultValue={category?.Description || ""} 
                                    placeholder="Notes about this category..."
                                    className="min-h-[150px] resize-y"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col space-y-3 border p-3 rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label htmlFor="IsActive-switch" className="text-base font-medium">Active</Label>
                                    <p className="text-xs text-muted-foreground pb-2">
                                        Enable/Disable category.
                                    </p>
                                </div>
                                <Switch
                                    id="IsActive-switch"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                             <div className="flex flex-col space-y-3 border p-3 rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label htmlFor="IsExpense-switch" className="text-base font-medium">Expense</Label>
                                    <p className="text-xs text-muted-foreground pb-2">
                                        Use for expense transactions.
                                    </p>
                                </div>
                                <Switch
                                    id="IsExpense-switch"
                                    checked={isExpense}
                                    onCheckedChange={(checked) => {
                                        setIsExpense(checked);
                                        if (checked) setIsIncome(false);
                                    }}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                            <div className="flex flex-col space-y-3 border p-3 rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label htmlFor="IsIncome-switch" className="text-base font-medium">Income</Label>
                                    <p className="text-xs text-muted-foreground pb-2">
                                        Use for income transactions.
                                    </p>
                                </div>
                                <Switch
                                    id="IsIncome-switch"
                                    checked={isIncome}
                                    onCheckedChange={(checked) => {
                                        setIsIncome(checked);
                                        if (checked) setIsExpense(false);
                                    }}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Icon / Logo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <FileUpload 
                                    name="file" 
                                    accept="image/*"
                                    value={null} 
                                    currentFilePath={logoPath}
                                    customName={attachmentName}
                                    folder="/expense-manager/categories"
                                    className="bg-background"
                                    dropzoneClassName="min-h-[250px]"
                                    manualUpload={true}
                                    onFileChange={(file) => {
                                        if (file === null) setLogoPath(null);
                                    }}
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
                                category ? "Update Category" : "Create Category"
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
