'use client';

import * as React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps {
    src?: string | null;
    alt?: string | null;
    className?: string;
    fallback?: React.ReactNode;
}

export function Avatar({ src, alt, className, fallback }: AvatarProps) {
    const [hasError, setHasError] = React.useState(false);

    if (!src || hasError) {
        return (
            <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}>
                {fallback || <User className="h-4 w-4 text-muted-foreground" />}
            </div>
        );
    }

    return (
        <div className={cn("relative h-full w-full rounded-full overflow-hidden border border-border", className)}>
            <Image
                src={src}
                alt={alt || "Avatar"}
                fill
                className="object-cover"
                onError={() => setHasError(true)}
            />
        </div>
    );
}
