import amqp, { type Channel, type ChannelModel } from "amqplib";
import { prisma } from "@/lib/prisma";

interface PlaylistRenderJobInput {
  playlistId: string;
  tenantId: string;
  displayWidth: number;
  displayHeight: number;
  durationSec: number;
  sourceHash?: string | null;
}

const rabbitmqEnabled = process.env.RABBITMQ_ENABLED !== "false";
const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const queueName = process.env.RABBITMQ_PLAYLIST_RENDER_QUEUE || "playlist.render.requested";

let connectionPromise: Promise<ChannelModel> | null = null;
let channelPromise: Promise<Channel> | null = null;

async function getConnection(): Promise<ChannelModel> {
  if (!connectionPromise) {
    connectionPromise = amqp.connect(rabbitmqUrl).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
}

async function getChannel(): Promise<Channel | null> {
  if (!rabbitmqEnabled) return null;

  if (!channelPromise) {
    channelPromise = (async () => {
      const connection = await getConnection();
      const channel = await connection.createChannel();

      await channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          "x-queue-type": "classic",
        },
      });

      return channel;
    })().catch((error) => {
      channelPromise = null;
      throw error;
    });
  }

  return channelPromise;
}

export async function enqueuePlaylistRenderJob({
  playlistId,
  tenantId,
  displayWidth,
  displayHeight,
  durationSec,
  sourceHash,
}: PlaylistRenderJobInput): Promise<void> {
  await prisma.playerPlaylistRender.upsert({
    where: { playlistId },
    create: {
      playlistId,
      sourceHash,
      renderStatus: "pending",
      renderError: null,
      renderAttempts: 0,
      outputPath: null,
      durationSec,
      renderedAt: null,
      s3Key: null,
      s3Url: null,
    },
    update: {
      sourceHash,
      renderStatus: "pending",
      renderError: null,
      renderAttempts: { increment: 1 },
      durationSec,
      renderedAt: null,
    },
  });

  const channel = await getChannel();
  if (!channel) return;

  const requestedAt = new Date().toISOString();
  const job = {
    jobId: crypto.randomUUID(),
    type: "playlist.render.requested",
    requestedAt,
    idempotencyKey: `playlist.render.requested:${playlistId}:${sourceHash ?? requestedAt}`,
    playlistId,
    tenantId,
    renderVersion: sourceHash ?? requestedAt,
    output: {
      width: displayWidth,
      height: displayHeight,
      fps: 30,
      format: "mp4",
      durationSec,
    },
  };

  const accepted = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(job)), {
    persistent: true,
    contentType: "application/json",
    messageId: job.jobId,
    type: job.type,
    timestamp: Math.floor(Date.now() / 1000),
    headers: {
      tenantId,
      playlistId,
      idempotencyKey: job.idempotencyKey,
    },
  });

  if (!accepted) {
    throw new Error(`RabbitMQ did not accept job for queue ${queueName}`);
  }
}
