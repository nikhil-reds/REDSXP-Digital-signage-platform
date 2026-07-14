import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

// Helper to serialize BigInt fields in Media objects
const serializePlaylist = (playlist: any, bucketName: string, region: string) => {
  const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/playlists/${playlist.id}.json`;
  return {
    ...playlist,
    s3Url,
    playlistItems: playlist.playlistItems?.map((item: any) => ({
      ...item,
      media: item.media ? {
        ...item.media,
        sizeBytes: item.media.sizeBytes.toString(),
      } : null,
    })) || [],
  };
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const playlist = await prisma.playlist.findUnique({
      where: { id },
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

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const playlistBucket = process.env.AWS_BUCKET_PLAYLIST || "redsxp-playlist";
    const region = process.env.AWS_REGION || "ap-south-1";

    const serializedPlaylist = serializePlaylist(playlist, playlistBucket, region);

    return NextResponse.json(serializedPlaylist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!existingPlaylist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const playlistBucket = process.env.AWS_BUCKET_PLAYLIST || "redsxp-playlist";
    const region = process.env.AWS_REGION || "ap-south-1";

    await prisma.$transaction(async (tx) => {
      // 1. Update playlist details
      await tx.playlist.update({
        where: { id },
        data: {
          name: body.name !== undefined ? body.name : existingPlaylist.name,
          description: body.description !== undefined ? body.description : existingPlaylist.description,
        },
      });

      // 2. Re-create playlist items if provided
      if (body.items && Array.isArray(body.items)) {
        // Delete all existing items
        await tx.playlistItem.deleteMany({
          where: { playlistId: id },
        });

        // Insert new items
        for (const item of body.items) {
          await tx.playlistItem.create({
            data: {
              playlistId: id,
              mediaId: item.mediaId,
              position: item.position || 0,
              durationSec: item.durationSec || 10,
            },
          });
        }
      }
    });

    // Fetch the updated playlist with items and media
    const updatedPlaylist = await prisma.playlist.findUnique({
      where: { id },
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

    if (!updatedPlaylist) {
      throw new Error("Failed to retrieve updated playlist");
    }

    const serializedPlaylist = serializePlaylist(updatedPlaylist, playlistBucket, region);

    // Save/Overwrite in S3
    const s3Key = `playlists/${id}.json`;
    await uploadToS3(
      Buffer.from(JSON.stringify(serializedPlaylist, null, 2)),
      s3Key,
      "application/json",
      playlistBucket
    );

    return NextResponse.json(serializedPlaylist);
  } catch (error) {
    console.error("Error updating playlist:", error);
    return NextResponse.json({ error: "Failed to update playlist" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const playlist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const playlistBucket = process.env.AWS_BUCKET_PLAYLIST || "redsxp-playlist";
    const region = process.env.AWS_REGION || "ap-south-1";

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
