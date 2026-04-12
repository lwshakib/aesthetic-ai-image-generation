import React, { useEffect, useState } from "react";
import { Download, Share2, ExternalLink, Loader2, Trash2, Sparkles } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface GenerationResultProps {
  id?: string;
  imagePath?: string;
  prompt?: string;
  width?: number;
  height?: number;
  isGenerating?: boolean;
  onDelete?: (id: string) => void;
}

export const GenerationResult: React.FC<GenerationResultProps> = ({ 
  id, 
  imagePath, 
  prompt, 
  width = 1024, 
  height = 1024,
  isGenerating = false,
  onDelete 
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGenerating || !imagePath) {
      setLoading(true);
      setUrl(null);
      return;
    }

    // If imagePath is already a full URL (e.g. mock data or external image)
    if (imagePath.startsWith("http") || imagePath.startsWith("blob:")) {
      setUrl(imagePath);
      setLoading(false);
      return;
    }

    const fetchSignedUrl = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/s3/signed-url?key=${encodeURIComponent(imagePath)}`);
        const data = await res.json();
        if (data.url) {
          setUrl(data.url);
        }
      } catch (error) {
        console.error("Failed to fetch signed URL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [imagePath, isGenerating]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url || !imagePath) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `generation-${imagePath.split("/").pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download image");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard!");
  };

  const handlePerformDelete = async () => {
    if (!id || !onDelete) {
      if (imagePath?.startsWith("blob:")) {
        onDelete?.(id || "");
        return;
      }
      return;
    }
    
    try {
      const res = await fetch(`/api/ai/images/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Image deleted");
        onDelete(id);
      } else {
        toast.error("Failed to delete image");
      }
    } catch {
      toast.error("Error deleting image");
    }
  };

  const isActuallyGenerating = isGenerating || loading;

  return (
    <div 
      className={cn(
        "group relative rounded-lg overflow-hidden bg-card border border-border shadow-xl transition-all hover:scale-[1.02]",
        isActuallyGenerating && "animate-pulse"
      )}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {isActuallyGenerating ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 bg-muted/30">
          <Sparkles className="w-6 h-6 text-muted-foreground animate-pulse" />
          <span className="text-[10px] font-mono text-muted-foreground/60 italic">Synthesizing...</span>
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
      ) : url ? (
        <>
          <Image
            src={url!}
            alt="AI Generated Image"
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 p-6">
            {prompt && (
              <p className="text-[10px] text-white/70 font-mono text-center line-clamp-2 mb-4 px-2 italic leading-relaxed">
                {prompt.length > 80 ? prompt.substring(0, 80) + "..." : prompt}
              </p>
            )}
            <div className="flex gap-3">
              <button 
                onClick={handleDownload}
                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                title="Share Link"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => window.open(url!, '_blank')}
                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                title="View Full Size"
              >
                <ExternalLink className="w-5 h-5 text-white" />
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-red-500/10 backdrop-blur-md rounded-full hover:bg-red-500/40 transition-colors group/del"
                    title="Delete Image"
                  >
                    <Trash2 className="w-5 h-5 text-red-500 group-hover/del:text-white" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl bg-card border-border backdrop-blur-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-heading">Delete Image</AlertDialogTitle>
                    <AlertDialogDescription className="font-heading">
                      Are you sure you want to permanently delete this image from your history and storage? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()} className="rounded-xl border-border">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePerformDelete();
                      }}
                      className="rounded-xl bg-red-500 hover:bg-red-600 text-white border-none"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-red-500/50 bg-red-500/5">
          <p className="text-[10px] font-mono font-medium text-red-500/50">Failed to load</p>
        </div>
      )}
    </div>
  );
};
