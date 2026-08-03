import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const render = await prisma.playerPlaylistRender.findUnique({
      where: { playlistId: id },
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
