-- AlterTable
ALTER TABLE "generation" ADD COLUMN     "format" TEXT NOT NULL DEFAULT 'png';

-- AlterTable
ALTER TABLE "image" ADD COLUMN     "format" TEXT NOT NULL DEFAULT 'png';
