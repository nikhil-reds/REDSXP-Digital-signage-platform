import amqp, { type Channel, type ChannelModel } from "amqplib";

type ScheduleEvaluateReason = "schedule.created" | "schedule.updated";

interface ScheduleEvaluateJobInput {
  reason: ScheduleEvaluateReason;
  schedule: {
    id: string;
    tenantId: string;
    playlistId: string;
    name: string;
    startTime: Date;
    endTime: Date;
    daysOfWeek: number[];
    priority: number;
    status: string;
    updatedAt?: Date;
    createdAt?: Date;
    devices?: Array<{ id: string }>;
  };
}

const rabbitmqEnabled = process.env.RABBITMQ_ENABLED !== "false";
const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const queueName = process.env.RABBITMQ_SCHEDULER_EVALUATE_QUEUE || "scheduler.evaluate.now";

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

export async function enqueueScheduleEvaluateNowJob({
  reason,
  schedule,
}: ScheduleEvaluateJobInput): Promise<void> {
  const channel = await getChannel();
  if (!channel) return;

  const requestedAt = new Date().toISOString();
  const job = {
    jobId: crypto.randomUUID(),
    type: "scheduler.evaluate.now",
    reason,
    requestedAt,
    idempotencyKey: `scheduler.evaluate.now:${schedule.id}:${schedule.updatedAt?.getTime() ?? requestedAt}`,
    tenantId: schedule.tenantId,
    playlistId: schedule.playlistId,
    scheduleId: schedule.id,
    schedule: {
      id: schedule.id,
      tenantId: schedule.tenantId,
      playlistId: schedule.playlistId,
      name: schedule.name,
      startTime: schedule.startTime.toISOString(),
      endTime: schedule.endTime.toISOString(),
      daysOfWeek: schedule.daysOfWeek,
      priority: schedule.priority,
      status: schedule.status,
      deviceIds: schedule.devices?.map((device) => device.id) ?? [],
      createdAt: schedule.createdAt?.toISOString(),
      updatedAt: schedule.updatedAt?.toISOString(),
    },
  };

  const accepted = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(job)), {
    persistent: true,
    contentType: "application/json",
    messageId: job.jobId,
    type: job.type,
    timestamp: Math.floor(Date.now() / 1000),
    headers: {
      reason,
      tenantId: schedule.tenantId,
      playlistId: schedule.playlistId,
      scheduleId: schedule.id,
      idempotencyKey: job.idempotencyKey,
    },
  });

  if (!accepted) {
    throw new Error(`RabbitMQ did not accept job for queue ${queueName}`);
  }
}
