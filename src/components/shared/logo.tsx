"use client";

import { IKImage } from "imagekitio-next";
import React, { useState } from "react";

interface LogoProps {
    path?: string | null;
    alt: string;
    fallbackClassName?: string;
    fallbackIcon?: React.ReactNode;
}

export function Logo({ path, alt, fallbackClassName, fallbackIcon }: LogoProps) {
    const [error, setError] = useState(false);

    if (!path || error) {
        return (
            <div className={fallbackClassName}>
                {fallbackIcon}
            </div>
        );
    }

    if (path.startsWith("http")) {
        return (
            <div className={`${fallbackClassName} relative overflow-hidden bg-background`}>
                <img 
                    src={path} 
                    alt={alt} 
                    className="object-cover h-full w-full"
                    onError={() => setError(true)}
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div className={`${fallbackClassName} relative overflow-hidden bg-background`}>
             <IKImage
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                path={path}
                transformation={[{ height: "100", width: "100" }]}
                loading="lazy"
                className="object-cover h-full w-full"
                alt={alt}
                onError={() => setError(true)}
            />
        </div>
    );
}
