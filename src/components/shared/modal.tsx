"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function onDismiss() {
    router.back();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onDismiss()}>
      {/* 
         Accessibility: DialogContent requires a Title. 
         We use 'sr-only' to hide it visually but keep it for screen readers.
      */}
      <DialogTitle className="sr-only">Attachment Viewer</DialogTitle>

      <DialogContent 
        className="max-w-5xl w-full h-[90vh] md:h-auto md:min-h-[600px] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/60 shadow-2xl"
        showCloseButton={true}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
