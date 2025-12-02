import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

// Initialize S3 Client with AWS credentials from environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function uploadToS3(file: Buffer, filename: string, contentType: string): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET_NAME
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set")
  }

  const key = `media/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "")}`

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      // Optional: Add ACL for public read access
      // ACL: 'public-read',
    })

    await s3Client.send(command)

    // Construct S3 URL (adjust based on your S3 configuration)
    const s3Url = `https://${bucket}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`
    return s3Url
  } catch (error) {
    console.error("S3 upload error:", error)
    throw new Error("Failed to upload file to S3")
  }
}

export async function deleteFromS3(s3Key: string): Promise<void> {
  const bucket = process.env.AWS_S3_BUCKET_NAME
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set")
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error("S3 delete error:", error)
    throw new Error("Failed to delete file from S3")
  }
}

export function getS3KeyFromUrl(url: string): string {
  // Extract key from S3 URL
  const match = url.match(/\.amazonaws\.com\/(.+)$/)
  return match ? match[1] : ""
}
