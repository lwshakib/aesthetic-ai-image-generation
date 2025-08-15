import { enhancePrompt } from "@/actions/ai-related-tasks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const enhancedPrompt = await enhancePrompt(prompt);

    if (enhancedPrompt === null) {
      return NextResponse.json({
        success: false,
        message: "Internal Server Error",
      });
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
