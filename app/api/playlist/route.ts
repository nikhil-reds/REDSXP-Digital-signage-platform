import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";

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

const normalizeDisplayDimension = (value: unknown, fallback: number) => {
  const dimension = Number(value);
  return Number.isFinite(dimension) && dimension > 0 ? Math.round(dimension) : fallback;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    
    const playlists = await prisma.playlist.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: {
        playlistItems: {
          include: {
            media: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const playlistBucket = process.env.AWS_BUCKET_PLAYLIST || "redsxp-playlist";
    const region = process.env.AWS_REGION || "ap-south-1";

    const serializedPlaylists = playlists.map(p => serializePlaylist(p, playlistBucket, region));

    return NextResponse.json(serializedPlaylists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    let resolvedTenantId = body.tenantId;
    if (!resolvedTenantId) {
      let tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        tenant = await prisma.tenant.create({ 
          data: { name: "Default Tenant", slug: "default-tenant" } 
        });
      }
      resolvedTenantId = tenant.id;
    }

    if (!body.name) {
      return NextResponse.json({ error: "Playlist name is required" }, { status: 400 });
    }

    const playlistBucket = process.env.AWS_BUCKET_PLAYLIST || "redsxp-playlist";
    const region = process.env.AWS_REGION || "ap-south-1";

    const playlist = await prisma.$transaction(async (tx) => {
      const newPlaylist = await tx.playlist.create({
        data: {
          name: body.name,
          description: body.description || null,
          displayName: typeof body.displayName === "string" && body.displayName.trim() ? body.displayName.trim() : "Landscape 16:9",
          displayWidth: normalizeDisplayDimension(body.displayWidth, 1920),
          displayHeight: normalizeDisplayDimension(body.displayHeight, 1080),
          tenantId: resolvedTenantId,
        },
      });

      if (body.items && Array.isArray(body.items)) {
        for (const item of body.items) {
          await tx.playlistItem.create({
            data: {
              playlistId: newPlaylist.id,
              mediaId: item.mediaId,
              position: item.position || 0,
              durationSec: normalizePlaylistItemDuration(item.durationSec),
              fit: normalizePlaylistItemFit(item.fit),
              objectPosition: normalizePlaylistItemPosition(item.objectPosition),
            },
          });
        }
      }

      return newPlaylist;
    });

    // Fetch complete playlist to generate S3 payload
    const fullPlaylist = await prisma.playlist.findUnique({
      where: { id: playlist.id },
      include: {
        playlistItems: {
          include: {
            media: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!fullPlaylist) {
      throw new Error("Failed to retrieve created playlist");
    }

    const serializedPlaylist = serializePlaylist(fullPlaylist, playlistBucket, region);

    // Save to S3
    const s3Key = `playlists/${playlist.id}.json`;
    await uploadToS3(
      Buffer.from(JSON.stringify(serializedPlaylist, null, 2)),
      s3Key,
      "application/json",
      playlistBucket
    );

    return NextResponse.json(serializedPlaylist, { status: 201 });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}
