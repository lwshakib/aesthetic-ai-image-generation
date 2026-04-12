import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const client = new S3Client({
  region: process.env.AWS_REGION || "auto",
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME!;

async function applyBucketCors() {
  console.log("Applying CORS (AllowedOrigins: *)...");
  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
            AllowedOrigins: ["*"],
            ExposeHeaders: ["ETag", "Content-Length", "Content-Type", "x-amz-version-id"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  );
  console.log("CORS configuration applied.");
}

async function setup() {
  if (!bucketName) {
    console.error("AWS_S3_BUCKET_NAME is not defined in environment variables.");
    process.exit(1);
  }

  console.log(`Checking bucket: ${bucketName}...`);
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log("Bucket already exists.");
  } catch (error: unknown) {
    const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404) {
      console.log("Bucket not found. Creating...");
      await client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log("Bucket created successfully.");
    } else {
      console.error("Error checking/creating bucket:", error);
      process.exit(1);
    }
  }

  try {
    await applyBucketCors();
  } catch (error: unknown) {
    console.error("Error applying CORS configuration:", error);
    process.exit(1);
  }
}

setup();
