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
    // 1. Verify ownership and get image path
    const image = await prisma.image.findUnique({
      where: { id },
      include: { generation: true },
    });

    if (!image || image.generation.userId !== session.user.id) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // 2. Delete from S3
    try {
      await s3Service.deleteFile(image.path);
    } catch (s3Error) {
      console.error(`Failed to delete S3 file: ${image.path}`, s3Error);
    }

    // 3. Delete from DB
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
