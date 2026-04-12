"use client";

import React, { useEffect, useState } from "react";
import { User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
}

/**
 * A reusable, premium User Avatar component that handles both external URLs 
 * and private S3 keys (fetching signed URLs automatically).
 */
export function UserAvatar({ image, name, className, fallbackClassName }: UserAvatarProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) {
      setUrl(null);
      return;
    }

    // Direct URLs (Google avatars, etc.) or local blobs
    if (image.startsWith("http") || image.startsWith("blob:")) {
      setUrl(image);
      return;
    }

    // Private S3 keys need a signed URL
    const fetchUrl = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/s3/signed-url?key=${encodeURIComponent(image)}`);
        const data = await res.json();
        if (data.url) setUrl(data.url);
      } catch (e) {
        console.error("Failed to fetch avatar URL", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUrl();
  }, [image]);

  return (
    <div className={cn("relative overflow-hidden rounded-full border border-border/50 bg-muted/30", className)}>
      {url ? (
        <img 
          src={url} 
          alt={name || "User"} 
          className={cn(
            "w-full h-full object-cover transition-all duration-500", 
            loading ? "opacity-0 scale-110 blur-sm" : "opacity-100 scale-100 blur-0"
          )} 
        />
      ) : (
        <div className={cn("w-full h-full flex items-center justify-center bg-accent/5", fallbackClassName)}>
          <User className="w-[40%] h-[40%] text-muted-foreground/50" />
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
           <Loader2 className="w-4 h-4 text-muted-foreground/40 animate-spin" />
        </div>
      )}
    </div>
  );
}
