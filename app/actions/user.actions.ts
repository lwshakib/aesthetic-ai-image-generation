"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { DAILY_CREDIT_LIMIT } from "@/lib/constants";

/**
 * Fetches the current user's available credits and handles daily reset logic.
 * Users receive 4 credits every 24 hours (resetting at the start of a new calendar day).
 */
export async function getCredits() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, lastCreditReset: true },
  });

  if (!user) throw new Error("User not found");

  // Daily reset logic based on server time
  const now = new Date();
  const lastReset = new Date(user.lastCreditReset);
  
  const isDifferentDay = 
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear();

  if (isDifferentDay) {
    console.log(`[user.actions] Resetting credits for user ${session.user.id}`);
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: DAILY_CREDIT_LIMIT,
        lastCreditReset: now,
      },
      select: { credits: true },
    });
    return updatedUser.credits;
  }

  return user.credits;
}

/**
 * Updates the user's profile metadata (name, avatar URL).
 */
export async function updateProfile(data: { name?: string; image?: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  revalidatePath("/settings");
  revalidatePath("/image-generation");
}

/**
 * Lists all active browser/device sessions for the current user.
 */
export async function listUserSessions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.session.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Revokes a specific session (logs out a device).
 */
export async function revokeUserSession(sessionId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  await prisma.session.delete({
    where: { 
      id: sessionId,
      userId: session.user.id // Security check to ensure user owns the session
    },
  });

  revalidatePath("/settings");
}

/**
 * Lists all connected OAuth accounts (e.g., Google).
 */
export async function listConnectedAccounts() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.account.findMany({
    where: { userId: session.user.id },
  });
}
