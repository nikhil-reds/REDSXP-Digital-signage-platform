import type { Prisma } from "@/app/generated/prisma/client";

const SCREEN_NAME_PATTERN = /^Screen (\d{2,})$/;

/**
 * Devices land in the CMS before an agent has named them, so give each one a
 * stable "Screen 01" / "Screen 02" label scoped to the tenant. Numbering fills
 * the lowest free slot so deleting Screen 01 does not leave a permanent gap.
 */
export async function nextScreenName(
  tx: Prisma.TransactionClient,
  tenantId: string,
): Promise<string> {
  const devices = await tx.device.findMany({
    where: { tenantId, name: { startsWith: "Screen " } },
    select: { name: true },
  });

  const taken = new Set<number>();
  for (const device of devices) {
    const match = SCREEN_NAME_PATTERN.exec(device.name);
    if (match) taken.add(Number.parseInt(match[1], 10));
  }

  let next = 1;
  while (taken.has(next)) next += 1;

  return `Screen ${String(next).padStart(2, "0")}`;
}
