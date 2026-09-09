import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromS3, getPresignedDownloadUrl } from "@/lib/s3";
import { PERMISSIONS } from "@/lib/rbac";
import { requirePermission } from "@/lib/session";

function resolvePlayableUrl(media: { sourceType?: string | null; externalUrl?: string | null; s3Key: string; cdnUrl: string }) {
  if (media.sourceType === "external_url") return Promise.resolve(media.externalUrl ?? media.cdnUrl);
  return getPresignedDownloadUrl(media.s3Key).catch(() => media.cdnUrl);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.MEDIA_READ);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const media = await prisma.media.findUnique({
      where: { id, tenantId: auth.user.tenantId },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // The bucket is private — sign a short-lived playback URL rather than
    // returning the raw S3 URL, which 403s in the browser.
    const cdnUrl = await resolvePlayableUrl(media);

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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.MEDIA_UPDATE);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const existingMedia = await prisma.media.findFirst({ where: { id, tenantId: auth.user.tenantId } });
    if (!existingMedia) return NextResponse.json({ error: "Media not found" }, { status: 404 });

    const media = await prisma.media.update({
      where: { id: existingMedia.id },
      data: {
        name: body.name,
        status: body.status,
        // Allow updating other non-critical fields if passed
      },
    });

    const cdnUrl = await resolvePlayableUrl(media);

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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.MEDIA_DELETE);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    
    // First find the media to get the S3 URL
    const media = await prisma.media.findUnique({
      where: { id, tenantId: auth.user.tenantId },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // External HTML links have no uploaded object to remove.
    if (media.sourceType !== "external_url") {
      await deleteFromS3(media.cdnUrl);
    }

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
