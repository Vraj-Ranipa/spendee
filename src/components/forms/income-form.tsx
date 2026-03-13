"use client"
import { SaveIncomeAction } from '@/actions/SaveIncomeAction';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox-08";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import AlertSoftSuccessDemo from '@/components/ui/alert-23';

type Category = { CategoryID: number; CategoryName: string; LogoPath?: string | null };
type SubCategory = { SubCategoryID: number; CategoryID: number; SubCategoryName: string; LogoPath?: string | null };
type People = { PeopleID: number; PeopleName: string; Email?: string | null; users?: { ProfileImage: string | null } | null };
type Project = { ProjectID: number; ProjectName: string; ProjectLogo?: string | null };

type IncomeData = {
    IncomeID?: number;
    Amount?: any;
    IncomeDate?: Date | string;
    Description?: string | null;
    UserID?: number;
    CategoryID?: number | null;
    SubCategoryID?: number | null;
    PeopleID?: number | null;
    ProjectID?: number | null;
    IncomeDetail?: string | null;
    AttachmentPath?: string | null;
}

interface IncomeFormProps {
    income?: IncomeData;
    categories: Category[];
    subCategories: SubCategory[];
    people: People[];
    projects: Project[];
}

export default function IncomeForm({ income, categories, subCategories, people, projects }: IncomeFormProps) {
    const router = useRouter(); 
    const [selectedCategory, setSelectedCategory] = useState<string>(income?.CategoryID?.toString() || "");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>(income?.SubCategoryID?.toString() || "");
    const [selectedPeople, setSelectedPeople] = useState<string>(income?.PeopleID?.toString() || "");
    const [selectedProject, setSelectedProject] = useState<string>(income?.ProjectID?.toString() || "");
    const [attachmentName, setAttachmentName] = useState<string>("image");
    const [isSubmitting, setIsSubmitting] = useState(false); 
    
    const [date, setDate] = useState<Date | undefined>(
        income?.IncomeDate ? new Date(income.IncomeDate) : new Date()
    );

    // const [selectedFile, setSelectedFile] = useState<File | null>(null); // Removed
    const [attachmentPath, setAttachmentPath] = useState<string | null>(income?.AttachmentPath || null);

    const filteredSubCategories = subCategories.filter(
        sc => sc.CategoryID.toString() === selectedCategory
    );

    useEffect(() => {
        if (selectedCategory !== income?.CategoryID?.toString()) {
             const isValid = subCategories.find(sc => sc.SubCategoryID.toString() === selectedSubCategory && sc.CategoryID.toString() === selectedCategory);
             if (!isValid) setSelectedSubCategory("");
        }
    }, [selectedCategory, subCategories, selectedSubCategory, income]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            // Manual Upload logic removed - handled by Server Action via FileUpload input
            // if (selectedFile) ... removed

            const result = await SaveIncomeAction(formData);

            if (result.success) {
                toast.custom(() => (
                    <AlertSoftSuccessDemo 
                        title="Success"
                        description={result.message}
                        variant="success"
                    />
                ));
                router.push("/incomes");
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
        <Card className="w-full max-w-7xl mx-auto pb-10">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="id" value={income?.IncomeID || ""} />
                    <input type="hidden" name="UserID" value={income?.UserID || "1"} />
                    
                    <input type="hidden" name="CategoryID" value={selectedCategory} />
                    <input type="hidden" name="SubCategoryID" value={selectedSubCategory} />
                    <input type="hidden" name="PeopleID" value={selectedPeople} />
                    <input type="hidden" name="ProjectID" value={selectedProject} />
                    
                    <input type="hidden" name="IncomeDate" value={date ? format(date, "yyyy-MM-dd") : ""} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 flex flex-col">
                            <Label htmlFor="IncomeDate">Income Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-10",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(date) => date > new Date()}
                                        className="rounded-lg border shadow-sm"
                                        captionLayout="dropdown"
                                        fromYear={2000}
                                        toYear={new Date().getFullYear()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="Amount">Amount</Label>
                            <Input 
                                type="number" 
                                step="0.01" 
                                id="Amount"
                                name="Amount" 
                                defaultValue={income?.Amount ? Number(income.Amount) : ""} 
                                required 
                                placeholder="0.00"
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Payer/People</Label>
                            <Combobox
                                options={people.map(p => ({ 
                                    value: p.PeopleID.toString(), 
                                    label: p.PeopleName,
                                    image: p.users?.ProfileImage || "" 
                                }))}
                                value={selectedPeople}
                                onChange={setSelectedPeople}
                                placeholder="Select Payer"
                                searchPlaceholder="Search payer..."
                                emptyText="No payer found."
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Combobox
                                options={categories.map(c => ({ 
                                    value: c.CategoryID.toString(), 
                                    label: c.CategoryName,
                                    image: c.LogoPath || "" 
                                }))}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                placeholder="Select Category"
                                searchPlaceholder="Search category..."
                                emptyText="No category found."
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Sub Category</Label>
                            <Combobox
                                options={filteredSubCategories.map(sc => ({ 
                                    value: sc.SubCategoryID.toString(), 
                                    label: sc.SubCategoryName,
                                    image: sc.LogoPath || "" 
                                }))}
                                value={selectedSubCategory}
                                onChange={setSelectedSubCategory}
                                placeholder="Select Sub Category"
                                searchPlaceholder="Search sub category..."
                                emptyText="No sub category found."
                                disabled={!selectedCategory}
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Combobox
                                options={projects.map(p => ({ 
                                    value: p.ProjectID.toString(), 
                                    label: p.ProjectName,
                                    image: p.ProjectLogo || ""
                                }))}
                                value={selectedProject}
                                onChange={setSelectedProject}
                                placeholder="Select Project"
                                searchPlaceholder="Search project..."
                                emptyText="No project found."
                                className="h-10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="h-full ring-0 border-0 shadow-none bg-transparent md:ring-1 md:border md:border-muted md:bg-muted/10 md:shadow-sm">
                            <CardContent className="p-0 pt-0 md:p-6 md:pt-1 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="IncomeDetail" className="font-medium text-foreground">Additional Details</Label>
                                    <Input 
                                        type="text" 
                                        id="IncomeDetail"
                                        name="IncomeDetail" 
                                        defaultValue={income?.IncomeDetail || ""} 
                                        placeholder="Brief detail..."
                                        className="bg-background h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="Description">Description (Long)</Label>
                                    <Textarea 
                                        id="Description"
                                        name="Description" 
                                        defaultValue={income?.Description || ""} 
                                        placeholder="Detailed description..."
                                        className="h-32 bg-background"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                       
                        <Card className="h-full ring-0 border-0 shadow-none bg-transparent md:ring-1 md:border md:border-muted md:bg-muted/10 md:shadow-sm">
                            <CardContent className="p-0 pt-0 md:p-6 md:pt-1 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="AttachmentName" className="font-medium text-foreground">Attachment Details</Label>
                                    <Input 
                                        type="text" 
                                        id="AttachmentName"
                                        name="AttachmentName" 
                                        placeholder="Attachment Name (e.g. Receipt)"
                                        className="bg-background h-10"
                                        value={attachmentName}
                                        onChange={(e) => setAttachmentName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FileUpload 
                                        name="file" 
                                        accept="image/*"
                                        value={null} 
                                        currentFilePath={attachmentPath}
                                        customName={attachmentName}
                                        folder="/expense-manager/incomes"
                                        manualUpload={true}
                                        onFileChange={(file) => {
                                            if (file === null) setAttachmentPath(null);
                                        }}
                                        className="bg-background"
                                    />
                                    <input 
                                        type="hidden" 
                                        name="AttachmentPath" 
                                        value={attachmentPath || ""} 
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : (income ? "Update Income" : "Save Income")}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
