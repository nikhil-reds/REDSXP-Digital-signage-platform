import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { requirePermission } from "@/lib/session";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.PLAYLIST_READ);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const playlist = await prisma.playlist.findUnique({
      where: { id, tenantId: auth.user.tenantId },
      include: {
        playlistItems: {
          include: { media: { include: { mediaType: true } } },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    return NextResponse.json({
      playlistId: playlist.id,
      tenantId: playlist.tenantId,
      name: playlist.name,
      display: {
        name: playlist.displayName,
        width: playlist.displayWidth,
        height: playlist.displayHeight,
      },
      layout: {
        mode: playlist.layoutMode,
        gridRows: playlist.gridRows,
        gridColumns: playlist.gridColumns,
        zones: playlist.zonesJson ?? [],
      },
      items: playlist.playlistItems.map((item) => ({
        id: item.id,
        mediaId: item.mediaId,
        position: item.position,
        durationSec: item.durationSec,
        fit: item.fit,
        objectPosition: item.objectPosition,
        zoneId: item.zoneId,
        media: {
          name: item.media.name,
          width: item.media.width,
          height: item.media.height,
          durationSec: item.media.durationSec,
          cdnUrl: item.media.cdnUrl,
          s3Key: item.media.s3Key,
          sourceType: item.media.sourceType,
          externalUrl: item.media.externalUrl,
          type: item.media.mediaType?.name ?? "image",
        },
      })),
    });
  } catch (error) {
    console.error("Error building playlist render manifest:", error);
    return NextResponse.json({ error: "Failed to build playlist render manifest" }, { status: 500 });
  }
}
