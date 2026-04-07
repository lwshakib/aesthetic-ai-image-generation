import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || "auto",
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET_NAME!;
  }

  /**
   * Upload image data to R2
   */
  async uploadFile(buffer: Buffer, key: string, contentType: string) {
    console.log(`[S3Service] Uploading file: ${key}`);
    console.log(`[S3Service] Size: ${(buffer.length / 1024).toFixed(2)} KB, Type: ${contentType}`);
    
    if (buffer.length < 500) {
      console.warn(`[S3Service] Warning: Uploading a very small file (${buffer.length} bytes). This might be corrupted image data.`);
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.client.send(command);
    return key;
  }

  /**
   * Generate a pre-signed URL for a given path
   */
  async getSignedUrl(key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string) {
    console.log(`[S3Service] Deleting file: ${key}`);
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
    return true;
  }
}

export const s3Service = new S3Service();
