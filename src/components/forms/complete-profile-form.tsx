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
            <Card className="overflow-hidden p-0 relative">
                 {/* Progress Indicator */}
                <div className="absolute top-0 left-0 right-0 h-0 bg-muted">
                    <div 
                        className="h-full bg-primary transition-all duration-300 ease-in-out" 
                        style={{ width: `${(step / 2) * 100}%` }}
                    />
                </div>

                <CardContent className="grid p-0 md:grid-cols-2">
                    <form action={action} className="p-6 md:p-6 lg:p-8 flex flex-col justify-between h-full min-h-[500px]">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center mb-6">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-white p-1 mb-2 shadow-sm overflow-hidden">
                                    <NextImage
                                        src="/spendee_logo.png"
                                        alt="Spendee Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <h1 className="text-2xl font-bold">Complete Profile</h1>
                                <p className="text-muted-foreground text-balance">
                                    Step {step} of 2: {step === 1 ? 'Personal Details' : 'About You'}
                                </p>
                            </div>

                            {/* Step 1 Fields */}
                            <div className={step === 1 ? "space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group cursor-pointer">
                                        <div className={cn(
                                        "size-24 rounded-full flex items-center justify-center overflow-hidden border-2 transition-colors",
                                        previewUrl ? "border-solid border-primary/20" : "bg-muted border-dashed border-muted-foreground/30 hover:border-primary/50"
                                    )}>
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <Camera className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        name="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                        ref={(ref) => setFileInputRef(ref)}
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                    />
                                    <span className="text-xs text-muted-foreground mt-2 block text-center">Tap to upload photo</span>
                                </div>
                            </div>

                                <Field>
                                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                    <Input id="name" name="name" type="text" placeholder="Enter Full Name" required={step === 1} />
                                    {state?.errors?.name && (
                                        <p className="text-red-500 text-sm">{state.errors.name}</p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
                                    <Input id="mobile" name="mobile" type="tel" placeholder="9999999999" minLength={10} maxLength={10} required={step === 1} />
                                    {state?.errors?.mobile && (
                                        <p className="text-red-500 text-sm">{state.errors.mobile}</p>
                                    )}
                                </Field>
                            </div>

                             {/* Step 2 Fields */}
                             <div className={step === 2 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
                                <Field>
                                    <FieldLabel htmlFor="description">About You</FieldLabel>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Tell us a bit about yourself..."
                                        className="resize-none min-h-[120px]"
                                    />
                                    {state?.errors?.description && (
                                        <p className="text-red-500 text-sm">{state.errors.description}</p>
                                    )}
                                </Field>
                             </div>

                        </FieldGroup>

                        <div className="flex flex-col gap-3 mt-8">
                            {step === 1 ? (
                                <Button type="button" onClick={nextStep} className="w-full group">
                                    Next Step
                                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                     <Button type="button" variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button type="submit" disabled={isPending} className="flex-1">
                                        {isPending ? 'Saving...' : 'Complete Setup'}
                                    </Button>
                                </div>
                            )}
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                name="intent" 
                                value="skip" 
                                variant="ghost" 
                                formNoValidate
                                className="w-full text-muted-foreground hover:text-foreground"
                            >
                                Skip for now
                            </Button>
                        </div>
                    </form>

                    <div className="bg-muted relative hidden md:block">
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary/40 via-primary/20 to-background flex items-center justify-center text-muted-foreground p-10">
                            <div className="text-center space-y-4">
                                <NextImage
                                    src="/expenXO_logo.png"
                                    alt="Expenxo Logo"
                                    width={150}
                                    height={150}
                                    className="object-contain opacity-50 mx-auto"
                                />
                                <h3 className="text-xl font-semibold opacity-70">Welcome to Spendee</h3>
                                <p className="text-sm opacity-60 max-w-xs mx-auto">
                                    {step === 1 
                                        ? "Let's put a face to the name. Uploading a profile picture helps your team recognize you." 
                                        : "Adding a short bio helps others know your role and responsibilities."
                                    }
                                </p>
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
