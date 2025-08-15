"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useProModal } from "@/hooks/use-pro-modal";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Download, Share2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [width, setWidth] = useState("1024");
  const [height, setHeight] = useState("1024");
  const [seed, setSeed] = useState<number>(-1);
  const [responseExt, setResponseExt] = useState("png");
  const [numInferenceSteps, setNumInferenceSteps] = useState(4);
  const [imageData, setImageData] = useState<{ imageUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const proModal = useProModal();

  // Helper function to calculate display dimensions
  const getDisplayDimensions = () => {
    const actualWidth = width === "custom" ? customWidth : Number(width);
    const actualHeight = height === "custom" ? customHeight : Number(height);

    // Calculate aspect ratio
    const aspectRatio = actualWidth / actualHeight;

    // Maximum display dimensions
    const maxWidth = 400;
    const maxHeight = 400;

    let displayWidth = actualWidth;
    let displayHeight = actualHeight;

    // Scale down if too large while maintaining aspect ratio
    if (displayWidth > maxWidth || displayHeight > maxHeight) {
      if (aspectRatio > 1) {
        // Landscape
        displayWidth = maxWidth;
        displayHeight = maxWidth / aspectRatio;
      } else {
        // Portrait
        displayHeight = maxHeight;
        displayWidth = maxHeight * aspectRatio;
      }
    }

    return { width: displayWidth, height: displayHeight };
  };

  async function handleEnhancePrompt() {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPrompt(data.data);
        toast.success("Prompt enhanced successfully!");
      } else {
        toast.error(data.message || "Failed to enhance prompt");
      }
    } catch (err) {
      console.error("Prompt enhancement error:", err);
      toast.error("Failed to enhance prompt");
    } finally {
      setIsEnhancing(false);
    }
  }

  async function generateImage() {
    if (!prompt.trim()) return;

    setIsGeneratingImage(true);
    setError(null);
    setImageData(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          width: width === "custom" ? customWidth : Number(width),
          height: height === "custom" ? customHeight : Number(height),
          seed: Number(seed),
          responseExt,
          numInferenceSteps,
        }),
      });
      const data = await res.json();
      if (res.status === 403) {
        proModal.onOpen();
        setImageData(null);
        return;
      }
      if (res.status === 200 && data.success && data.data) {
        setImageData(data.data);
        toast.success("Image generated successfully!");
      } else {
        setError(data.message || "Failed to generate image");
        toast.error(data.message || "Failed to generate image");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Unknown error";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGeneratingImage(false);
    }
  }

  // Copy image URL to clipboard and show toast
  const handleCopyUrl = async () => {
    const url = imageData?.imageUrl;
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Image URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  // Download image
  const handleDownload = async () => {
    const url = imageData?.imageUrl;
    if (!url) return;

    let objectUrl: string | null = null;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `generated-image.${responseExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  };

  // Share image (Web Share API)
  const handleShare = async () => {
    const url = imageData?.imageUrl;
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this AI generated image!",
          url,
        });
        toast.success("Image shared!");
      } catch {
        toast.error("Failed to share image");
      }
    } else {
      toast.error("Sharing is not supported on this device");
    }
  };

  return (
    <div className="w-full h-full">
      {/* Mobile: Tabs, Desktop: Panels */}
      <div className="block sm:hidden w-full h-full">
        <Tabs defaultValue="parameters" className="w-full h-full pt-10 px-4">
          <TabsList className="w-full">
            <TabsTrigger value="parameters" className="flex-1">
              Parameters
            </TabsTrigger>
            <TabsTrigger value="result" className="flex-1">
              Result
            </TabsTrigger>
          </TabsList>
          <TabsContent value="parameters" className="w-full">
            <div className="flex flex-col items-center justify-center p-2 w-full">
              <div className="w-full space-y-6">
                <h2 className="text-2xl font-bold">Generation Parameters</h2>
                <div>
                  <Label htmlFor="prompt" className="my-2">
                    Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter your prompt here"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancing || !prompt.trim()}
                  >
                    {isEnhancing ? "Enhancing..." : "Enhance Prompt ✨"}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="negative-prompt" className="my-2">
                    Negative Prompt
                  </Label>
                  <Input
                    id="negative-prompt"
                    placeholder="Enter negative prompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="width" className="my-2">
                      Width
                    </Label>
                    <Select value={width} onValueChange={setWidth}>
                      <SelectTrigger id="width">
                        <SelectValue placeholder="Select width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024">1024</SelectItem>
                        <SelectItem value="512">512</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Display: {getDisplayDimensions().width}px
                    </p>
                    <AnimatePresence>
                      {width === "custom" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Input
                            type="number"
                            min={64}
                            max={2048}
                            value={customWidth}
                            onChange={(e) =>
                              setCustomWidth(Number(e.target.value))
                            }
                            placeholder="Custom Width"
                            className="mt-2"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="height" className="my-2">
                      Height
                    </Label>
                    <Select value={height} onValueChange={setHeight}>
                      <SelectTrigger id="height">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024">1024</SelectItem>
                        <SelectItem value="512">512</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Display: {getDisplayDimensions().height}px
                    </p>
                    <AnimatePresence>
                      {height === "custom" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Input
                            type="number"
                            min={64}
                            max={2048}
                            value={customHeight}
                            onChange={(e) =>
                              setCustomHeight(Number(e.target.value))
                            }
                            placeholder="Custom Height"
                            className="mt-2"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col items-start justify-between">
                    <Label htmlFor="inference-steps" className="my-2">
                      Inference Steps
                    </Label>
                    <span className="text-sm text-muted-foreground my-2">
                      {numInferenceSteps}
                    </span>
                  </div>
                  <Slider
                    id="inference-steps"
                    value={[numInferenceSteps]}
                    onValueChange={([val]) => setNumInferenceSteps(val)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="seed" className="my-2">
                      Seed
                    </Label>
                    <Input
                      id="seed"
                      type="number"
                      value={seed}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setSeed(isNaN(value) ? -1 : value);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="format" className="my-2">
                      File Format
                    </Label>
                    <Select value={responseExt} onValueChange={setResponseExt}>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={generateImage}
                  disabled={isGeneratingImage || !prompt.trim()}
                >
                  {isGeneratingImage ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="result" className="w-full">
            <div className="flex flex-col items-center justify-center p-2 w-full h-full">
              <div className="w-full h-full flex flex-col items-center justify-center rounded-lg relative">
                {isGeneratingImage ? (
                  <>
                    <div className="w-full flex flex-col items-center justify-center gap-4 flex-1">
                      <Skeleton
                        className="rounded border shadow"
                        style={{
                          width: getDisplayDimensions().width,
                          height: getDisplayDimensions().height,
                          maxWidth: "100%",
                        }}
                      />
                    </div>
                    <div className="w-full flex flex-row items-center gap-2 mt-4 absolute bottom-0 left-0 px-2 pb-2">
                      <Skeleton className="flex-1 h-9 rounded bg-muted" />
                      <Skeleton className="size-9 rounded bg-muted" />
                      <Skeleton className="size-9 rounded bg-muted" />
                      <Skeleton className="size-9 rounded bg-muted" />
                    </div>
                  </>
                ) : imageData ? (
                  <>
                    <div className="w-full flex flex-col items-center justify-center flex-1">
                      <Image
                        src={imageData?.imageUrl}
                        alt="AI generated image based on prompt"
                        width={getDisplayDimensions().width}
                        height={getDisplayDimensions().height}
                        className="rounded border shadow object-contain"
                        priority={false}
                        unoptimized={true}
                      />
                    </div>
                    <div className="w-full flex flex-row items-center gap-2 mt-4 absolute bottom-0 left-0 px-2 pb-2">
                      <Input
                        value={imageData?.imageUrl}
                        readOnly
                        className="flex-1 text-xs bg-muted cursor-pointer"
                        onClick={(e) => {
                          (e.target as HTMLInputElement).select();
                        }}
                        aria-label="Image URL"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleCopyUrl}
                        title="Copy image URL"
                        aria-label="Copy image URL"
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleDownload}
                        title="Download image"
                        aria-label="Download image"
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleShare}
                        title="Share image"
                        aria-label="Share image"
                      >
                        <Share2 className="size-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground text-center flex flex-1 items-center justify-center">
                    {error ? error : "Your generated image will appear here"}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden sm:block w-full h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[85vh] mt-10 flex-col sm:flex-row"
          suppressHydrationWarning={true}
        >
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="flex h-full flex-col items-center justify-center p-2 sm:p-6 w-full">
              <div className="w-full space-y-6">
                <h2 className="text-2xl font-bold">Generation Parameters</h2>
                <div>
                  <Label htmlFor="prompt" className="my-2">
                    Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter your prompt here"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[80px] sm:min-h-[120px]"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full sm:w-auto"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancing || !prompt.trim()}
                  >
                    {isEnhancing ? "Enhancing..." : "Enhance Prompt ✨"}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="negative-prompt" className="my-2">
                    Negative Prompt
                  </Label>
                  <Input
                    id="negative-prompt"
                    placeholder="Enter negative prompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width" className="my-2">
                      Width
                    </Label>
                    <Select value={width} onValueChange={setWidth}>
                      <SelectTrigger id="width">
                        <SelectValue placeholder="Select width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024">1024</SelectItem>
                        <SelectItem value="512">512</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Display: {getDisplayDimensions().width}px
                    </p>
                    <AnimatePresence>
                      {width === "custom" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Input
                            type="number"
                            min={64}
                            max={2048}
                            value={customWidth}
                            onChange={(e) =>
                              setCustomWidth(Number(e.target.value))
                            }
                            placeholder="Custom Width"
                            className="mt-2"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="height" className="my-2">
                      Height
                    </Label>
                    <Select value={height} onValueChange={setHeight}>
                      <SelectTrigger id="height">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024">1024</SelectItem>
                        <SelectItem value="512">512</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Display: {getDisplayDimensions().height}px
                    </p>
                    <AnimatePresence>
                      {height === "custom" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Input
                            type="number"
                            min={64}
                            max={2048}
                            value={customHeight}
                            onChange={(e) =>
                              setCustomHeight(Number(e.target.value))
                            }
                            placeholder="Custom Height"
                            className="mt-2"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <Label htmlFor="inference-steps" className="my-2">
                      Inference Steps
                    </Label>
                    <span className="text-sm text-muted-foreground my-2 sm:ml-2">
                      {numInferenceSteps}
                    </span>
                  </div>
                  <Slider
                    id="inference-steps"
                    value={[numInferenceSteps]}
                    onValueChange={([val]) => setNumInferenceSteps(val)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seed" className="my-2">
                      Seed
                    </Label>
                    <Input
                      id="seed"
                      type="number"
                      value={seed}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setSeed(isNaN(value) ? -1 : value);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="format" className="my-2">
                      File Format
                    </Label>
                    <Select value={responseExt} onValueChange={setResponseExt}>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={generateImage}
                  disabled={isGeneratingImage || !prompt.trim()}
                >
                  {isGeneratingImage ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle className="hidden sm:block" />
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="flex h-full flex-col items-center justify-center p-2 sm:p-6">
              <div className="w-full h-full flex flex-col items-center justify-center rounded-lg relative">
                {isGeneratingImage ? (
                  <>
                    <div className="w-full flex flex-col items-center justify-center gap-4 flex-1">
                      <Skeleton
                        className="rounded border shadow"
                        style={{
                          width: getDisplayDimensions().width,
                          height: getDisplayDimensions().height,
                          maxWidth: "100%",
                        }}
                      />
                    </div>
                    <div className="w-full flex flex-row items-center gap-2 mt-4 absolute bottom-0 left-0 px-2 pb-2">
                      <Skeleton className="flex-1 h-9 rounded bg-muted" />
                      <Skeleton className="size-9 rounded bg-muted" />
                      <Skeleton className="size-9 rounded bg-muted" />
                      <Skeleton className="size-9 rounded bg-muted" />
                    </div>
                  </>
                ) : imageData ? (
                  <>
                    <div className="w-full flex flex-col items-center justify-center flex-1">
                      <Image
                        src={imageData?.imageUrl}
                        alt="AI generated image based on prompt"
                        width={getDisplayDimensions().width}
                        height={getDisplayDimensions().height}
                        className="rounded border shadow object-contain"
                        priority={false}
                        unoptimized={true}
                      />
                    </div>
                    <div className="w-full flex flex-row items-center gap-2 mt-4 absolute bottom-0 left-0 px-2 pb-2">
                      <Input
                        value={imageData?.imageUrl}
                        readOnly
                        className="flex-1 text-xs bg-muted cursor-pointer"
                        onClick={(e) => {
                          (e.target as HTMLInputElement).select();
                        }}
                        aria-label="Image URL"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleCopyUrl}
                        title="Copy image URL"
                        aria-label="Copy image URL"
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleDownload}
                        title="Download image"
                        aria-label="Download image"
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleShare}
                        title="Share image"
                        aria-label="Share image"
                      >
                        <Share2 className="size-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground text-center flex flex-1 items-center justify-center">
                    {error ? error : "Your generated image will appear here"}
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
