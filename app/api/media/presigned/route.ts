import { NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Filename and contentType are required" }, { status: 400 });
    }

    // Generate a unique S3 key for this upload
    const timestamp = Date.now();
    const s3Key = `uploads/${timestamp}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;

    // Get the presigned URL
    const presignedUrl = await getPresignedUploadUrl(s3Key, contentType);
    
    // Construct the CDN URL (or just standard S3 URL if CDN not configured)
    const cdnUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return NextResponse.json({
      presignedUrl,
      s3Key,
      cdnUrl
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
  }
}
