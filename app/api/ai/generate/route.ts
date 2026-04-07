import { aiService } from "@/lib/services/ai.services";
import { s3Service } from "@/lib/services/s3.services";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      prompt, 
      model, 
      negativePrompt, 
      numInferenceSteps, 
      width,
      height, 
      count,
      style,
      format
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const imageCount = parseInt(count) || 4;
    const results: { path: string, prompt: string, format: string }[] = [];

    // 1. Generate Prompt Variations using GLM-4.7-Flash Structured Output
    const variationMessages = [
      {
        role: "system" as const,
        content: `You are an expert prompt engineer specialized in AI image generation. 
        Your goal is to take a base prompt and generate exactly ${imageCount} distinct variations.
        
        Guidelines for variations:
        1. Keep the core subject and intent of the original prompt the same.
        2. Vary the artistic style, camera angle, lighting condition, or atmospheric mood for each variation.
        3. Use descriptive, evocative language suitable for high-end image generation models like FLUX.
        4. Do NOT include any conversational filler or meta-commentary.
        
        Output Structure:
        You must return a JSON object containing an array of strings named "variations".`,
      },
      {
        role: "user" as const,
        content: `Base prompt: ${prompt}`,
      },
    ];

    const variationSchema = {
      type: "object",
      properties: {
        variations: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["variations"],
      additionalProperties: false
    };

    let variations: string[] = [];
    try {
      const gmlResponse = await aiService.generateObject<{ variations: string[] }>(
        variationMessages, 
        variationSchema
      );
      variations = gmlResponse.variations;
    } catch (e) {
      console.error("Failed to generate structured variations, falling back to original prompt:", e);
      variations = Array(imageCount).fill(prompt);
    }

    // Ensure we have enough variations
    if (variations.length < imageCount) {
      variations = [...variations, ...Array(imageCount - variations.length).fill(prompt)];
    }

    // 2. Generate Images and Upload to S3
    for (let i = 0; i < imageCount; i++) {
      const currentPrompt = variations[i];
      const { buffer, format: detectedFormat } = await aiService.generateImage({
        prompt: negativePrompt ? `${currentPrompt} [Negative: ${negativePrompt}]` : currentPrompt,
        model: model || "flux-1-schnell",
        num_steps: numInferenceSteps || 25,
        width: width || 1024,
        height: height || 1024,
        format: format || "png",
      });

      const extension = detectedFormat === "jpeg" ? "jpg" : detectedFormat;
      const fileName = `generations/${session.user.id}/${nanoid()}.${extension}`;
      await s3Service.uploadFile(buffer, fileName, `image/${detectedFormat}`);
      results.push({ path: fileName, prompt: currentPrompt, format: detectedFormat });
    }

    // 3. Save to database
    const generation = await prisma.generation.create({
      data: {
        prompt,
        negativePrompt,
        numInferenceSteps: numInferenceSteps || 25,
        model: model || "unknown",
        style: style || "none",
        width: width || 1024,
        height: height || 1024,
        count: imageCount,
        format: results[0]?.format || "png",
        userId: session.user.id,
        images: {
          create: results.map((r) => ({
            path: r.path,
            prompt: r.prompt,
            format: r.format,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ 
      id: generation.id, 
      images: generation.images 
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
