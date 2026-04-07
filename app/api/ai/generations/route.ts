import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/ai/generations
 * Fetches common generations for the current user with cursor-based pagination.
 */
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "3");

    // Fetch generations with images, ordered by most recent
    const generations = await prisma.generation.findMany({
      where: {
        userId: session.user.id,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: {
          orderBy: {
            createdAt: "asc", 
          },
        },
      },
    });

    // Provide the next cursor for the frontend
    const nextCursor = generations.length === limit ? generations[generations.length - 1].id : null;

    return NextResponse.json({
      generations,
      nextCursor,
    });
  } catch (error) {
    console.error("Failed to fetch generations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
