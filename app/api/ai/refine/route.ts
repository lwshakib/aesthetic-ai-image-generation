import { aiService } from "@/services/ai.services";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const messages = [
      {
        role: "system",
        content: "You are an expert prompt engineer for AI image generation. Your task is to refine the user's prompt to be more descriptive, artistic, and detailed while maintaining the original intent. Output only the refined prompt text, no commentary.",
      },
      {
        role: "user",
        content: `Refine this prompt: ${prompt}`,
      },
    ];

    const refinedPrompt = await aiService.generateText(messages as any);

    return NextResponse.json({ refinedPrompt });
  } catch (error: any) {
    console.error("Refinement error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
