-- AlterTable
ALTER TABLE "generation" ADD COLUMN     "negativePrompt" TEXT,
ADD COLUMN     "numInferenceSteps" INTEGER NOT NULL DEFAULT 25;
