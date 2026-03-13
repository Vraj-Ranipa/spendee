"use client"
import { SaveProjectAction } from '@/actions/SaveProjectAction';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import AlertSoftSuccessDemo from '@/components/ui/alert-23';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type ProjectData = {
    ProjectID?: number;
    ProjectName?: string;
    ProjectStartDate?: Date | string | null;
    ProjectEndDate?: Date | string | null;
    ProjectDetail?: string | null;
    Description?: string | null;
    ProjectLogo?: string | null;
    IsActive?: boolean | null;
    UserID?: number;
}

interface ProjectFormProps {
    project?: ProjectData;
}

export default function ProjectForm({ project }: ProjectFormProps) {
    const router = useRouter(); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [attachmentName, setAttachmentName] = useState<string>(project?.ProjectName || "project-logo");
    const [isActive, setIsActive] = useState<boolean>(project?.IsActive !== false); // Default true
    
    // Controlled state for Project Logo
    const [logoPath, setLogoPath] = useState<string | null>(project?.ProjectLogo || null);
    
    // Staged file for manual upload
    // const [selectedFile, setSelectedFile] = useState<File | null>(null); // Removed

    const [startDate, setStartDate] = useState<Date | undefined>(
        project?.ProjectStartDate ? new Date(project.ProjectStartDate) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        project?.ProjectEndDate ? new Date(project.ProjectEndDate) : undefined
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        
        if (startDate) formData.set("ProjectStartDate", format(startDate, "yyyy-MM-dd"));
        if (endDate) formData.set("ProjectEndDate", format(endDate, "yyyy-MM-dd"));
        
        try {
            // Manual Upload logic removed - handled by Server Action via FileUpload input
            // if (selectedFile) ... removed

            const result = await SaveProjectAction(formData);

            if (result.success) {
                toast.custom(() => (
                    <AlertSoftSuccessDemo 
                        title="Success"
                        description={result.message}
                        variant="success"
                    />
                ));
                router.push("/admin/projects");
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

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto pb-10">
            <input type="hidden" name="id" value={project?.ProjectID || ""} />
            <input type="hidden" name="UserID" value={project?.UserID || "1"} />
            <input type="hidden" name="AttachmentName" value={attachmentName} />
            <input type="hidden" name="IsActive" value={String(isActive)} />

            <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
                
                <div className="lg:col-span-5 space-y-6">
                    
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6 ">
                        <Card className="h-full ">
                            <CardHeader>
                                <CardTitle>Project Details</CardTitle>
                                <CardDescription>Basic information about this project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ProjectName">Project Name</Label>
                                    <Input 
                                        type="text" 
                                        id="ProjectName"
                                        name="ProjectName" 
                                        defaultValue={project?.ProjectName || ""} 
                                        required 
                                        placeholder="e.g. Website Redesign"
                                        className="h-10"
                                        onChange={(e) => setAttachmentName(e.target.value)}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="ProjectDetail" className="font-medium text-foreground">Short Summary</Label>
                                    <Input 
                                        type="text" 
                                        id="ProjectDetail"
                                        name="ProjectDetail" 
                                        defaultValue={project?.ProjectDetail || ""} 
                                        placeholder="Brief one-line summary..."
                                        className="h-10"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                                <CardDescription>Set the start and estimated completion dates.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="ProjectStartDate">Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal h-10",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                className="rounded-lg border shadow-sm"
                                                captionLayout="dropdown"
                                                fromYear={2000}
                                                toYear={new Date().getFullYear() + 5}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="ProjectEndDate">End Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal h-10",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={setEndDate}
                                                className="rounded-lg border shadow-sm"
                                                captionLayout="dropdown"
                                                fromYear={2000}
                                                toYear={new Date().getFullYear() + 5}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                <Label htmlFor="Description" className="sr-only">Description</Label>
                                <Textarea 
                                    id="Description"
                                    name="Description" 
                                    defaultValue={project?.Description || ""} 
                                    placeholder="Detailed overview of the project scope, goals, and requirements..."
                                    className="min-h-[200px] resize-y"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label htmlFor="IsActive" className="text-base">Active Project</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Disable to archive this project.
                                    </p>
                                </div>
                                <Switch
                                    id="IsActive"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Project Logo</CardTitle>
                            <CardDescription>Upload a visual identifier.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                <FileUpload 
                                    name="file" 
                                    accept="image/*"
                                    value={null} 
                                    currentFilePath={logoPath}
                                    customName={attachmentName}
                                    folder="/expense-manager/projects"
                                    manualUpload={true}
                                    onFileChange={(file) => {
                                        if (file === null) setLogoPath(null);
                                    }}
                                    className="bg-background"
                                />
                                <input 
                                    type="hidden" 
                                    name="ProjectLogo" 
                                    value={logoPath || ""} 
                                />
                            </div>
                        </CardContent>
                    </Card>

                     <div className="flex flex-col gap-3">
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                project ? "Update Project" : "Create Project"
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
