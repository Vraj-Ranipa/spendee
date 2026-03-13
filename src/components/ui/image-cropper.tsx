"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ImageCropperProps {
  imageFile: File | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number; // Optional aspect ratio (e.g., 1 for square)
  circular?: boolean;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageCropper({
  imageFile,
  open,
  onOpenChange,
  onCropComplete,
  aspectRatio = undefined, // Freeform by default
  circular = false,
}: ImageCropperProps) {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    if (imageFile) {
      setCrop(undefined); // Reset crop
      const reader = new FileReader();
      reader.addEventListener("load", () => {
         setImgSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(imageFile);
    } else {
        setImgSrc("");
    }
  }, [imageFile]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    if (aspectRatio) {
        const crop = centerAspectCrop(width, height, aspectRatio);
        setCrop(crop);
    } else {
        // Default to full image or a large centered box if no aspect
         setCrop(centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                width / height, // Use image's own aspect
                width,
                height,
            ),
            width,
            height
         ));
    }
  }

  async function onDownloadCropClick() {
    setIsCropping(true);
    const image = imgRef.current;
    if (!image || !completedCrop) {
        setIsCropping(false);
        return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        setIsCropping(false);
         // eslint-disable-next-line
        throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();
    
    // Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();
    
    // As Blob
    canvas.toBlob((blob) => {
        if (!blob) {
            console.error("Canvas is empty");
            setIsCropping(false);
            return;
        }
        // Create a new File from the blob
        const croppedFile = new File([blob], imageFile?.name || "cropped_image.jpg", {
            type: imageFile?.type || "image/jpeg",
        });

        onCropComplete(croppedFile);
        onOpenChange(false);
        setIsCropping(false);
    }, imageFile?.type || "image/jpeg");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the cropping area to properly frame the logo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center bg-muted/20 rounded-md overflow-hidden">
           {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              circularCrop={circular}
              className="max-h-[500px]"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: "70vh", maxWidth: "100%" }}
              />
            </ReactCrop>
           )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onDownloadCropClick} disabled={!completedCrop || isCropping} type="button">
            {isCropping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crop & Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
