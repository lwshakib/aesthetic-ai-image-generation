import { S3Client, ListObjectsV2Command, DeleteObjectsCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";
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

async function teardown() {
  if (!bucketName) {
    console.error("AWS_S3_BUCKET_NAME is not defined in environment variables.");
    process.exit(1);
  }

  console.log(`Tearing down bucket: ${bucketName}...`);
  try {
    // 1. List all objects
    const list = await client.send(new ListObjectsV2Command({ Bucket: bucketName }));
    if (list.Contents && list.Contents.length > 0) {
      console.log(`Deleting ${list.Contents.length} objects...`);
      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: list.Contents.map((obj) => ({ Key: obj.Key })),
        },
      };
      await client.send(new DeleteObjectsCommand(deleteParams));
      console.log("Objects deleted.");
    }

    // 2. Delete bucket
    await client.send(new DeleteBucketCommand({ Bucket: bucketName }));
    console.log("Bucket deleted successfully.");
  } catch (error: unknown) {
    const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404) {
      console.log("Bucket does not exist.");
    } else {
      console.error("Error tearing down bucket:", error);
      process.exit(1);
    }
  }
}

teardown();
