export type ModelProvider = "Black Forest Labs" | "Leonardo.Ai" | "Zhipu AI";
export type ModelType = "text-to-image";

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  type: ModelType;
  description: string;
  capabilities: {
    textToImage?: boolean;
    imageToImage?: boolean;
    textGeneration?: boolean;
    multiReference?: boolean;
  };
  pricing: {
    input?: string;
    output?: string;
    unit?: string;
  };
  limits: {
    maxSteps?: number;
    maxResolution?: number;
  };
}

export const AI_MODELS: AIModel[] = [
  {
    id: "flux-1-schnell",
    name: "FLUX.1 [schnell]",
    provider: "Black Forest Labs",
    type: "text-to-image",
    description: "Lightning-fast image generation.",
    capabilities: { textToImage: true },
    pricing: { unit: "$0.000053 per 512 tile" },
    limits: { maxSteps: 50, maxResolution: 1024 }
  },
  {
    id: "flux-2-dev",
    name: "FLUX.2 [dev]",
    provider: "Black Forest Labs",
    type: "text-to-image",
    description: "Pro-grade high-fidelity synthesis.",
    capabilities: { textToImage: true, imageToImage: true, multiReference: true },
    pricing: { input: "$0.00021/tile", output: "$0.00041/tile" },
    limits: { maxSteps: 50, maxResolution: 1024 }
  },
  {
    id: "flux-2-klein-4b",
    name: "FLUX.2 [klein] 4B",
    provider: "Black Forest Labs",
    type: "text-to-image",
    description: "Ultra-fast distilled 4B model.",
    capabilities: { textToImage: true, imageToImage: true, multiReference: true },
    pricing: { input: "$0.000059/tile", output: "$0.000287/tile" },
    limits: { maxSteps: 50, maxResolution: 1024 }
  },
  {
    id: "flux-2-klein-9b",
    name: "FLUX.2 [klein] 9B",
    provider: "Black Forest Labs",
    type: "text-to-image",
    description: "Ultra-fast distilled 9B model.",
    capabilities: { textToImage: true, imageToImage: true, multiReference: true },
    pricing: { input: "$0.015/MP", output: "$0.002/MP" },
    limits: { maxSteps: 50, maxResolution: 1024 }
  },
  {
    id: "phoenix-1.0",
    name: "Phoenix 1.0",
    provider: "Leonardo.Ai",
    type: "text-to-image",
    description: "Superior prompt adherence.",
    capabilities: { textToImage: true },
    pricing: { unit: "$0.0058 per 512 tile" },
    limits: { maxSteps: 50, maxResolution: 1024 }
  },
  {
    id: "lucid-origin",
    name: "Lucid Origin",
    provider: "Leonardo.Ai",
    type: "text-to-image",
    description: "Highly adaptable image model.",
    capabilities: { textToImage: true },
    pricing: { unit: "$0.007 per 512 tile" },
    limits: { maxSteps: 50, maxResolution: 1024 }
  },
];

export const IMAGE_MODELS = AI_MODELS.filter(m => m.type === "text-to-image");
