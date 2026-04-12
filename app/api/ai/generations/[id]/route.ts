import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { s3Service } from "@/services/s3.services";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // 1. Verify ownership and get image paths
    const generation = await prisma.generation.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!generation || generation.userId !== session.user.id) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    // 2. Delete images from S3
    for (const image of generation.images) {
      try {
        await s3Service.deleteFile(image.path);
      } catch (s3Error) {
        console.error(`Failed to delete S3 file: ${image.path}`, s3Error);
        // Continue deleting others even if one fails
      }
    }

    // 3. Delete from DB
    await prisma.generation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Delete generation error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
