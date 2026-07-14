import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromS3, getPresignedDownloadUrl } from "@/lib/s3";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // The bucket is private — sign a short-lived playback URL rather than
    // returning the raw S3 URL, which 403s in the browser.
    const cdnUrl = await getPresignedDownloadUrl(media.s3Key).catch(() => media.cdnUrl);

    const serializedMedia = {
      ...media,
      sizeBytes: media.sizeBytes.toString(),
      cdnUrl,
    };

    return NextResponse.json(serializedMedia);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const media = await prisma.media.update({
      where: { id },
      data: {
        name: body.name,
        status: body.status,
        // Allow updating other non-critical fields if passed
      },
    });

    const cdnUrl = await getPresignedDownloadUrl(media.s3Key).catch(() => media.cdnUrl);

    const serializedMedia = {
      ...media,
      sizeBytes: media.sizeBytes.toString(),
      cdnUrl,
    };

    return NextResponse.json(serializedMedia);
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json({ error: "Failed to update media" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // First find the media to get the S3 URL
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete the file from S3 using the CDN URL / S3 key
    await deleteFromS3(media.cdnUrl);

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
