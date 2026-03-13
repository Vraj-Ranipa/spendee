"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Edit,
    Mail,
    Phone,
    User as UserIcon,
    Calendar,
    Briefcase,
    ShieldCheck,
    MapPin,
    Hash,
    Clock,
    CheckCircle2,
    XCircle,
    Fingerprint,
    AtSign,
} from "lucide-react";
import { ProfileEditForm } from "./profile-edit-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileViewProps {
    user: any;
    person: any;
}

export function ProfileView({ user, person }: ProfileViewProps) {
    const [open, setOpen] = useState(false);

    // Merge and format data for display
    const displayName = person?.PeopleName || user.UserName;
    const displayMobile = person?.MobileNo || user.MobileNo;
    const displayDescription = person?.Description || "No bio provided yet.";
    const displayImage = user.ProfileImage;
    const isActive = person?.IsActive !== false; // Default to true if null or undefined, only false if explicitly false
    const empCode = person?.PeopleCode || "N/A";

    // Format dates
    const createdDate = new Date(user.Created).toLocaleDateString(undefined, {
        dateStyle: "medium",
    });
    const modifiedDate = new Date(user.Modified).toLocaleDateString(undefined, {
        dateStyle: "medium",
    });

    // Determine emails
    const loginEmail = user.EmailAddress;
    const contactEmail =
        person?.Email && person.Email !== loginEmail ? person.Email : null;

    return (
        <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 relative">

            {/* Liquid Glass Ambient Refraction Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 flex justify-center items-center opacity-60 dark:opacity-40 mix-blend-screen dark:mix-blend-color-dodge">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/40 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-rose-400/30 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-400/30 blur-[140px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero / Header Section - Liquid Glass */}
            <div className="relative group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-primary/10">

                {/* Glass Base Layer */}
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-xl z-0"></div>

                {/* Specular Edge Highlight */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-80 dark:from-white/20 z-0 pointer-events-none"></div>

                {/* Decorative Background Pattern */}
                <div className="absolute inset-x-0 top-0 h-32 opacity-100 z-0 overflow-hidden rounded-t-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 dark:opacity-30 mix-blend-overlay"></div>
                    <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white/40 dark:from-black/40 to-transparent"></div>
                </div>

                <div className="relative px-6 pb-6 pt-16 md:pt-20 z-10">
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
                        {/* Liquid Avatar */}
                        <div className="relative shrink-0 group/avatar">
                            {/* Avatar Glow */}
                            <div className="absolute -inset-2 bg-gradient-to-tr from-primary/40 via-purple-400/40 to-primary/40 rounded-full opacity-60 blur-xl transition-all duration-300 group-hover/avatar:opacity-100 group-hover/avatar:blur-2xl"></div>

                            <Avatar className="h-32 w-32 border-[4px] border-white/80 dark:border-white/20 shadow-md relative z-10 transition-transform duration-300 group-hover/avatar:scale-105 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                                <AvatarImage src={displayImage} alt={displayName} className="object-cover" />
                                <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground group-hover:text-primary transition-colors duration-300">
                                    {displayName?.slice(0, 2).toUpperCase() || 'CN'}
                                </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "absolute bottom-2 right-2 h-6 w-6 rounded-full border-[3px] border-white/80 dark:border-white/20 z-20 shadow-sm flex items-center justify-center transition-transform hover:scale-110",
                                isActive ? "bg-primary" : "bg-muted-foreground"
                            )} title={isActive ? "Active" : "Inactive"}>
                                {isActive && <CheckCircle2 className="w-3 h-3 text-primary-foreground" strokeWidth={4} />}
                            </div>
                        </div>

                        {/* Main Info */}
                        <div className="flex-1 mb-2 md:mb-0 space-y-2 text-center md:text-left relative z-10">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground/90 dark:text-white drop-shadow-sm">{displayName}</h1>
                                <div className="text-foreground/70 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                                    <span className="text-sm">@{user.UserName}</span>
                                    {user.Role.toUpperCase() === 'ADMIN' && (
                                        <Badge variant="secondary" className="bg-primary/20 text-primary dark:text-primary-foreground border border-primary/30 dark:border-primary/50 shadow-sm backdrop-blur-md">
                                            <ShieldCheck className="w-3 h-3 mr-1" /> Admin
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0 mb-4 md:mb-0 relative z-10">
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="shadow-sm font-medium transition-all duration-300 hover:shadow-md hover:shadow-primary/20 bg-primary/90 hover:bg-primary backdrop-blur-md border border-white/20 text-primary-foreground">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/70 dark:bg-black/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-lg p-0 rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your personal information and profile settings.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ProfileEditForm
                                        user={user}
                                        person={person}
                                        onSuccess={() => setOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">

                {/* Contact Information (Liquid Glass Card) */}
                <div className="relative group/card rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-primary/10">
                    {/* Glass Backgrounds */}
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-xl border border-white/60 dark:border-white/10 z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-50 dark:from-white/10 rounded-xl z-0 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col h-full p-6">
                        <div className="pb-2 border-b border-black/5 dark:border-white/5 flex flex-row items-center justify-between">
                            <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-foreground/90 dark:text-white drop-shadow-sm">
                                <div className="p-2 bg-white/60 dark:bg-primary/20 backdrop-blur-md rounded-md text-primary shadow-sm border border-white/50 dark:border-white/10">
                                    <Mail className="h-5 w-5" />
                                </div>
                                Contact Details
                            </h3>
                        </div>

                        <div className="space-y-4 pt-4 text-sm flex-1">
                            <div className="space-y-1 group">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 drop-shadow-sm">
                                    <AtSign className="h-3 w-3 text-primary" /> Login Email
                                </p>
                                <p className="font-semibold truncate text-foreground/90 dark:text-white" title={loginEmail}>
                                    {loginEmail}
                                </p>
                            </div>

                            {contactEmail && (
                                <div className="space-y-1 group pt-3 border-t border-dashed border-black/5 dark:border-white/10">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 drop-shadow-sm">
                                        <Mail className="h-3 w-3 text-primary" /> Contact Email
                                    </p>
                                    <p className="font-semibold truncate text-foreground/90 dark:text-white" title={contactEmail}>
                                        {contactEmail}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-1 group pt-3 border-t border-dashed border-black/5 dark:border-white/10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 drop-shadow-sm">
                                    <Phone className="h-3 w-3 text-primary" /> Mobile Number
                                </p>
                                <p className="font-semibold truncate text-foreground/90 dark:text-white">
                                    {displayMobile || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Information (Liquid Glass Card) */}
                <div className="relative group/card rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-primary/10">
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-xl border border-white/60 dark:border-white/10 z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-50 dark:from-white/10 rounded-xl z-0 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col h-full p-6">
                        <div className="pb-2 border-b border-black/5 dark:border-white/5">
                            <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-foreground/90 dark:text-white drop-shadow-sm">
                                <div className="p-2 bg-white/60 dark:bg-primary/20 backdrop-blur-md rounded-md text-primary shadow-sm border border-white/50 dark:border-white/10">
                                    <Fingerprint className="h-5 w-5" />
                                </div>
                                System Info
                            </h3>
                        </div>

                        <div className="space-y-4 pt-4 text-sm flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 drop-shadow-sm">
                                        <Hash className="h-3 w-3 text-primary" /> User ID
                                    </p>
                                    <p className="font-mono font-semibold text-foreground/90 dark:text-white">
                                        #{user.UserID}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 drop-shadow-sm">
                                        <Briefcase className="h-3 w-3 text-primary" /> Emp Code
                                    </p>
                                    <p className="font-mono font-semibold text-foreground/90 dark:text-white">
                                        {empCode}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1 pt-3 border-t border-dashed border-black/5 dark:border-white/10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 drop-shadow-sm">
                                    <Calendar className="h-3 w-3 text-primary" /> Joined Date
                                </p>
                                <p className="font-semibold text-foreground/90 dark:text-white">{createdDate}</p>
                            </div>

                            <div className="space-y-1 pt-3 border-t border-dashed border-black/5 dark:border-white/10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 drop-shadow-sm">
                                    <Clock className="h-3 w-3 text-primary" /> Last Updated
                                </p>
                                <p className="font-semibold text-foreground/90 dark:text-white">{modifiedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status & Bio (Liquid Glass Card) */}
                <div className="relative group/card rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-primary/10 lg:col-span-1 md:col-span-2">
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-xl rounded-xl border border-white/60 dark:border-white/10 z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-50 dark:from-white/10 rounded-xl z-0 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col h-full p-6">
                        <div className="pb-2 border-b border-black/5 dark:border-white/5">
                            <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-foreground/90 dark:text-white drop-shadow-sm">
                                <div className="p-2 bg-white/60 dark:bg-primary/20 backdrop-blur-md rounded-md text-primary shadow-sm border border-white/50 dark:border-white/10">
                                    <UserIcon className="h-5 w-5" />
                                </div>
                                About & Status
                            </h3>
                        </div>

                        <div className="space-y-4 pt-4 text-sm flex-1 flex flex-col">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider drop-shadow-sm">
                                    Account Status
                                </p>
                                <Badge variant={isActive ? "default" : "destructive"} className={cn(
                                    "shadow-sm backdrop-blur-md border",
                                    isActive ? "bg-primary/90 hover:bg-primary border-primary/50 text-white dark:shadow-primary/20" : "border-red-500/50"
                                )}>
                                    {isActive ? "Active Account" : "Inactive Account"}
                                </Badge>
                            </div>

                            <div className="pt-3 border-t border-dashed border-black/5 dark:border-white/10">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 drop-shadow-sm">
                                    Bio / Description
                                </p>
                                <div className="bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-inner rounded-md p-3 text-sm text-foreground/80 dark:text-white/80 flex-1 italic text-pretty">
                                    "{displayDescription}"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
