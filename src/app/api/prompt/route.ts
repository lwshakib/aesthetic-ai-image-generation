import { enhancePrompt } from "@/actions/ai-related-tasks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    // Input validation
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Prompt is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    const enhancedPrompt = await enhancePrompt(prompt);

    if (enhancedPrompt === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to enhance prompt. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Prompt Enhanced Successfully",
        data: enhancedPrompt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
