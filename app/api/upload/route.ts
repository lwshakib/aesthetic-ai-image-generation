import { s3Service } from "@/services/s3.services";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

/**
 * Handles profile picture (avatar) uploads to S3/R2.
 * Images are stored under the 'avatars/{userId}/' prefix.
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer for S3 upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const fileName = `avatars/${session.user.id}/${nanoid()}.${extension}`;

    // Upload to S3/R2 via shared service
    await s3Service.uploadFile(buffer, fileName, file.type);

    // Return the relative path (key) which will be stored in the User model later
    return NextResponse.json({ url: fileName });
  } catch (error: unknown) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
