"use server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import type { Image } from "@prisma/client";

// Validate environment variables
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

if (!process.env.NEBIUS_API_KEY) {
  throw new Error("NEBIUS_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

type ImageGenerationResult = 
  | Image
  | { code: number; message: string }
  | null;

export async function generateImageV1(
  prompt: string,
  negativePrompt: string = "",
  width: number,
  height: number,
  seed: number = -1,
  responseExt: string = "png",
  numInferenceSteps: number = 4
): Promise<ImageGenerationResult> {
  try {
    const user = await currentUser();

    if (!user) return null;

    const result = await checkImageGenerationEligibility(user);
    if (!result)
      return {
        code: 403,
        message:
          "You have no free Credits. Upgrade Plan To get Unlimited Image generation",
      };

    // Input validation
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new Error("Prompt must be a non-empty string.");
    }

    if (
      !width ||
      !height ||
      width < 64 ||
      height < 64 ||
      width > 2048 ||
      height > 2048
    ) {
      throw new Error("Invalid width or height. Must be between 64 and 2048.");
    }

    const validExts = ["png", "jpg"];
    if (!validExts.includes(responseExt)) {
      responseExt = "png"; // fallback
    }

    // Clamp values to acceptable ranges
    const safeWidth = clamp(width, 64, 2048);
    const safeHeight = clamp(height, 64, 2048);
    const safeSteps = clamp(numInferenceSteps, 1, 100);
    const safeSeed = seed < 0 ? Math.floor(Math.random() * 1000000) : seed;
    const response = await client.images.generate({
      model: "black-forest-labs/flux-schnell",
      response_format: "url",
      width: safeWidth,
      height: safeHeight,
      num_inference_steps: safeSteps,
      negative_prompt: negativePrompt || "",
      seed: safeSeed,
      prompt: prompt.trim(),
      // response_extension is not in the OpenAI types but is supported by Nebius API
      ...(responseExt && { response_extension: responseExt } as Record<string, string>),
    });

    // Assuming response format includes image URL(s)
    if (response?.data?.[0]?.url) {
      const newImage = await prisma.image.create({
        data: {
          clerkId: user.id,
          fileFormat: responseExt,
          imageUrl: response.data[0].url,
          width: safeWidth,
          height: safeHeight,
          prompt,
          negativePrompt,
          seed,
          inferenceSteps: numInferenceSteps,
        },
      });
      return newImage;
    } else {
      console.warn(
        "Image generation response was empty or malformed:",
        response
      );
      return null;
    }
  } catch (error) {
    console.error("Error during image generation:", error);
    if (error instanceof Error) {
      return { code: 500, message: error.message };
    }
    return {
      code: 500,
      message: "Unknown error occurred during image generation",
    };
  }
}

export async function enhancePrompt(prompt: string): Promise<string | null> {
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return null;
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an AI prompt enhancement agent specialized in optimizing textual prompts to achieve high-quality, photorealistic, or stylistically rich image generation outputs. Improve the given prompt by adding precise visual details, artistic elements, composition guidance, and descriptive adjectives. Your response must contain only the enhanced prompt as plain text, with no explanations or extra text.",
      },
    });

    const enhancedPrompt = result.text;

    return enhancedPrompt?.trim() || null;
  } catch (error) {
    console.error("Prompt enhancement failed:", error);
    return null;
  }
}

async function checkImageGenerationEligibility(user: { id: string }) {
  const { has } = await auth();
  const response = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!response) return false;

  if (response.credits > 0) {
    await prisma.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });
    return true;
  } else {
    const hasPremiumAccess = await has({ plan: "pro" });
    if (hasPremiumAccess) return true;
    return false;
  }
}
