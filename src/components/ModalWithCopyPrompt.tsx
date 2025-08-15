"use client";

import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Download, Share2, UserCircle } from "lucide-react";
import { useState as useReactState } from "react";

interface UserInfo {
  imageUrl?: string;
  name: string;
  id: string;
}

interface ImageLike {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  prompt: string;
  seed: string | number;
  createdAt: string;
  user: UserInfo;
}

function sliceWords(text: string, maxWords: number) {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

export default function ModalWithCopyPrompt({
  selected,
  onClose,
}: {
  selected: ImageLike;
  onClose: () => void;
}) {
  const [copied, setCopied] = useReactState(false);
  const [downloaded, setDownloaded] = useReactState(false);
  const [shared, setShared] = useReactState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selected.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {}
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = selected.imageUrl;
    link.download = `image-${selected.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this AI generated image!",
          url: selected.imageUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 1000);
      } catch {}
    } else {
      // fallback: copy image URL
      try {
        await navigator.clipboard.writeText(selected.imageUrl);
        setShared(true);
        setTimeout(() => setShared(false), 1000);
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-background rounded-xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full mx-4 overflow-hidden animate-fadeIn max-h-screen overflow-y-auto hide-scrollbar">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-foreground text-2xl z-10 hover:text-red-400 transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Image section */}
        <div className="flex-1 min-w-[300px] bg-muted flex items-center justify-center p-4">
          <img
            src={selected.imageUrl}
            alt={selected.prompt}
            className="rounded-lg max-h-[70vh] w-auto h-auto object-contain shadow-lg"
            style={{ maxWidth: "100%" }}
          />
        </div>
        {/* Details section */}
        <div className="flex-1 flex flex-col gap-4 p-6 text-foreground min-w-[300px] max-w-md">
          {/* User info */}
          <div className="flex items-center gap-3">
            {selected.user?.imageUrl ? (
              <img
                src={selected.user.imageUrl}
                alt={selected.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-muted-foreground" />
            )}
            <span className="font-semibold text-lg">{selected.user?.name}</span>
          </div>
          {/* Prompt title and copy/download/share buttons */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <div className="text-xl font-bold">
                {sliceWords(selected.prompt, 6)}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={copied}
                title="Copy prompt"
                aria-label="Copy prompt"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                disabled={downloaded}
                title="Download image"
                aria-label="Download image"
              >
                <Download className="w-4 h-4" />
                {downloaded ? "Downloaded!" : "Download"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShare}
                disabled={shared}
                title="Share image"
                aria-label="Share image"
              >
                <Share2 className="w-4 h-4" />
                {shared ? "Shared!" : "Share"}
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm whitespace-pre-line">
              {selected.prompt}
            </div>
          </div>
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-xs mt-2">
            <div>
              <div className="text-muted-foreground">Resolution</div>
              <div>
                {selected.width}×{selected.height}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Created</div>
              <div>
                {formatDistanceToNow(new Date(selected.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Seed</div>
              <div>{selected?.seed}</div>
            </div>
            <div>
              <div className="text-muted-foreground">ID</div>
              <div className="break-all">{selected.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
