import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  file: File | Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const fileBuffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    // ACL: 'public-read', // Adjust based on your bucket policy
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    // Construct the URL manually or use a specific domain if configured (e.g. CloudFront)
    // Standard format: https://<bucket-name>.s3.<region>.amazonaws.com/<key>
    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  if (!fileUrl) return;

  try {
    const bucketName = process.env.AWS_BUCKET;
    const region = process.env.AWS_REGION;

    // Extract key from URL
    // URL format: https://<bucket>.s3.<region>.amazonaws.com/<key>
    const urlPattern = new RegExp(`^https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)$`);
    const match = fileUrl.match(urlPattern);

    if (!match) {
      console.warn("Could not parse S3 URL for deletion:", fileUrl);
      return;
    }

    const key = match[1];

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    console.log("Successfully deleted from S3:", key);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    // Don't throw here to avoid blocking DB updates if S3 fails, but log it
  }
}

export async function getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating presigned download URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
}

export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating presigned upload URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
}