import amqp from "amqplib";

export async function enqueueSensorPublishJob(playlist: { id: string; tenantId: string; updatedAt: Date }) {
  if (process.env.SENSOR_MANIFEST_V4_ENABLED !== "true") throw new Error("Sensor publishing is disabled on the CMS.");
  if (process.env.RABBITMQ_ENABLED === "false") throw new Error("Sensor publishing requires the scheduler queue.");
  const job = {
    jobId: crypto.randomUUID(), type: "scheduler.evaluate.now", reason: "playlist.sensor.publish",
    tenantId: playlist.tenantId, playlistId: playlist.id,
    requestedAt: new Date().toISOString(),
    idempotencyKey: `playlist.sensor.publish:${playlist.id}:${playlist.updatedAt.getTime()}`,
  };
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672", { timeout: 5000 });
  try {
    const channel = await connection.createConfirmChannel();
    const queue = process.env.RABBITMQ_SCHEDULER_EVALUATE_QUEUE || "scheduler.evaluate.now";
    await channel.assertQueue(queue, { durable: true, arguments: { "x-queue-type": "classic" } });
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Scheduler queue confirmation timed out.")), 10000);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(job)), {
        persistent: true, contentType: "application/json", messageId: job.jobId, type: job.type,
      }, (error: unknown) => { clearTimeout(timeout); if (error) reject(error); else resolve(); });
    });
    return job.jobId;
  } finally { await connection.close(); }
}
