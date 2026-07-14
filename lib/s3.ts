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
  contentType: string,
  bucketName?: string
): Promise<string> {
  const fileBuffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
  const bucket = bucketName || process.env.AWS_BUCKET!;

  const params = {
    Bucket: bucket,
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
    return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

export async function deleteFromS3(fileUrl: string, bucketName?: string): Promise<void> {
  if (!fileUrl) return;

  try {
    const region = process.env.AWS_REGION;
    let bucket = bucketName;
    let key = "";

    try {
      const url = new URL(fileUrl);
      const hostname = url.hostname;
      // standard format: <bucket>.s3.<region>.amazonaws.com or <bucket>.s3.amazonaws.com
      const s3Index = hostname.indexOf(".s3.");
      const s3IndexAlt = hostname.indexOf(".s3-");
      const s3IndexGlobal = hostname.indexOf(".s3.amazonaws.com");
      
      let foundIndex = -1;
      if (s3Index !== -1) foundIndex = s3Index;
      else if (s3IndexAlt !== -1) foundIndex = s3IndexAlt;
      else if (s3IndexGlobal !== -1) foundIndex = s3IndexGlobal;

      if (foundIndex !== -1) {
        if (!bucket) {
          bucket = hostname.substring(0, foundIndex);
        }
        key = decodeURIComponent(url.pathname.substring(1));
      } else {
        const defaultBucket = bucket || process.env.AWS_BUCKET!;
        const urlPattern = new RegExp(`^https://${defaultBucket}\\.s3\\.${region}\\.amazonaws\\.com/(.+)$`);
        const match = fileUrl.match(urlPattern);
        if (match) {
          if (!bucket) bucket = defaultBucket;
          key = decodeURIComponent(match[1]);
        }
      }
    } catch (e) {
      const defaultBucket = bucket || process.env.AWS_BUCKET!;
      const urlPattern = new RegExp(`^https://${defaultBucket}\\.s3\\.${region}\\.amazonaws\\.com/(.+)$`);
      const match = fileUrl.match(urlPattern);
      if (match) {
        if (!bucket) bucket = defaultBucket;
        key = decodeURIComponent(match[1]);
      }
    }

    if (!bucket || !key) {
      console.warn("Could not parse S3 URL for deletion:", fileUrl);
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3Client.send(command);
    console.log("Successfully deleted from S3:", key, "from bucket:", bucket);
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