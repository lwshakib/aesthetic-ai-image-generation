import { s3Service } from "@/services/s3.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "No key provided" }, { status: 400 });
  }

  try {
    const url = await s3Service.getSignedUrl(key);
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Signed URL error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
