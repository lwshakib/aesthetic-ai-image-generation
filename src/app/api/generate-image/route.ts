import { generateImageV1 } from "@/actions/ai-related-tasks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      negativePrompt = "",
      width,
      height,
      seed = -1,
      responseExt = "png",
      numInferenceSteps = 4,
    } = body;

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

    if (
      typeof width !== "number" ||
      typeof height !== "number" ||
      width < 64 ||
      height < 64 ||
      width > 2048 ||
      height > 2048
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Width and height must be numbers between 64 and 2048",
        },
        { status: 400 }
      );
    }

    const newImage = await generateImageV1(
      prompt,
      negativePrompt,
      width,
      height,
      seed,
      responseExt,
      numInferenceSteps
    );

    if (newImage?.code === 403) {
      return NextResponse.json(
        {
          success: false,
          message: "Upgrade Plan To get Unlimited Image generation",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image generated successfully",
        data: newImage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Image generation error:", error);
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
