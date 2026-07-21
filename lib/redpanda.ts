import { Kafka, logLevel, type Producer } from "kafkajs";

type ScheduleEventAction = "created" | "updated";

interface ScheduleEventInput {
  action: ScheduleEventAction;
  schedule: {
    id: string;
    tenantId: string;
    playlistId: string;
    name: string;
    description?: string | null;
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

const redpandaEnabled = process.env.REDPANDA_ENABLED !== "false";
const brokers = (process.env.REDPANDA_BROKERS || "localhost:29092")
  .split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

const topic = process.env.REDPANDA_SCHEDULE_UPDATED_TOPIC || "schedule.updated";

let producerPromise: Promise<Producer> | null = null;

async function getProducer(): Promise<Producer | null> {
  if (!redpandaEnabled || brokers.length === 0) return null;

  if (!producerPromise) {
    const kafka = new Kafka({
      clientId: process.env.REDPANDA_CLIENT_ID || "rubenious-cms",
      brokers,
      connectionTimeout: Number(process.env.REDPANDA_CONNECTION_TIMEOUT_MS || 1000),
      requestTimeout: Number(process.env.REDPANDA_REQUEST_TIMEOUT_MS || 2000),
      retry: {
        initialRetryTime: 100,
        retries: Number(process.env.REDPANDA_RETRIES || 1),
      },
      logLevel: logLevel.NOTHING,
    });

    producerPromise = (async () => {
      const producer = kafka.producer();
      await producer.connect();
      return producer;
    })().catch((error) => {
      producerPromise = null;
      throw error;
    });
  }

  return producerPromise;
}

export async function emitScheduleUpdatedEvent({
  action,
  schedule,
}: ScheduleEventInput): Promise<void> {
  const producer = await getProducer();
  if (!producer) return;

  const occurredAt = new Date().toISOString();
  const payload = {
    eventId: crypto.randomUUID(),
    eventType: "schedule.updated",
    action,
    occurredAt,
    tenantId: schedule.tenantId,
    playlistId: schedule.playlistId,
    scheduleId: schedule.id,
    schedule: {
      id: schedule.id,
      tenantId: schedule.tenantId,
      playlistId: schedule.playlistId,
      name: schedule.name,
      description: schedule.description ?? null,
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

  await producer.send({
    topic,
    messages: [
      {
        key: schedule.playlistId,
        value: JSON.stringify(payload),
        headers: {
          eventType: "schedule.updated",
          action,
          tenantId: schedule.tenantId,
          playlistId: schedule.playlistId,
          scheduleId: schedule.id,
        },
      },
    ],
  });
}
