"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { 
  Sparkle, 
  Image as ImageIcon, 
  Layers, 
  Maximize, 
  Settings2, 
  Send, 
  Loader2,
  Check,
  RefreshCcw,
  HelpCircle,
  Box,
  Paintbrush,
  Globe,
  Circle,
  Activity,
  MoreHorizontal,
  User,
  Zap,
  Link2,
  Trash2,
  XIcon
} from "lucide-react";
import { 
  WorkstationSelector, 
  WorkstationSelectorTrigger, 
  WorkstationSelectorContent, 
  WorkstationSelectorInput, 
  WorkstationSelectorList, 
  WorkstationSelectorEmpty, 
  WorkstationSelectorGroup, 
  WorkstationSelectorItem, 
  WorkstationSelectorName, 
  WorkstationSelectorDescription
} from "@/components/ui/workstation-selector";
import { 
  PromptInput, 
  PromptInputAttachments, 
  PromptInputAttachment, 
  PromptInputBody, 
  PromptInputTextarea, 
  PromptInputFooter, 
  PromptInputTools, 
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments, 
  PromptInputSubmit,
  PromptInputRefine,
  PromptInputProvider
} from "@/components/ai/prompt-input";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AI_MODELS, IMAGE_MODELS } from "@/lib/models";
import { GenerationResult } from "@/components/generation-result";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface GenerationWithImages {
  id: string;
  prompt: string;
  width: number;
  height: number;
  isGenerating?: boolean;
  images: {
    id: string;
    path: string;
    prompt: string;
  }[];
  createdAt: Date;
}

interface WorkstationSidebarProps {
  model: string;
  setModel: (v: string) => void;
  style: string;
  setStyle: (v: string) => void;
  ratio: string;
  setRatio: (v: string) => void;
  count: string;
  setCount: (v: string) => void;
  customWidth: string;
  setCustomWidth: (v: string) => void;
  customHeight: string;
  setCustomHeight: (v: string) => void;
  numInferenceSteps: number;
  setNumInferenceSteps: (v: number) => void;
  isLinked: boolean;
  setIsLinked: (v: boolean) => void;
  negativePrompt: string;
  setNegativePrompt: (v: string) => void;
  format: string;
  setFormat: (v: string) => void;
  resetDefaults: () => void;
  className?: string;
  onClose?: () => void;
}

function WorkstationSidebar({
  model, setModel, style, setStyle, ratio, setRatio, count, setCount,
  customWidth, setCustomWidth, customHeight, setCustomHeight,
  numInferenceSteps, setNumInferenceSteps, isLinked, setIsLinked,
  negativePrompt, setNegativePrompt, format, setFormat, resetDefaults,
  className, onClose
}: WorkstationSidebarProps) {
  return (
    <div className={cn("flex flex-col h-full bg-card/80 backdrop-blur-xl overflow-hidden relative", className)}>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-8">
        {/* Model Selector */}
        <div className="relative group">
          <WorkstationSelector value={model} onValueChange={(v) => v && setModel(v)}>
            <WorkstationSelectorTrigger asChild>
              <button className="w-full h-11 bg-secondary/50 border-border border rounded-xl pl-10 pr-4 relative focus:ring-1 focus:ring-ring/10 transition-all flex flex-col items-start justify-center group/btn hover:bg-secondary">
                <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover/btn:text-foreground transition-colors" />
                <div className="flex flex-col items-start gap-0.5 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground leading-none">Model</span>
                    <Badge variant="outline" className="h-3 px-1 text-[7px] bg-green-500/10 text-green-400 border-green-500/20 rounded-sm">
                      {model === "flux-1-schnell" ? "Recommended" : "Active"}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-foreground font-medium capitalize">
                    {AI_MODELS.find(m => m.id === model)?.name || "Unknown Model"}
                  </span>
                </div>
              </button>
            </WorkstationSelectorTrigger>
            <WorkstationSelectorContent>
              <WorkstationSelectorInput placeholder="Search models..." />
              <WorkstationSelectorList>
                <WorkstationSelectorEmpty>No models found.</WorkstationSelectorEmpty>
                <WorkstationSelectorGroup>
                  {IMAGE_MODELS.map(m => (
                    <WorkstationSelectorItem key={m.id} value={m.id} className="flex items-center gap-3">
                       <div className="flex flex-col flex-1 min-w-0">
                          <WorkstationSelectorName>{m.name}</WorkstationSelectorName>
                          <WorkstationSelectorDescription className="truncate">{m.description}</WorkstationSelectorDescription>
                       </div>
                       {m.capabilities.imageToImage && (
                          <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0 ml-auto" />
                       )}
                    </WorkstationSelectorItem>
                  ))}
                </WorkstationSelectorGroup>
              </WorkstationSelectorList>
            </WorkstationSelectorContent>
          </WorkstationSelector>
        </div>

        {/* Style Selector */}
        <div className="relative group">
           <WorkstationSelector value={style} onValueChange={(v) => v && setStyle(v)}>
            <WorkstationSelectorTrigger asChild>
              <button className="w-full h-11 bg-secondary/50 border-border border rounded-xl pl-10 pr-4 relative focus:ring-1 focus:ring-ring/10 transition-all flex flex-col items-start justify-center group/btn hover:bg-secondary">
                <Paintbrush className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover/btn:text-foreground transition-colors" />
                <div className="flex flex-col items-start gap-0.5 pointer-events-none">
                   <span className="text-[10px] font-mono text-muted-foreground leading-none">Style</span>
                   <span className="text-[11px] text-foreground font-medium capitalize">{style}</span>
                </div>
              </button>
            </WorkstationSelectorTrigger>
            <WorkstationSelectorContent>
              <WorkstationSelectorInput placeholder="Search styles..." />
              <WorkstationSelectorList>
                <WorkstationSelectorEmpty>No styles found.</WorkstationSelectorEmpty>
                <WorkstationSelectorGroup>
                  {[
                    { id: "none", name: "None", desc: "No specific style guidance", icon: <Circle /> },
                    { id: "dynamic", name: "Dynamic", desc: "Bold and high-contrast", icon: <Zap /> },
                    { id: "cinematic", name: "Cinematic", desc: "Movie-like lighting and depth", icon: <Activity /> },
                    { id: "creative", name: "Creative", desc: "Artistic interpretation", icon: <Sparkle /> },
                    { id: "fashion", name: "Fashion", desc: "Studio-style photography", icon: <User /> },
                    { id: "portrait", name: "Portrait", desc: "Focus on subject details", icon: <User /> },
                    { id: "stock", name: "Stock Photo", desc: "Clean and commercial", icon: <Globe /> },
                    { id: "vibrant", name: "Vibrant", desc: "Saturated and alive", icon: <Zap /> },
                  ].map(s => (
                    <WorkstationSelectorItem key={s.id} value={s.id} className="flex items-center gap-3">
                       <div className="flex flex-col flex-1 min-w-0">
                          <WorkstationSelectorName>{s.name}</WorkstationSelectorName>
                          <WorkstationSelectorDescription className="truncate">{s.desc}</WorkstationSelectorDescription>
                       </div>
                    </WorkstationSelectorItem>
                  ))}
                </WorkstationSelectorGroup>
              </WorkstationSelectorList>
            </WorkstationSelectorContent>
          </WorkstationSelector>
        </div>

        {/* Image Dimensions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-heading font-medium text-foreground tracking-tight">Image Dimensions</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>Select the output image proportions</TooltipContent>
            </Tooltip>
          </div>
          <ToggleGroup 
            type="single" 
            value={ratio} 
            onValueChange={(v) => v && setRatio(v)} 
            variant="outline" 
            className="w-full justify-start"
          >
            {[
              { id: "2:3", label: "2:3", icon: <div className="w-3 h-5 border-[1.5px] border-current rounded-[2px]" /> },
              { id: "1:1", label: "1:1", icon: <div className="w-4 h-4 border-[1.5px] border-current rounded-[2px]" /> },
              { id: "16:9", label: "16:9", icon: <div className="w-6 h-3 border-[1.5px] border-current rounded-[2px]" /> },
            ].map((item) => (
              <ToggleGroupItem
                key={item.id}
                value={item.id}
                className="flex flex-col items-center justify-center gap-2 h-auto aspect-square flex-1"
              >
                <div className="opacity-70">{item.icon}</div>
                <span className="text-[10px] font-mono">{item.label}</span>
              </ToggleGroupItem>
            ))}
            
            <Popover>
              <PopoverTrigger asChild>
                <ToggleGroupItem
                  value="custom"
                  className="flex flex-col items-center justify-center gap-2 h-auto aspect-square flex-1"
                >
                  <div className="opacity-70"><Maximize className="w-4 h-4" /></div>
                  <span className={cn("font-mono text-center", ratio === "custom" ? "text-[9px] tracking-tighter" : "text-[10px]")}>
                    {ratio === "custom" ? `${customWidth}×${customHeight}` : "Custom"}
                  </span>
                </ToggleGroupItem>
              </PopoverTrigger>
              <PopoverContent side="right" sideOffset={16} className="w-64 bg-background border-border p-4 text-foreground rounded-xl shadow-2xl">
                 <div className="space-y-4">
                   <div className="flex items-center justify-between mb-2">
                     <p className="text-sm font-medium text-foreground">Custom dimensions</p>
                     <div className="flex items-center gap-1.5" title="Lock aspect ratio">
                       <Switch checked={isLinked} onCheckedChange={setIsLinked} className="scale-75 data-[state=checked]:bg-green-500" />
                     </div>
                   </div>
                   
                   <div className="space-y-6">
                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-medium text-muted-foreground">Width</span>
                          <input type="number" 
                            value={customWidth} 
                            min={256} 
                            max={1024}
                            onChange={e => {
                              const val = Math.min(1024, Math.max(256, parseInt(e.target.value) || 256));
                              setCustomWidth(val.toString());
                              if (isLinked) setCustomHeight(val.toString());
                            }} className="w-16 bg-muted border border-border rounded-md h-7 text-xs font-mono text-center focus:outline-none focus:border-accent transition-colors" />
                       </div>
                        <Slider 
                          value={[parseInt(customWidth) || 1024]} 
                          min={256} max={1024} step={64} 
                         onValueChange={(v) => {
                           setCustomWidth(v[0].toString());
                           if (isLinked) setCustomHeight(v[0].toString());
                         }} 
                       />
                     </div>

                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-medium text-muted-foreground">Height</span>
                          <input type="number" 
                            value={customHeight} 
                            min={256} 
                            max={1024}
                            onChange={e => {
                              const val = Math.min(1024, Math.max(256, parseInt(e.target.value) || 256));
                              setCustomHeight(val.toString());
                              if (isLinked) setCustomWidth(val.toString());
                            }} className="w-16 bg-secondary border border-border rounded-md h-7 text-xs font-mono text-center focus:outline-none focus:border-accent transition-colors" />
                       </div>
                        <Slider 
                          value={[parseInt(customHeight) || 1024]} 
                          min={256} max={1024} step={64} 
                         onValueChange={(v) => {
                           setCustomHeight(v[0].toString());
                           if (isLinked) setCustomWidth(v[0].toString());
                         }} 
                       />
                     </div>
                   </div>
                 </div>
              </PopoverContent>
            </Popover>
          </ToggleGroup>
        </div>

        {/* Number of Generations */}
        <div className="space-y-4">
           <div className="flex items-center gap-2">
            <h3 className="text-xs font-heading font-medium text-foreground tracking-tight">Number of generations</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>How many images to generate at once</TooltipContent>
            </Tooltip>
          </div>
          <ToggleGroup 
            type="single" 
            value={count} 
            onValueChange={(v) => v && setCount(v)} 
            variant="outline" 
            className="w-full"
          >
            {["1", "2", "3", "4"].map((num) => (
              <ToggleGroupItem
                key={num}
                value={num}
                className="flex-1 font-mono"
              >
                {num}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <Separator className="bg-border" />

        {/* Advanced Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-heading font-medium text-foreground tracking-tight uppercase">Advanced Settings</h3>
          </div>

          {/* Inference Steps */}           <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-medium text-muted-foreground">Inference Steps</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>More steps = higher quality but slower generation (max 8)</TooltipContent>
                </Tooltip>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">{numInferenceSteps}</span>
            </div>
            <Slider 
              value={[numInferenceSteps]} 
              onValueChange={(v) => setNumInferenceSteps(v[0])}
              max={8}
              min={1}
              step={1}
              className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-foreground [&_[role=slider]]:border-none"
            />
          </div>


          {/* Output Format */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-medium text-muted-foreground">Output Format</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>The file format of the generated image</TooltipContent>
              </Tooltip>
            </div>
            <ToggleGroup 
              type="single" 
              value={format} 
              onValueChange={(v) => v && setFormat(v)} 
              variant="outline" 
              className="w-full h-8"
            >
              {["png", "jpeg"].map((f) => (
                <ToggleGroupItem
                  key={f}
                  value={f}
                  className="flex-1 text-[10px] uppercase font-mono h-full"
                >
                  {f}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Negative Prompt */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-medium text-muted-foreground">Negative Prompt</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>Describe elements you want to exclude from the image</TooltipContent>
              </Tooltip>
            </div>
            <Textarea 
              placeholder="e.g. blurry, low quality, distorted..." 
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="bg-muted/50 border-border text-foreground placeholder-muted-foreground text-[11px] min-h-[80px] focus-visible:ring-1 focus-visible:ring-ring/10 resize-none rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* SIDEBAR FOOTER */}
      <div className="p-6 bg-muted/30">
         <button 
           onClick={resetDefaults}
           className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground hover:text-foreground transition-colors tracking-widest w-full justify-center group"
         >
            <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            Reset to Defaults
         </button>
      </div>
    </div>
  );
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [model, setModel] = useState("flux-1-schnell");
  const [style, setStyle] = useState("cinematic");
  const [ratio, setRatio] = useState("1:1");
  const [count, setCount] = useState("1");
  const [customWidth, setCustomWidth] = useState("1024");
  const [customHeight, setCustomHeight] = useState("1024");
  const [numInferenceSteps, setNumInferenceSteps] = useState(4);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [format, setFormat] = useState("png");
  const [customCount, setCustomCount] = useState("10");
  const [isLinked, setIsLinked] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Real Data State
  const [results, setResults] = useState<GenerationWithImages[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchGenerations = useCallback(async (currentCursor: string | null = null) => {
    if (isLoadingMore || (!hasMore && currentCursor)) return;
    
    setIsLoadingMore(true);
    try {
      const url = new URL("/api/ai/generations", window.location.origin);
      url.searchParams.append("limit", "3");
      if (currentCursor) url.searchParams.append("cursor", currentCursor);
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.generations) {
        setResults((prev) => {
          // Prevent duplicates by checking IDs
          const existingIds = new Set(prev.map(g => g.id));
          const newItems = data.generations.filter((g: any) => !existingIds.has(g.id));
          return [...prev, ...newItems];
        });
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      }
    } catch (error) {
      console.error("Failed to fetch generations:", error);
      toast.error("Failed to load generations");
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore]);

  // Initial load
  useEffect(() => {
    fetchGenerations();
  }, []);

  // Load more on scroll
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && results.length > 0) {
      fetchGenerations(cursor);
    }
  }, [inView, hasMore, isLoadingMore, results.length, cursor, fetchGenerations]);


  const handleDeleteGeneration = async (id: string) => {
    try {
      const res = await fetch(`/api/ai/generations/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Generation deleted");
        setResults(prev => prev.filter(g => g.id !== id));
      } else {
        toast.error("Failed to delete generation");
      }
    } catch (error) {
      toast.error("Error deleting generation");
    } finally {
      setGenerationToDelete(null);
    }
  };

  const handleDeleteImage = (imageId: string, generationId: string) => {
    setResults(prev => prev.map(g => {
      if (g.id === generationId) {
        const remainingImages = g.images.filter(img => img.id !== imageId);
        return {
          ...g,
          images: remainingImages
        };
      }
      return g;
    }).filter(g => g.images.length > 0)); 
  };

  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    
    if (!activePrompt.trim()) {
      toast.error("Please enter a prompt first.");
      return;
    }
    setIsGenerating(true);
    
    // 1. Create an Optimistic Generation object
    const tempId = `opt-${Date.now()}`;
    const w = ratio === "custom" ? Math.min(1024, parseInt(customWidth)) : (ratio === "1:1" ? 1024 : (ratio === "2:3" ? 682 : 1024));
    const h = ratio === "custom" ? Math.min(1024, parseInt(customHeight)) : (ratio === "1:1" ? 1024 : (ratio === "2:3" ? 1024 : 576));
    const imageCount = parseInt(count) || 1;

    const optimisticGeneration: GenerationWithImages = {
      id: tempId,
      prompt: activePrompt,
      width: w,
      height: h,
      isGenerating: true,
      images: Array(imageCount).fill({ id: "", path: "", prompt: "" }),
      createdAt: new Date()
    };

    // Prepend the optimistic result to the list immediately
    setResults((prev) => [optimisticGeneration, ...prev]);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activePrompt,
          model,
          negativePrompt,
          numInferenceSteps,
          width: w,
          height: h,
          count,
          style,
          format,
        }),
      });

      const data = await res.json();
      if (data.images) {
        setResults((prev) => 
          prev.map((gen) => 
            gen.id === tempId 
              ? { 
                  ...gen, 
                  id: data.id, 
                  images: data.images, 
                  isGenerating: false 
                } 
              : gen
          )
        );
        toast.success("Masterpiece generated!");
      } else if (data.error) {
        // Remove the optimistic item on error
        setResults((prev) => prev.filter((gen) => gen.id !== tempId));
        toast.error(data.error);
      }
    } catch (error) {
      // Remove the optimistic item on fetch error
      setResults((prev) => prev.filter((gen) => gen.id !== tempId));
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetDefaults = () => {
    setModel("auto");
    setStyle("dynamic");
    setRatio("1:1");
    setCount("1");
    setNumInferenceSteps(4);
    setNegativePrompt("");
    setFormat("png");
    setPrompt("");
    toast.success("Settings reset to defaults");
  };

  return (
    <TooltipProvider>
      <div className="flex flex-1 overflow-hidden relative">
        {/* Background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none opacity-40"></div>
        
        {/* Grid Pattern */}
        <div className="fixed inset-0 pointer-events-none z-0" 
          style={{ 
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", 
            backgroundSize: "4rem 4rem", 
            maskImage: "radial-gradient(circle at center, black, transparent 80%)", 
            WebkitMaskImage: "radial-gradient(circle at center, black, transparent 80%)" 
          }}
        ></div>

        {/* BESPOKE SIDEBAR WORKSTATION (Desktop) */}
        <aside 
          className="hidden lg:flex w-80 border border-border bg-card/80 backdrop-blur-xl z-20 flex-col rounded-3xl ml-6 my-6 h-[calc(100vh-112px)] overflow-hidden shadow-2xl relative"
        >
          <WorkstationSidebar 
            model={model} setModel={setModel}
            style={style} setStyle={setStyle}
            ratio={ratio} setRatio={setRatio}
            count={count} setCount={setCount}
            customWidth={customWidth} setCustomWidth={setCustomWidth}
            customHeight={customHeight} setCustomHeight={setCustomHeight}
            numInferenceSteps={numInferenceSteps} setNumInferenceSteps={setNumInferenceSteps}
            isLinked={isLinked} setIsLinked={setIsLinked}
            negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt}
            format={format} setFormat={setFormat}
            resetDefaults={resetDefaults}
          />
        </aside>

        {/* BESPOKE SIDEBAR WORKSTATION (Mobile) */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-4 bg-transparent border-none w-fit overflow-visible" showCloseButton={false}>
            <WorkstationSidebar 
              model={model} setModel={setModel}
              style={style} setStyle={setStyle}
              ratio={ratio} setRatio={setRatio}
              count={count} setCount={setCount}
              customWidth={customWidth} setCustomWidth={setCustomWidth}
              customHeight={customHeight} setCustomHeight={setCustomHeight}
              numInferenceSteps={numInferenceSteps} setNumInferenceSteps={setNumInferenceSteps}
              isLinked={isLinked} setIsLinked={setIsLinked}
              negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt}
              format={format} setFormat={setFormat}
              resetDefaults={resetDefaults}
              className="h-[calc(100vh-32px)] w-80 rounded-3xl border border-border shadow-2xl relative"
              onClose={() => setIsSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 z-10 px-4 py-8 lg:p-12 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* TOP GENERATION BAR */}
            <div className="animate-fade-up">
              <PromptInputProvider initialInput={prompt}>
               <PromptInput
                  onSubmit={(message) => {
                    setPrompt(message.text);
                    handleGenerate(message.text);
                  }}
                  className=""
                >
                  <PromptInputAttachments>
                    {(attachment) => <PromptInputAttachment data={attachment} />}
                  </PromptInputAttachments>
                  <PromptInputBody>
                    <PromptInputTextarea 
                      placeholder="Describe your visual concept..."
                      className="bg-transparent border-none focus-visible:ring-0 text-foreground placeholder-muted-foreground min-h-[100px] p-4 text-sm"
                    />
                  </PromptInputBody>
                  <PromptInputFooter className="px-4 pb-4">
                    <PromptInputTools>
                      <PromptInputActionMenu>
                        <PromptInputActionMenuTrigger />
                        <PromptInputActionMenuContent>
                          <PromptInputActionAddAttachments />
                        </PromptInputActionMenuContent>
                      </PromptInputActionMenu>
                    </PromptInputTools>
                    <div className="flex items-center gap-2">
                       <button 
                         type="button"
                         onClick={() => setIsSidebarOpen(true)}
                         className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                         title="Workstation Settings"
                       >
                         <Settings2 className="size-4" />
                       </button>
                       <PromptInputRefine />
                       <PromptInputSubmit 
                         status={isGenerating ? "submitted" : undefined}
                         className="bg-foreground text-background hover:bg-foreground/90 transition-all font-medium rounded-xl"
                       />
                     </div>
                  </PromptInputFooter>
                </PromptInput>
              </PromptInputProvider>
            </div>

            {/* GENERATION RESULTS */}
            {results.length > 0 && (
              <div className="space-y-12 animate-fade-in pb-40">
                <div className="flex items-center justify-between h-8">
                </div>
                
                <div className="space-y-16">
                  {results.map((gen) => (
                    <div key={gen.id} className={cn("space-y-6", gen.isGenerating && "animate-pulse")}>
                      <div className="flex items-center gap-4 group/gen">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#222] to-transparent" />
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-[#444] tracking-[0.2em]">
                            {gen.prompt.length > 50 ? gen.prompt.substring(0, 50) + "..." : gen.prompt}
                          </span>
                          {!gen.isGenerating && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setGenerationToDelete(gen.id);
                              }}
                              className="p-1 rounded-md hover:bg-red-500/10 text-[#222] hover:text-red-500 transition-all opacity-0 group-hover/gen:opacity-100"
                              title="Delete Generation"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#222] to-transparent" />
                      </div>
                      
                       <div className={cn(
                         "grid gap-6",
                         gen.images.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : 
                         gen.images.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto" : 
                         gen.images.length === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto" : 
                         "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto"
                       )}>
                        {gen.isGenerating ? (
                          gen.images.map((_, i) => (
                            <div 
                              key={`skeleton-${gen.id}-${i}`} 
                              className="relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] shadow-xl"
                              style={{ aspectRatio: `${gen.width}/${gen.height}` }}
                            >
                               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center" />
                            </div>
                          ))
                        ) : (
                          gen.images.map((img) => (
                            <GenerationResult 
                              key={img.id} 
                              id={img.id}
                              imagePath={img.path} 
                              prompt={img.prompt} 
                              width={gen.width}
                              height={gen.height}
                              onDelete={(id) => handleDeleteImage(id, gen.id)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* INFINITE SCROLL TARGET */}
                <div ref={ref} className="h-20 flex items-center justify-center">
                  {isLoadingMore && (
                    <div className="flex flex-col items-center gap-3 animate-fade-in">
                       <Loader2 className="w-5 h-5 text-[#333] animate-spin" />
                       <span className="text-[10px] font-mono text-[#444] tracking-widest">LOADING MORE...</span>
                    </div>
                  )}
                  {!hasMore && results.length > 0 && (
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-[#222]" />
                       <span className="text-[9px] font-mono text-[#333] tracking-widest">END OF GALLERY</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {results.length === 0 && !isGenerating && !isLoadingMore && (
               <div className="flex flex-col items-center justify-center py-40 animate-fade-in">
                  <Layers className="w-12 h-12 text-[#1a1a1a] mb-6" />
                  <h3 className="text-sm font-medium text-white/50 mb-2">No generations yet</h3>
                  <p className="text-[11px] text-[#444] text-center max-w-xs">
                    Start by describing your visual concept in the prompt bar above to create your first masterpiece.
                  </p>
               </div>
            )}
          </div>
        </main>
      </div>

      <AlertDialog open={!!generationToDelete} onOpenChange={(open) => !open && setGenerationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Generation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this entire generation group from your history and storage? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => generationToDelete && handleDeleteGeneration(generationToDelete)}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
