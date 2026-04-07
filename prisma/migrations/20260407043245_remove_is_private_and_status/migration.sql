/*
  Warnings:

  - You are about to drop the column `isPrivate` on the `generation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `generation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "generation" DROP COLUMN "isPrivate",
DROP COLUMN "status";
