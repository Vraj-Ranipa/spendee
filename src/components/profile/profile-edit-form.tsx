'use client'

import { useActionState, useState, useEffect } from 'react'
import { updateProfile } from '@/actions/update-profile'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageCropper } from "@/components/ui/image-cropper"
import { useRef } from "react"
import { Camera, Loader2, Save, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { uploadFileToServer } from "@/lib/client-upload"
import { toast } from "sonner"

interface ProfileEditFormProps extends React.ComponentProps<"div"> {
    user: any;
    person: any;
    onSuccess?: () => void;
}



// ...

export function ProfileEditForm({
    className,
    user,
    person,
    onSuccess,
    ...props
}: ProfileEditFormProps) {
    const [state, action, isPending] = useActionState(updateProfile, undefined)
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.ProfileImage);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    // Cropper State
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    
    // const [isUploading, setIsUploading] = useState(false); // Removed
    // const [uploadedUrl, setUploadedUrl] = useState<string>(user.ProfileImage || ""); // Removed
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync previewUrl with user.ProfileImage when it updates (e.g. after save)
    useEffect(() => {
        setPreviewUrl(user.ProfileImage);
    }, [user.ProfileImage]);

    // Effect to handle success
    useEffect(() => {
        if (state?.success) {
            onSuccess?.();
            toast.success("Profile updated successfully!");
        }
    }, [state, onSuccess]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileToCrop(file);
            setIsCropperOpen(true);
            e.target.value = ""; // Reset to allow re-selection
        }
    };

    const onCropComplete = (croppedFile: File) => {
        // Update preview
        const url = URL.createObjectURL(croppedFile);
        setPreviewUrl(url);

        // Set file input value using DataTransfer
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(croppedFile);
            fileInputRef.current.files = dataTransfer.files;
        }

        setIsCropperOpen(false);
    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <ImageCropper 
                imageFile={fileToCrop}
                open={isCropperOpen}
                onOpenChange={setIsCropperOpen}
                onCropComplete={onCropComplete}
                aspectRatio={1}
                circular={true}
            />
            <form action={action} className="flex flex-col gap-6 relative z-10">
                <FieldGroup className="bg-white/40 dark:bg-black/30 backdrop-blur-2xl rounded-xl border border-white/60 dark:border-white/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
                    {/* Specular Edge Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-50 dark:from-white/10 pointer-events-none z-0"></div>
                    
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center gap-4 mb-6 relative z-10">
                        {/* Image Preview Area */}
                        <div className="relative group cursor-pointer">
                            {/* Avatar Glow */}
                            <div className="absolute -inset-2 bg-primary/30 rounded-full opacity-0 blur-xl transition-all duration-300 group-hover:opacity-100 group-hover:blur-2xl pointer-events-none"></div>

                            <div className={cn(
                                "size-28 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-300 relative z-10 shadow-sm dark:shadow-md dark:shadow-black/40 bg-white/50 dark:bg-black/50 backdrop-blur-md",
                                previewUrl ? "border-white/80 dark:border-white/20" : "border-dashed border-white/60 dark:border-white/10"
                            )}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                )}
                            </div>
                            
                            {/* File Input */}
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                name="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                            />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full z-10 pointer-events-none dark:bg-black/60">
                                <Camera className="h-6 w-6 text-white" />
                            </div>

                            
                           {previewUrl && (
                                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsPreviewOpen(true);
                                        }}
                                        className="absolute -bottom-2 -right-2 bg-background border shadow-sm rounded-full p-2 text-muted-foreground hover:text-primary z-30 pointer-events-auto transition-transform hover:scale-110"
                                        title="View Image"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <DialogContent 
                                        className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-background border shadow-lg flex flex-col dark:border-white/10 dark:bg-card/95 backdrop-blur-xl" 
                                        aria-describedby={undefined}
                                    >
                                         <div className="p-4 border-b flex items-center justify-between dark:border-white/10">
                                            <DialogTitle className="font-semibold">Profile Image</DialogTitle>
                                         </div>
                                         <div className="relative w-full flex-1 min-h-[50vh] flex items-center justify-center bg-muted/20 p-4 dark:bg-black/40">
                                            <img 
                                                src={previewUrl} 
                                                alt="Profile Preview" 
                                                className="max-w-full max-h-[75vh] object-contain rounded-md shadow-sm"
                                            />
                                         </div>
                                    </DialogContent>
                                </Dialog>
                           )}
                        </div>
                        <span className="text-xs text-muted-foreground">Click to change profile picture</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input 
                                id="username" 
                                name="username" 
                                type="text" 
                                defaultValue={user.UserName} 
                                required 
                            />
                            {state?.errors?.username && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.username}</p>
                            )}
                        </Field>

                         <Field>
                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                            <Input 
                                id="name" 
                                name="name" 
                                type="text" 
                                defaultValue={person?.PeopleName || user.UserName} 
                                required 
                            />
                            {state?.errors?.name && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
                            )}
                        </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                         <Field>
                            <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
                            <Input 
                                id="mobile" 
                                name="mobile" 
                                type="tel" 
                                defaultValue={person?.MobileNo || user.MobileNo} 
                                required 
                            />
                            {state?.errors?.mobile && (
                                <p className="text-red-500 text-sm mt-1">{state.errors.mobile}</p>
                            )}
                        </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                         <Field>
                            <FieldLabel htmlFor="peopleCode">Employee Code</FieldLabel>
                            <Input 
                                id="peopleCode" 
                                name="peopleCode" 
                                type="text" 
                                defaultValue={person?.PeopleCode || `USR-${user.UserID}`} 
                                disabled
                                className="bg-muted text-muted-foreground"
                            />
                        </Field>
                        
                         <Field>
                            <FieldLabel htmlFor="email">Email Address</FieldLabel>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                defaultValue={user.EmailAddress} 
                                disabled
                                className="bg-muted text-muted-foreground"
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="description">About You</FieldLabel>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={person?.Description || ""}
                            placeholder="Tell us a bit about yourself..."
                            className="resize-none min-h-[100px]"
                        />
                        {state?.errors?.description && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
                        )}
                    </Field>
                </FieldGroup>

                {state?.message && !state?.success && (
                    <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                        {state.message}
                    </div>
                )}
                
                {state?.success && (
                    <div className="p-3 bg-green-100 border border-green-200 text-green-700 rounded-md text-sm">
                        {state.message}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-4 border-t border-black/5 dark:border-white/10 pt-5 relative z-10">
                    <Button type="button" variant="outline" onClick={() => onSuccess?.()} className="bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 transition-all shadow-sm dark:shadow-none">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending} className="shadow-sm font-medium transition-all duration-300 hover:shadow-md hover:shadow-primary/20 bg-primary/90 hover:bg-primary backdrop-blur-md border border-white/20 text-primary-foreground">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className={cn("mr-2 h-4 w-4", isPending ? "hidden" : "inline")} />
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
