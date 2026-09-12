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

interface RabbitMqConfig {
  enabled: boolean;
  queueName: string;
  url?: string;
  explicitSetting?: string;
}

/**
 * Read settings when a publish request arrives instead of freezing them at
 * module load. This is important for managed server runtimes where environment
 * variables are supplied to the request process after the bundle is built.
 * A configured URL enables RabbitMQ unless it is explicitly disabled.
 */
function getRabbitMqConfig(): RabbitMqConfig {
  const explicitSetting = process.env["RABBITMQ_ENABLED"]?.trim().toLowerCase();
  const url = process.env["RABBITMQ_URL"];

  return {
    enabled: Boolean(url) && explicitSetting !== "false",
    url,
    queueName: process.env["RABBITMQ_PLAYLIST_RENDER_QUEUE"] || "playlist.render.requested",
    explicitSetting,
  };
}

let connectionPromise: Promise<ChannelModel> | null = null;
let channelPromise: Promise<Channel> | null = null;

async function getConnection(config: RabbitMqConfig): Promise<ChannelModel> {
  if (!config.url) {
    throw new Error("RABBITMQ_URL is not configured");
  }

  if (!connectionPromise) {
    console.info("[PlaylistRenderQueue] Connecting to RabbitMQ", { queueName: config.queueName });
    connectionPromise = amqp.connect(config.url).then((connection) => {
      console.info("[PlaylistRenderQueue] RabbitMQ connection established", { queueName: config.queueName });
      return connection;
    }).catch((error) => {
      connectionPromise = null;
      console.error("[PlaylistRenderQueue] RabbitMQ connection failed", {
        queueName: config.queueName,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    });
  }

  return connectionPromise;
}

async function getChannel(config: RabbitMqConfig): Promise<Channel | null> {
  if (!config.enabled) return null;

  if (!channelPromise) {
    channelPromise = (async () => {
      const connection = await getConnection(config);
      const channel = await connection.createChannel();

      await channel.assertQueue(config.queueName, {
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
  const rabbitmq = getRabbitMqConfig();

  console.info("[PlaylistRenderQueue] Render enqueue requested", {
    playlistId,
    tenantId,
    rabbitmqEnabled: rabbitmq.enabled,
    rabbitmqUrlConfigured: Boolean(rabbitmq.url),
    rabbitmqExplicitSetting: rabbitmq.explicitSetting ?? "unset",
    queueName: rabbitmq.queueName,
  });

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

  console.info("[PlaylistRenderQueue] Render tracking record marked pending", {
    playlistId,
  });

  const channel = await getChannel(rabbitmq);
  if (!channel) {
    console.warn("[PlaylistRenderQueue] RabbitMQ is disabled; render job was not queued", {
      playlistId,
      rabbitmqUrlConfigured: Boolean(rabbitmq.url),
      rabbitmqExplicitSetting: rabbitmq.explicitSetting ?? "unset",
      queueName: rabbitmq.queueName,
    });
    return;
  }

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

  const accepted = channel.sendToQueue(rabbitmq.queueName, Buffer.from(JSON.stringify(job)), {
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
    throw new Error(`RabbitMQ did not accept job for queue ${rabbitmq.queueName}`);
  }

  console.info("[PlaylistRenderQueue] Render job queued", {
    playlistId,
    jobId: job.jobId,
    queueName: rabbitmq.queueName,
  });
}
