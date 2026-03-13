"use client"
import { SavePeopleAction } from '@/actions/SavePeopleAction';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

type PeopleData = {
    PeopleID?: number;
    PeopleName?: string;
    PeopleCode?: string | null;
    Email?: string;
    MobileNo?: string;
    Password?: string;
    Description?: string | null;
    IsActive?: boolean | null;
    UserID?: number;
}

interface PeopleFormProps {
    person?: PeopleData;
}

export default function PeopleForm({ person }: PeopleFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Controlled state
    const [isActive, setIsActive] = useState<boolean>(person?.IsActive ?? true);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await SavePeopleAction(formData);

            if (result.success) {
                toast.custom(() => (
                    <AlertSoftSuccessDemo
                        title="Success"
                        description={result.message}
                        variant="success"
                    />
                ));
                router.push("/admin/people");
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
        if (!person?.PeopleID) return;
        setIsDeleting(true);
        try {
            await deleteRow("peoples", person.PeopleID.toString(), "/admin/people");
            toast.custom(() => (
                <AlertSoftSuccessDemo title="Deleted" description="Person deleted successfully." variant="success" />
            ));
            router.push("/admin/people");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.custom(() => (
                <AlertSoftSuccessDemo title="Error" description={error instanceof Error ? error.message : "Failed to delete person."} variant="error" />
            ));
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto pb-10">
            <input type="hidden" name="id" value={person?.PeopleID || ""} />
            <input type="hidden" name="UserID" value={person?.UserID || "1"} />
            <input type="hidden" name="IsActive" value={String(isActive)} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {person ? "Edit Person" : "Add Person"}
                    </h1>
                    <p className="text-muted-foreground">
                        {person ? `Manage details for ${person.PeopleName}` : "Add a new person to your system."}
                    </p>
                </div>
                {person && (
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
                                    This action cannot be undone. This will permanently delete this person record.
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
                            <CardTitle>Personal Details</CardTitle>
                            <CardDescription>Basic contact information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="PeopleName">Full Name</Label>
                                    <Input
                                        type="text"
                                        id="PeopleName"
                                        name="PeopleName"
                                        defaultValue={person?.PeopleName || ""}
                                        required
                                        placeholder="e.g. John Doe"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="PeopleCode">Code / ID</Label>
                                    <Input
                                        type="text"
                                        id="PeopleCode"
                                        name="PeopleCode"
                                        defaultValue={person?.PeopleCode || ""}
                                        placeholder="e.g. EMP-001"
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="Email">Email Address</Label>
                                    <Input
                                        type="email"
                                        id="Email"
                                        name="Email"
                                        defaultValue={person?.Email || ""}
                                        required
                                        placeholder="john@example.com"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="MobileNo">Mobile Number</Label>
                                    <Input
                                        type="tel"
                                        id="MobileNo"
                                        name="MobileNo"
                                        defaultValue={person?.MobileNo || ""}
                                        required
                                        placeholder="+1 234 567 890"
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="Password">Password</Label>
                                <Input
                                    type="password"
                                    id="Password"
                                    name="Password"
                                    // Don't show existing password hash
                                    placeholder={person ? "Leave blank to keep current password" : "Enter password"}
                                    required={!person}
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="Description">Description</Label>
                                <Textarea
                                    id="Description"
                                    name="Description"
                                    defaultValue={person?.Description || ""}
                                    placeholder="Additional notes..."
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
                                        Enable/Disable account.
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

                    <div className="flex flex-col gap-3 pt-4">
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                person ? "Update Person" : "Create Person"
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
