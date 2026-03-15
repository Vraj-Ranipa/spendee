'use client'

import { useActionState, useState } from 'react'
import { completeProfile } from '@/actions/complete-profile'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import NextImage from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Camera, ChevronRight, SkipForward, ArrowLeft } from "lucide-react"
import { ImageCropper } from "@/components/ui/image-cropper"

export function CompleteProfileForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [state, action, isPending] = useActionState(completeProfile, undefined)
    const [step, setStep] = useState(1);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setIsCropperOpen(true);
            // Reset input so same file can be selected again if needed
            e.target.value = ''; 
        }
    };

    const handleCropComplete = (croppedFile: File) => {
        const url = URL.createObjectURL(croppedFile);
        setPreviewUrl(url);
        
        if (fileInputRef) {
             const dataTransfer = new DataTransfer();
             dataTransfer.items.add(croppedFile);
             fileInputRef.files = dataTransfer.files;
        }
    };

    const nextStep = () => setStep(2);
    const prevStep = () => setStep(1);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 relative border-none bg-[#0a0a0a] ring-1 ring-white/10 shadow-2xl">
                <CardContent className="grid p-0 md:grid-cols-[1.1fr_0.9fr] min-h-[600px]">
                    <form action={action} className="p-8 md:p-10 flex flex-col justify-between h-full bg-[#0a0a0a]">
                        <FieldGroup className="space-y-8">
                            <div className="flex flex-col items-center gap-2 text-center mb-4">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-white p-1.5 mb-2 shadow-inner overflow-hidden ring-1 ring-black/5">
                                    <NextImage
                                        src="/spendee_logo.png"
                                        alt="Spendee Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">Complete Profile</h1>
                                <p className="text-muted-foreground/80 text-sm font-medium">
                                    Step {step} of 2: {step === 1 ? 'Personal Details' : 'About You'}
                                </p>
                            </div>

                            {/* Step 1 Fields */}
                            <div className={step === 1 ? "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group cursor-pointer">
                                        <div className={cn(
                                            "size-32 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-300",
                                            previewUrl 
                                                ? "border-primary shadow-[0_0_20px_rgba(0,174,239,0.2)]" 
                                                : "bg-[#1a1a1a] border-dashed border-white/10 group-hover:border-primary/50 group-hover:bg-[#222]"
                                        )}>
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Camera className="h-8 w-8 text-white/40 group-hover:text-white/60 transition-colors" />
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            name="file" 
                                            accept="image/*" 
                                            onChange={handleFileChange}
                                            ref={(ref) => setFileInputRef(ref)}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                    </div>
                                    <span className="text-sm font-medium text-white/60">Tap to upload photo</span>
                                </div>

                                <Field>
                                    <FieldLabel htmlFor="name" className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-2 block">Full Name</FieldLabel>
                                    <Input 
                                        id="name" 
                                        name="name" 
                                        type="text" 
                                        placeholder="Enter Full Name" 
                                        required={step === 1} 
                                        className="bg-[#151515] border-white/5 h-12 focus:ring-primary/30"
                                    />
                                    {state?.errors?.name && (
                                        <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="mobile" className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-2 block">Mobile Number</FieldLabel>
                                    <Input 
                                        id="mobile" 
                                        name="mobile" 
                                        type="tel" 
                                        placeholder="9999999999" 
                                        minLength={10} 
                                        maxLength={10} 
                                        required={step === 1} 
                                        className="bg-[#151515] border-white/5 h-12 focus:ring-primary/30"
                                    />
                                    {state?.errors?.mobile && (
                                        <p className="text-red-500 text-xs mt-1">{state.errors.mobile}</p>
                                    )}
                                </Field>
                            </div>

                             {/* Step 2 Fields */}
                             <div className={step === 2 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
                                <Field>
                                    <FieldLabel htmlFor="description" className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-2 block">About You</FieldLabel>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Tell us a bit about yourself..."
                                        className="resize-none min-h-[140px] bg-[#151515] border-white/5 focus:ring-primary/30"
                                    />
                                    {state?.errors?.description && (
                                        <p className="text-red-500 text-xs mt-1">{state.errors.description}</p>
                                    )}
                                </Field>
                             </div>
                        </FieldGroup>

                        <div className="flex flex-col gap-6 mt-10">
                            {step === 1 ? (
                                <Button 
                                    type="button" 
                                    onClick={nextStep} 
                                    className="w-full h-12 bg-[#00AEEF] hover:bg-[#0096ce] text-white font-bold text-base transition-all duration-300 group shadow-[0_4px_15px_rgba(0,174,239,0.3)]"
                                >
                                    Next Step
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <div className="flex gap-3">
                                     <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={prevStep}
                                        className="h-12 border-white/10 hover:bg-white/5 text-white/80"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isPending} 
                                        className="flex-1 h-12 bg-[#00AEEF] hover:bg-[#0096ce] text-white font-bold"
                                    >
                                        {isPending ? 'Saving...' : 'Complete Setup'}
                                    </Button>
                                </div>
                            )}
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                    <span className="bg-[#0a0a0a] px-3 text-white/30">OR</span>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                name="intent" 
                                value="skip" 
                                variant="ghost" 
                                formNoValidate
                                className="w-full h-10 text-white/50 hover:text-white transition-colors font-semibold"
                            >
                                Skip for now
                            </Button>
                        </div>
                    </form>

                    <div className="relative hidden md:block overflow-hidden">
                        {/* Background with spendee theme gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0B4557] to-[#041B23]" />
                        
                        {/* Decorative subtle pattern or light effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,174,239,0.15),transparent_50%)]" />
                        
                        <div className="relative h-full w-full flex flex-col items-center justify-center p-10 text-center">
                                <div className="space-y-10 max-w-sm">
                                    <div className="relative mx-auto group">
                                        {/* Organic Glow instead of a box */}
                                        <div className="absolute -inset-12 bg-[#00AEEF]/20 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                                        
                                        <div className="relative">
                                            <NextImage
                                                src="/spendee_logo_black.png"
                                                alt="Spendee Logo"
                                                width={280}
                                                height={280}
                                                className="object-contain mx-auto mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        
                                        {/* Subtle pulse effect */}
                                        <div className="absolute inset-4 rounded-full animate-ping opacity-5 bg-[#00AEEF]/20" style={{ animationDuration: '4s' }} />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-bold text-white tracking-tight">
                                            Welcome to Spendee
                                        </h3>
                                        <p className="text-white/60 text-base leading-relaxed font-medium">
                                            {step === 1 
                                                ? "Let's put a face to the name. Uploading a profile picture helps your team recognize you." 
                                                : "Adding a short bio helps others know your role and responsibilities."
                                            }
                                        </p>
                                    </div>
                                </div>

                            {/* Bottom copyright/version info */}
                            <div className="absolute bottom-6 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                                Spendee v2.0 • Premium FinTech
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <ImageCropper
                imageFile={selectedFile}
                open={isCropperOpen}
                onOpenChange={setIsCropperOpen}
                onCropComplete={handleCropComplete}
                aspectRatio={1} // Square crop for profile picture
                circular={true}
            />
        </div>
    )
}
