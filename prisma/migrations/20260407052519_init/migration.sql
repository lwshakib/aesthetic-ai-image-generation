/*
  Warnings:

  - You are about to drop the column `images` on the `generation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "generation" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "image_generationId_idx" ON "image"("generationId");

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
