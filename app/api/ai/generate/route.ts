import { aiService } from "@/services/ai.services";
import { s3Service } from "@/services/s3.services";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getCredits } from "@/app/actions/user.actions";
import { DAILY_CREDIT_LIMIT } from "@/lib/constants";

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
      format,
      images
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const imageCount = Math.max(1, Math.min(DAILY_CREDIT_LIMIT, parseInt(count) || 1));

    // Credit Check
    const availableCredits = await getCredits();
    if (availableCredits < imageCount) {
      return NextResponse.json({ 
        error: `Insufficient credits. You have ${availableCredits} credit(s) remaining, but requested ${imageCount}. Credits reset daily.` 
      }, { status: 403 });
    }

    // 1. Generate Prompt Variations using GLM-4.7-Flash Structured Output
    const variationMessages = [
      {
        role: "system" as const,
        content: `You are an expert prompt engineer specialized in AI image generation. 
        Your goal is to take a base prompt and generate exactly ${imageCount} distinct variations.
        
        Guidelines for variations:
        1. Keep the core subject and intent of the original prompt the same.
        2. ${style && style !== 'none' ? `Adhere strictly to a ${style} aesthetic.` : "Vary the artistic style, camera angle, lighting condition, or atmospheric mood for each variation."}
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

    // 2. Create the Generation record first (before streaming)
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
        format: format || "png",
        userId: session.user.id,
      },
    });

    // Deduct Credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: imageCount } },
    });

    // 3. Setup Streaming Response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the primary generation ID so the frontend can associate results
          controller.enqueue(encoder.encode(JSON.stringify({ type: "generation_id", id: generation.id }) + "\n"));

          for (let i = 0; i < imageCount; i++) {
            const currentPrompt = variations[i];
            
            // Generate Image via AI Service
            const finalPrompt = style && style !== 'none' 
              ? `${currentPrompt}, in ${style} style` 
              : currentPrompt;

            const { buffer, format: detectedFormat } = await aiService.generateImage({
              prompt: negativePrompt ? `${finalPrompt} [Negative: ${negativePrompt}]` : finalPrompt,
              model: model || "flux-1-schnell",
              num_steps: numInferenceSteps || 25,
              width: width || 1024,
              height: height || 1024,
              format: format || "png",
              images: images,
            });

            // Upload buffer to S3
            const extension = detectedFormat === "jpeg" ? "jpg" : detectedFormat;
            const fileName = `generations/${session.user.id}/${nanoid()}.${extension}`;
            await s3Service.uploadFile(buffer, fileName, `image/${detectedFormat}`);

            // Save individual Image record to DB
            const imageRecord = await prisma.image.create({
              data: {
                path: fileName,
                prompt: currentPrompt,
                format: detectedFormat,
                generationId: generation.id,
              },
            });

            // Stream the image metadata back to the client immediately
            const imageDelta = {
              type: "image",
              image: {
                id: imageRecord.id,
                path: imageRecord.path,
                prompt: imageRecord.prompt,
              },
            };
            controller.enqueue(encoder.encode(JSON.stringify(imageDelta) + "\n"));
          }
          
          controller.close();
        } catch (error: any) {
          console.error("Streaming error:", error);
          controller.enqueue(encoder.encode(JSON.stringify({ type: "error", message: error.message }) + "\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
