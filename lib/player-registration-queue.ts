import amqp, { type Channel, type ChannelModel } from "amqplib";

export interface PlayerInstalledJobInput {
  registrationId: string;
  installId: string;
  platform: "LINUX" | "WINDOWS";
  hostname?: string | null;
  osVersion?: string | null;
  appVersion?: string | null;
  ipAddress?: string | null;
}

const rabbitmqEnabled = process.env.RABBITMQ_ENABLED !== "false";
const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const queueName = process.env.RABBITMQ_PLAYER_REGISTRATION_QUEUE || "player.registration.installed";

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
        arguments: { "x-queue-type": "classic" },
      });

      return channel;
    })().catch((error) => {
      channelPromise = null;
      throw error;
    });
  }

  return channelPromise;
}

export async function enqueuePlayerInstalledJob(jobInput: PlayerInstalledJobInput): Promise<void> {
  const channel = await getChannel();
  if (!channel) return;

  const requestedAt = new Date().toISOString();
  const job = {
    jobId: crypto.randomUUID(),
    type: "player.registration.installed",
    requestedAt,
    idempotencyKey: `player.registration.installed:${jobInput.registrationId}:${jobInput.installId}`,
    ...jobInput,
  };

  const accepted = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(job)), {
    persistent: true,
    contentType: "application/json",
    messageId: job.jobId,
    type: job.type,
    timestamp: Math.floor(Date.now() / 1000),
    headers: {
      registrationId: jobInput.registrationId,
      installId: jobInput.installId,
      platform: jobInput.platform,
      idempotencyKey: job.idempotencyKey,
    },
  });

  if (!accepted) {
    throw new Error(`RabbitMQ did not accept job for queue ${queueName}`);
  }
}
