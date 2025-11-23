import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.image.findMany({
      include: {
        user: {
          select: {
            imageUrl: true,
            name: true,
            id: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  }
}
