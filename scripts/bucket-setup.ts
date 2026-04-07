import { S3Client, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
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

async function setup() {
  if (!bucketName) {
    console.error("AWS_S3_BUCKET_NAME is not defined in environment variables.");
    process.exit(1);
  }

  console.log(`Checking bucket: ${bucketName}...`);
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log("Bucket already exists.");
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      console.log("Bucket not found. Creating...");
      await client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log("Bucket created successfully.");
    } else {
      console.error("Error checking/creating bucket:", error);
      process.exit(1);
    }
  }
}

setup();
