import { enqueueSensorPublishJob } from "@/lib/sensor-publish-queue";
import { savePlaylistGraph } from "@/lib/playlist-graph-save";
import { parseFlow, serializeFlow, playlistDetailInclude, PlaylistPayloadError } from "@/lib/playlist-flow";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";
import { enqueuePlaylistRenderJob } from "@/lib/playlist-render-queue";
import { PERMISSIONS } from "@/lib/rbac";
import { requirePermission } from "@/lib/session";

type SerializableMedia = Record<string, unknown> & {
  sizeBytes: bigint | number | string;
};

type SerializablePlaylistItem = Record<string, unknown> & {
  media?: SerializableMedia | null;
};

type SerializablePlaylist = Record<string, unknown> & {
  id: string;
  playlistItems?: SerializablePlaylistItem[];
};

// Helper to serialize BigInt fields in Media objects
const serializePlaylist = (playlist: SerializablePlaylist, bucketName: string, region: string) => {
  const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/playlists/${playlist.id}.json`;
  return {
    ...playlist,
    s3Url,
    flow: "flowNodes" in playlist && "flowEdges" in playlist ? serializeFlow(playlist as unknown as Parameters<typeof serializeFlow>[0]) : undefined,
    playlistItems: playlist.playlistItems?.map((item) => ({
      ...item,
      media: item.media ? {
        ...item.media,
        sizeBytes: item.media.sizeBytes.toString(),
      } : null,
    })) || [],
  };
};

const normalizePlaylistItemDuration = (durationSec: unknown) => {
  const duration = Number(durationSec);
  return Number.isFinite(duration) && duration > 0 ? Math.ceil(duration) : 10;
};

const normalizePlaylistItemFit = (fit: unknown) => {
  return ["cover", "contain", "fill", "none", "scale-down"].includes(String(fit)) ? String(fit) : "scale-down";
};

const normalizePlaylistItemPosition = (position: unknown) => {
  return ["center", "top", "bottom", "left", "right"].includes(String(position)) ? String(position) : "center";
};

const normalizePlaylistItemZone = (zoneId: unknown) => {
  return typeof zoneId === "string" && zoneId.trim() ? zoneId.trim() : "full-screen";
};

const normalizeDisplayDimension = (value: unknown, fallback: number) => {
  const dimension = Number(value);
  return Number.isFinite(dimension) && dimension > 0 ? Math.round(dimension) : fallback;
};

const normalizeLayoutMode = (value: unknown, fallback: string) => {
  if (value === "custom-grid") return "custom-grid";
  if (value === "zone") return "zone";
  return fallback;
};

const normalizeGridSize = (value: unknown, fallback: number) => {
  const size = Number(value);
  return Number.isFinite(size) ? Math.max(1, Math.min(6, Math.round(size))) : fallback;
};

const calculatePlaylistDuration = (items: Array<{ durationSec?: unknown; zoneId?: unknown }>) => {
  const totals = new Map<string, number>();
  for (const item of items) {
    const zoneId = normalizePlaylistItemZone(item.zoneId);
    totals.set(zoneId, (totals.get(zoneId) || 0) + normalizePlaylistItemDuration(item.durationSec));
  }
  return Math.max(0, ...Array.from(totals.values()));
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.PLAYLIST_READ);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const playlist = await prisma.playlist.findUnique({
      where: { id, tenantId: auth.user.tenantId },
      include: playlistDetailInclude,
    });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const playlistBucket = process.env.PLAYLIST_BUCKET_NAME || process.env.AWS_BUCKET_PLAYLIST || "redsxp-playlist";
    const region = process.env.AWS_REGION || process.env.REGION_NAME || "ap-south-1";

    const serializedPlaylist = serializePlaylist(playlist, playlistBucket, region);

    return NextResponse.json(serializedPlaylist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.PLAYLIST_UPDATE);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const flow = parseFlow(body.flow, body.items || [], body.publish === true);
    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id, tenantId: auth.user.tenantId },
    });

    if (!existingPlaylist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const revision = request.headers.get("if-match");
    if (revision && revision !== existingPlaylist.updatedAt.toISOString()) return NextResponse.json({ error: "Playlist changed in another editor. Reload before saving." }, { status: 409 });
    const playlistBucket = process.env.PLAYLIST_BUCKET_NAME || process.env.AWS_BUCKET_PLAYLIST || "redsxp-playlist";
    const region = process.env.AWS_REGION || process.env.REGION_NAME || "ap-south-1";

    await prisma.$transaction(async (tx) => {
      // 1. Update playlist details
      await tx.playlist.update({
        where: { id },
        data: {
          name: body.name !== undefined ? body.name : existingPlaylist.name,
          description: body.description !== undefined ? body.description : existingPlaylist.description,
          displayName:
            typeof body.displayName === "string" && body.displayName.trim()
              ? body.displayName.trim()
              : existingPlaylist.displayName,
          displayWidth: body.displayWidth !== undefined
            ? normalizeDisplayDimension(body.displayWidth, existingPlaylist.displayWidth)
            : existingPlaylist.displayWidth,
          displayHeight: body.displayHeight !== undefined
            ? normalizeDisplayDimension(body.displayHeight, existingPlaylist.displayHeight)
            : existingPlaylist.displayHeight,
          layoutMode: normalizeLayoutMode(body.layoutMode, existingPlaylist.layoutMode),
          gridRows: body.gridRows !== undefined ? normalizeGridSize(body.gridRows, existingPlaylist.gridRows) : existingPlaylist.gridRows,
          gridColumns:
            body.gridColumns !== undefined ? normalizeGridSize(body.gridColumns, existingPlaylist.gridColumns) : existingPlaylist.gridColumns,
          zonesJson: Array.isArray(body.zones) ? body.zones : existingPlaylist.zonesJson,
        },
      });

      await savePlaylistGraph(tx, id, auth.user.tenantId, body.items, flow);
    });

    // Fetch the updated playlist with items and media
    const updatedPlaylist = await prisma.playlist.findUnique({
      where: { id, tenantId: auth.user.tenantId },
      include: playlistDetailInclude,
    });

    if (!updatedPlaylist) {
      throw new Error("Failed to retrieve updated playlist");
    }

    const serializedPlaylist = serializePlaylist(updatedPlaylist, playlistBucket, region);

    if (body.publish === true && serializedPlaylist.flow?.sensors.length) {
      try {
        const publishJobId = await enqueueSensorPublishJob(updatedPlaylist);
        return NextResponse.json({ ...serializedPlaylist, publishState: "queued", publishJobId }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ ...serializedPlaylist, publishState: "queue_failed",
          publishError: error instanceof Error ? error.message : "Sensor publication could not be queued." }, { status: 200 });
      }
    }

    // Save/Overwrite in S3
    const s3Key = `playlists/${id}.json`;
    try {
    await uploadToS3(
      Buffer.from(JSON.stringify(serializedPlaylist, null, 2)),
      s3Key,
      "application/json",
      playlistBucket
    );
    } catch {
      return NextResponse.json({ ...serializedPlaylist, publishState: "sync_failed", publishError: "Playlist saved, but S3 sync failed. Retry saving to sync it." }, { status: 200 });
    }

    if (body.publish === true) {
      console.info("[Playlist API] Publish requested", {
        playlistId: updatedPlaylist.id,
        tenantId: updatedPlaylist.tenantId,
      });
      await enqueuePlaylistRenderJob({
        playlistId: updatedPlaylist.id,
        tenantId: updatedPlaylist.tenantId,
        displayWidth: updatedPlaylist.displayWidth,
        displayHeight: updatedPlaylist.displayHeight,
        durationSec: calculatePlaylistDuration(body.items || updatedPlaylist.playlistItems),
        sourceHash: updatedPlaylist.updatedAt.getTime().toString(),
      });
      console.info("[Playlist API] Publish processing completed", {
        playlistId: updatedPlaylist.id,
      });
    }

    return NextResponse.json(serializedPlaylist);
  } catch (error) {
    if (error instanceof PlaylistPayloadError) return NextResponse.json({ error: error.message, fields: error.fields }, { status: error.status });
    console.error("Error updating playlist:", error);
    return NextResponse.json({ error: "Failed to update playlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(request, PERMISSIONS.PLAYLIST_DELETE);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    const playlist = await prisma.playlist.findUnique({
      where: { id, tenantId: auth.user.tenantId },
    });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const playlistBucket = process.env.PLAYLIST_BUCKET_NAME || process.env.AWS_BUCKET_PLAYLIST || "redsxp-playlist";
    const region = process.env.AWS_REGION || process.env.REGION_NAME || "ap-south-1";

    // Delete the serialized JSON from S3
    const s3Url = `https://${playlistBucket}.s3.${region}.amazonaws.com/playlists/${id}.json`;
    await deleteFromS3(s3Url, playlistBucket);

    // Delete from Database (playlist items will cascade delete)
    await prisma.playlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json({ error: "Failed to delete playlist" }, { status: 500 });
  }
}

