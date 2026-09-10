import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/rbac";
import { requirePermission } from "@/lib/session";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.PLAYLIST_READ);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const playlist = await prisma.playlist.findFirst({ where: { id, tenantId: auth.user.tenantId }, select: { id: true } });
    if (!playlist) return NextResponse.json({ error: "Playlist not found" }, { status: 404 });

    const render = await prisma.playerPlaylistRender.findUnique({
      where: { playlistId: playlist.id },
    });

    if (!render) {
      return NextResponse.json({
        playlistId: id,
        renderStatus: "not_started",
        renderError: null,
        renderAttempts: 0,
        outputPath: null,
        s3Url: null,
        durationSec: null,
        renderedAt: null,
        updatedAt: null,
      });
    }

    return NextResponse.json({
      playlistId: render.playlistId,
      renderStatus: render.renderStatus,
      renderError: render.renderError,
      renderAttempts: render.renderAttempts,
      outputPath: render.outputPath,
      s3Url: render.s3Url,
      durationSec: render.durationSec,
      renderedAt: render.renderedAt?.toISOString() ?? null,
      updatedAt: render.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching playlist render status:", error);
    return NextResponse.json({ error: "Failed to fetch playlist render status" }, { status: 500 });
  }
}
