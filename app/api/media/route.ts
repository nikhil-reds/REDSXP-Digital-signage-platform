import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPresignedDownloadUrl } from "@/lib/s3";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    const media = await prisma.media.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { mediaType: true },
      orderBy: { createdAt: "desc" },
    });

    // Format for UI consumption
    const serializedMedia = await Promise.all(
      media.map(async (m) => {
        let type = "Image";
        if (m.mediaType?.name === "video") type = "Video";
        if (m.mediaType?.name === "html") type = "HTML5";

        // The bucket is private — sign a short-lived playback URL rather than
        // returning the raw S3 URL, which 403s in the browser.
        const cdnUrl = await getPresignedDownloadUrl(m.s3Key).catch(() => m.cdnUrl);

        return {
          ...m,
          sizeBytes: m.sizeBytes.toString(),
          cdnUrl,
          type,
          size: (Number(m.sizeBytes) / (1024 * 1024)).toFixed(1) + " MB",
          dimensions: m.width && m.height ? `${m.width}x${m.height}` : "1920x1080",
          duration: m.durationSec ? `${m.durationSec}s` : undefined,
          uploader: "Admin",
          date: m.createdAt.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }),
          usedInPlaylists: [],
          status: m.status === "READY" ? "Ready" : m.status === "PROCESSING" ? "Transcoding" : "Failed"
        };
      })
    );

    return NextResponse.json(serializedMedia);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, tenantId comes from session. For now, fallback to the first tenant or create one.
    let resolvedTenantId = body.tenantId;
    if (!resolvedTenantId) {
      let tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        tenant = await prisma.tenant.create({ data: { name: "Default Tenant", slug: "default-tenant" } });
      }
      resolvedTenantId = tenant.id;
    }

    if (!body.name || !body.filename || !body.s3Key || !body.cdnUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Resolve MediaType
    let typeName = body.type ? body.type.toLowerCase() : "image"; // Default to image
    if (typeName === "html5") typeName = "html"; // Map HTML5 to html
    
    let mediaType = await prisma.mediaType.findFirst({ where: { name: typeName } });
    if (!mediaType) {
      mediaType = await prisma.mediaType.create({ data: { name: typeName } });
    }

    const media = await prisma.media.create({
      data: {
        tenantId: resolvedTenantId,
        name: body.name,
        filename: body.filename,
        s3Key: body.s3Key,
        cdnUrl: body.cdnUrl,
        sizeBytes: body.sizeBytes ? BigInt(body.sizeBytes) : BigInt(0),
        durationSec: body.durationSec || null,
        width: body.width || null,
        height: body.height || null,
        status: body.status || "READY",
        mediaTypeId: mediaType.id,
      },
    });

    const cdnUrl = await getPresignedDownloadUrl(media.s3Key).catch(() => media.cdnUrl);

    const serializedMedia = {
      ...media,
      sizeBytes: media.sizeBytes.toString(),
      cdnUrl,
      // Add mock relations for the UI
      type: body.type || "Image",
      uploader: "Current User", // Mock uploader
      date: new Date().toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })
    };

    return NextResponse.json(serializedMedia, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
  }
}
