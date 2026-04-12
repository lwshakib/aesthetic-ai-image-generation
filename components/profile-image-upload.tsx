"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, Camera, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { updateProfile } from "@/app/actions/user.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileImageUploadProps {
  onSuccess?: () => void;
}

/**
 * A premium profile image upload component.
 * Handles S3 uploads and profile metadata updates with real-time preview and signed URL support.
 */
export function ProfileImageUpload({ onSuccess }: ProfileImageUploadProps) {
  const { data: session } = authClient.useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch signed URL if the image is an S3 key
  useEffect(() => {
    const userImage = session?.user?.image;
    if (userImage) {
      if (userImage.startsWith("http") || userImage.startsWith("blob:")) {
        setPreviewUrl(userImage);
      } else {
        const fetchUrl = async () => {
          setIsLoadingUrl(true);
          try {
            const res = await fetch(`/api/s3/signed-url?key=${encodeURIComponent(userImage)}`);
            const data = await res.json();
            if (data.url) setPreviewUrl(data.url);
          } catch (e) {
            console.error("Failed to fetch avatar signed URL", e);
          } finally {
            setIsLoadingUrl(false);
          }
        };
        fetchUrl();
      }
    }
  }, [session?.user?.image]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format mismatch. Please select an image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Asset too large. Max 2MB allowed.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload to S3/R2
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Cloud upload rejected.");
      const { url: s3Key } = await res.json();

      // 2. Persist in Profile
      await updateProfile({ image: s3Key });
      
      onSuccess?.();
      toast.success("Identity updated successfully.");
    } catch (error: any) {
      toast.error(error.message || "Synchronization failed.");
      setPreviewUrl(session?.user?.image || null);
    } finally {
      setIsUploading(false);
      if (localPreview) URL.revokeObjectURL(localPreview);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="relative group cursor-pointer"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {/* Outer Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-border via-border to-accent/20">
          <div className="w-full h-full rounded-full overflow-hidden bg-card border border-border flex items-center justify-center relative">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile" 
                className={cn(
                  "w-full h-full object-cover transition-all duration-700",
                  (isUploading || isLoadingUrl) && "scale-110 blur-sm brightness-50"
                )} 
              />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground select-none">
                {session?.user?.name ? session.user.name.charAt(0) : <User className="w-12 h-12 text-muted-foreground/40" />}
              </span>
            )}

            {/* Status Overlays */}
            <div className={cn(
              "absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]",
              (isUploading || isLoadingUrl) && "opacity-100"
            )}>
              {isUploading || isLoadingUrl ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
}
