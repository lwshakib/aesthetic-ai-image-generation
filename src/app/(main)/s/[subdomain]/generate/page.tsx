"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProModal } from "@/hooks/use-pro-modal";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Copy,
  Download,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Share2,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
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
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-muted/20">
      {/* Mobile: Tabs, Desktop: Panels */}
      <div className="block sm:hidden w-full h-full">
        <Tabs defaultValue="parameters" className="w-full h-full pt-10 px-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="parameters" className="flex-1 gap-2">
              <Wand2 className="h-4 w-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="result" className="flex-1 gap-2">
              <ImageIcon className="h-4 w-4" />
              Result
            </TabsTrigger>
          </TabsList>
          <TabsContent value="parameters" className="w-full mt-6">
            <div className="flex flex-col items-center justify-center p-2 w-full">
              <Card className="w-full border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Generation Parameters
                  </CardTitle>
                  <CardDescription>
                    Configure your image generation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="w-full space-y-6">
                  <div>
                    <Label
                      htmlFor="prompt"
                      className="my-2 flex items-center gap-2"
                    >
                      <Wand2 className="h-4 w-4 text-muted-foreground" />
                      Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the image you want to generate... e.g., 'A serene landscape at sunset with mountains in the background'"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancing || !prompt.trim()}
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Enhance Prompt
                        </>
                      )}
                    </Button>
                  </div>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label
                          htmlFor="negative-prompt"
                          className="my-2 flex items-center gap-2 cursor-help"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                          Negative Prompt
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Specify what you don't want in the image</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="negative-prompt"
                      placeholder="e.g., blurry, low quality, distorted"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label
                        htmlFor="width"
                        className="my-2 flex items-center gap-2"
                      >
                        <Maximize2 className="h-4 w-4 text-muted-foreground" />
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
                      <Label
                        htmlFor="height"
                        className="my-2 flex items-center gap-2"
                      >
                        <Maximize2 className="h-4 w-4 text-muted-foreground rotate-90" />
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
                      <Select
                        value={responseExt}
                        onValueChange={setResponseExt}
                      >
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
                    className="w-full h-11 text-base font-semibold"
                    onClick={generateImage}
                    disabled={isGeneratingImage || !prompt.trim()}
                    size="lg"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-5 w-5" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="result" className="w-full mt-6">
            <div className="flex flex-col items-center justify-center p-2 w-full h-full">
              <Card className="w-full border-2 min-h-[500px]">
                <CardContent className="p-6">
                  <div className="w-full h-full flex flex-col items-center justify-center rounded-lg relative">
                    {isGeneratingImage ? (
                      <div className="flex flex-col items-center justify-center gap-6 py-12">
                        <div className="relative">
                          <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
                          <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900 animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-lg font-semibold">
                            Generating your image...
                          </p>
                          <p className="text-sm text-muted-foreground">
                            This may take a few moments
                          </p>
                        </div>
                        <Skeleton
                          className="rounded-lg border-2 shadow-lg"
                          style={{
                            width: getDisplayDimensions().width,
                            height: getDisplayDimensions().height,
                            maxWidth: "100%",
                          }}
                        />
                      </div>
                    ) : imageData ? (
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-center rounded-lg border-2 bg-muted/30 p-4">
                          <Image
                            src={imageData?.imageUrl}
                            alt="AI generated image based on prompt"
                            width={getDisplayDimensions().width}
                            height={getDisplayDimensions().height}
                            className="rounded-lg border shadow-lg object-contain max-w-full"
                            priority={false}
                            unoptimized={true}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <Input
                            value={imageData?.imageUrl}
                            readOnly
                            className="flex-1 text-xs bg-muted cursor-pointer font-mono"
                            onClick={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                            aria-label="Image URL"
                          />
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={handleCopyUrl}
                                  aria-label="Copy image URL"
                                >
                                  <Copy className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy URL</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={handleDownload}
                                  aria-label="Download image"
                                >
                                  <Download className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={handleShare}
                                  aria-label="Share image"
                                >
                                  <Share2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Share</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                        <div className="rounded-full bg-destructive/10 p-4">
                          <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold text-destructive">
                            Error
                          </p>
                          <p className="text-sm text-muted-foreground max-w-md">
                            {error}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setError(null);
                            setImageData(null);
                          }}
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                        <div className="rounded-full bg-muted p-6">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold">
                            No image generated yet
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Configure your parameters and click Generate to
                            create an image
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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
            <div className="flex h-full flex-col items-start justify-start p-6 w-full overflow-y-auto">
              <Card className="w-full border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Generation Parameters
                  </CardTitle>
                  <CardDescription>
                    Configure your image generation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="w-full space-y-6">
                  <div>
                    <Label
                      htmlFor="prompt"
                      className="my-2 flex items-center gap-2"
                    >
                      <Wand2 className="h-4 w-4 text-muted-foreground" />
                      Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the image you want to generate... e.g., 'A serene landscape at sunset with mountains in the background'"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full sm:w-auto"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancing || !prompt.trim()}
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Enhance Prompt
                        </>
                      )}
                    </Button>
                  </div>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label
                          htmlFor="negative-prompt"
                          className="my-2 flex items-center gap-2 cursor-help"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                          Negative Prompt
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Specify what you don't want in the image</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="negative-prompt"
                      placeholder="e.g., blurry, low quality, distorted"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="width"
                        className="my-2 flex items-center gap-2"
                      >
                        <Maximize2 className="h-4 w-4 text-muted-foreground" />
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
                      <Label
                        htmlFor="height"
                        className="my-2 flex items-center gap-2"
                      >
                        <Maximize2 className="h-4 w-4 text-muted-foreground rotate-90" />
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
                      <Select
                        value={responseExt}
                        onValueChange={setResponseExt}
                      >
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
                    className="w-full h-11 text-base font-semibold"
                    onClick={generateImage}
                    disabled={isGeneratingImage || !prompt.trim()}
                    size="lg"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-5 w-5" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
          <ResizableHandle className="hidden sm:block" />
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="flex h-full flex-col items-center justify-center p-6 overflow-y-auto">
              <Card className="w-full border-2 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Generated Image
                  </CardTitle>
                  <CardDescription>
                    Your AI-generated image will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  {isGeneratingImage ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-12">
                      <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
                        <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900 animate-pulse" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-lg font-semibold">
                          Generating your image...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          This may take a few moments
                        </p>
                      </div>
                      <Skeleton
                        className="rounded-lg border-2 shadow-lg"
                        style={{
                          width: getDisplayDimensions().width,
                          height: getDisplayDimensions().height,
                          maxWidth: "100%",
                        }}
                      />
                    </div>
                  ) : imageData ? (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-center rounded-lg border-2 bg-muted/30 p-4">
                        <Image
                          src={imageData?.imageUrl}
                          alt="AI generated image based on prompt"
                          width={getDisplayDimensions().width}
                          height={getDisplayDimensions().height}
                          className="rounded-lg border shadow-lg object-contain max-w-full"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Input
                          value={imageData?.imageUrl}
                          readOnly
                          className="flex-1 text-xs bg-muted cursor-pointer font-mono"
                          onClick={(e) => {
                            (e.target as HTMLInputElement).select();
                          }}
                          aria-label="Image URL"
                        />
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={handleCopyUrl}
                                aria-label="Copy image URL"
                              >
                                <Copy className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy URL</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={handleDownload}
                                aria-label="Download image"
                              >
                                <Download className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={handleShare}
                                aria-label="Share image"
                              >
                                <Share2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Share</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                      <div className="rounded-full bg-destructive/10 p-4">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-destructive">
                          Error
                        </p>
                        <p className="text-sm text-muted-foreground max-w-md">
                          {error}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setError(null);
                          setImageData(null);
                        }}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                      <div className="rounded-full bg-muted p-6">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">
                          No image generated yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Configure your parameters and click Generate to create
                          an image
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
