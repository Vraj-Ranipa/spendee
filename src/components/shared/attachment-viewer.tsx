"use client";

import { IKImage } from "imagekitio-next";
import { ExternalLink, ImageOff } from "lucide-react";
import React, { useState } from "react";

interface AttachmentViewerProps {
    path: string;
    alt: string;
    className?: string;
}

export function AttachmentViewer({ path, alt, className }: AttachmentViewerProps) {
    const [error, setError] = useState(false);
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                <ImageOff className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm">Failed to load image</p>
                <p className="text-xs mt-1 opacity-70">Path: {path}</p>
            </div>
        );
    }

    let decoded = decodeURIComponent(path);
    
    decoded = decoded.replace(/^\/+/, "");
    
  
    if (decoded.match(/^https?:\/[^/]/)) {
        decoded = decoded.replace(/^(https?):\/+/, "$1://");
    }

    const isFullUrl = decoded.startsWith("http");

   
    if (!isFullUrl && !urlEndpoint) {
         return (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed w-full h-full relative">
                <img 
                    src={decoded} 
                    alt={alt} 
                    className={`w-full h-full object-contain ${className}`}
                    onError={() => setError(true)}
                />
                {!isFullUrl && <p className="text-xs text-red-500 mt-2 absolute bottom-2">No ImageKit Endpoint Found</p>}
            </div>
         );
    }

    return (
        <div className="relative w-full h-full min-h-[200px]">
            <IKImage
                urlEndpoint={urlEndpoint}
                {...(isFullUrl ? { src: decoded } : { path: decoded })}
                alt={alt}
                className={className}
                loading="lazy"
                fill={true}
                onError={(err) => {
                    console.error("ImageKit Error:", err);
                    setError(true);
                }}
            />
        </div>
    );
}
