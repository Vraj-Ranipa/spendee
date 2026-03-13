"use client";

import * as React from 'react'
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteRow } from '@/actions/delete-action'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { toast } from "sonner"
import AlertSoftSuccessDemo from '@/components/ui/alert-23'

interface DeleteButtonProps {
    model: string;
    id: string;
    deleteLabel?: string;
    path?: string;
    redirectTo?: string;
    className?: string;
    [key: string]: any;
}

export default function DeleteButton({
    model,
    id,
    deleteLabel = "Delete",
    path,
    redirectTo,
    className,
    onClick,
    ...props
}: DeleteButtonProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteRow(model, id, path);
            setOpen(false);
            toast.custom(() => (
                <AlertSoftSuccessDemo 
                    title={`${model} deleted`}
                    description={`${model} has been deleted successfully.`}
                />
            ));
            if (redirectTo) {
                router.push(redirectTo);
            }
        } catch (error) {
            console.error(error);
            toast.custom(() => (
                <AlertSoftSuccessDemo 
                    title="Something went wrong"
                    description="Failed to delete the item. Please try again."
                    variant="error"
                />
            ));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    className={className}
                    onClick={onClick}
                    {...props}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className='data-[state=open]:!zoom-in-0 data-[state=open]:duration-600 sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this {model}? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}