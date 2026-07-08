import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    const media = await prisma.media.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { createdAt: "desc" },
    });

    // BigInt needs to be converted to string for JSON serialization
    const serializedMedia = media.map(m => ({
      ...m,
      sizeBytes: m.sizeBytes.toString(),
    }));

    return NextResponse.json(serializedMedia);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.tenantId || !body.name || !body.filename || !body.s3Key || !body.cdnUrl || !body.mediaTypeId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const media = await prisma.media.create({
      data: {
        tenantId: body.tenantId,
        name: body.name,
        filename: body.filename,
        s3Key: body.s3Key,
        cdnUrl: body.cdnUrl,
        sizeBytes: body.sizeBytes ? BigInt(body.sizeBytes) : BigInt(0),
        durationSec: body.durationSec || null,
        width: body.width || null,
        height: body.height || null,
        status: body.status || "PROCESSING",
        mediaTypeId: body.mediaTypeId,
      },
    });

    const serializedMedia = {
      ...media,
      sizeBytes: media.sizeBytes.toString(),
    };

    return NextResponse.json(serializedMedia, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
  }
}
