import type { Prisma } from '@/app/generated/prisma/client';

export type FlowInput = {
  sensors: Array<{ id?: string; clientId: string; name: string; connectionType: 'gpio'; port: string; serialPort?: string; operator: 'equals'; expectedValue: boolean; triggerKind: 'legacy-button' | 'serial-message'; message?: string; enabled: boolean; x: number; y: number }>;
  connections: Array<{ id?: string; clientId: string; sourceSensorClientId: string; targetItemClientId: string; cooldownMs: number; debounceMs: number; enabled: boolean }>;
};
export class PlaylistPayloadError extends Error {
  constructor(public fields: Record<string, string>, public status = 400) { super(Object.values(fields)[0] || 'Invalid playlist'); }
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const unique = (values: string[]) => new Set(values).size === values.length;
const validMessage = (value: unknown): value is string => typeof value === 'string' && value === value.trim() && /^[\x20-\x7E]{1,128}$/.test(value);
export function parseFlow(value: unknown, items: Array<{ id?: string; clientId?: string; mediaId: string }>, publish: boolean): FlowInput | undefined {
  if (value === undefined) return undefined;
  if (!object(value) || !Array.isArray(value.sensors) || !Array.isArray(value.connections)) throw new PlaylistPayloadError({ flow: 'Expected sensors and connections arrays.' });
  const errors: Record<string, string> = {};
  const sensors = value.sensors.map((raw, i) => {
    const s = object(raw) ? raw : {};
    const key = `flow.sensors.${i}`;
    const rawMessage = s.triggerKind === 'serial-message';
    if (typeof s.clientId !== 'string' || !s.clientId) errors[`${key}.clientId`] = 'Client ID is required.';
    if (typeof s.name !== 'string' || !s.name.trim()) errors[`${key}.name`] = 'Sensor name is required.';
    if (s.connectionType !== 'gpio') errors[`${key}.connectionType`] = 'Only GPIO is supported.';
    if (s.triggerKind != null && s.triggerKind !== 'serial-message' && s.triggerKind !== 'legacy-button') errors[`${key}.triggerKind`] = 'Unsupported trigger format.';
    if (rawMessage) {
      if (!validMessage(s.message)) errors[`${key}.message`] = 'Enter one complete printable controller message (1–128 characters) with no leading or trailing spaces.';
      if (!s.serialPort) errors[`${key}.serialPort`] = 'Controller serial port is required for message rules.';
    } else if (typeof s.port !== 'string' || !/^(?:[2-9]|1\d|2[0-7])$/.test(s.port)) errors[`${key}.port`] = 'GPIO port must be 2–27.';
    if (s.serialPort != null && s.serialPort !== '' && (typeof s.serialPort !== 'string' || !/^(?:COM[1-9]\d*|\/dev\/[A-Za-z0-9_./:-]+)$/i.test(s.serialPort) || s.serialPort.includes('..'))) errors[`${key}.serialPort`] = 'Use COM3, COM4, or a Linux /dev/ serial path.';
    if (s.operator !== 'equals') errors[`${key}.operator`] = 'Only equals is supported.';
    if (!rawMessage && typeof s.expectedValue !== 'boolean') errors[`${key}.expectedValue`] = 'Expected value must be boolean.';
    if (!Number.isFinite(s.x) || !Number.isFinite(s.y)) errors[`${key}.position`] = 'Canvas coordinates must be finite.';
    if (s.id !== undefined && (typeof s.id !== 'string' || !s.id)) errors[`${key}.id`] = 'Invalid ID.';
    return { id: s.id as string | undefined, clientId: s.clientId as string, name: s.name as string, connectionType: 'gpio' as const, port: rawMessage ? '' : s.port as string, serialPort: typeof s.serialPort === 'string' && s.serialPort ? (/^com/i.test(s.serialPort) ? s.serialPort.toUpperCase() : s.serialPort) : undefined, operator: 'equals' as const, expectedValue: rawMessage ? true : s.expectedValue as boolean, triggerKind: rawMessage ? 'serial-message' as const : 'legacy-button' as const, ...(rawMessage ? { message: s.message as string } : {}), enabled: s.enabled !== false, x: s.x as number, y: s.y as number };
  });
  const connections = value.connections.map((raw, i) => {
    const c = object(raw) ? raw : {};
    const key = `flow.connections.${i}`;
    if (typeof c.clientId !== 'string' || !c.clientId) errors[`${key}.clientId`] = 'Client ID is required.';
    if (typeof c.sourceSensorClientId !== 'string' || !sensors.some(s => s.clientId === c.sourceSensorClientId)) errors[`${key}.sourceSensorClientId`] = 'Sensor is missing.';
    const target = items.find(item => item.clientId === c.targetItemClientId || item.id === c.targetItemClientId);
    if (!target) errors[`${key}.targetItemClientId`] = 'Target item is missing.';
    if (typeof c.cooldownMs !== 'number' || !Number.isInteger(c.cooldownMs) || c.cooldownMs < 0 || c.cooldownMs > 600000) errors[`${key}.cooldownMs`] = 'Cooldown must be 0–600000 ms.';
    if (typeof c.debounceMs !== 'number' || !Number.isInteger(c.debounceMs) || c.debounceMs < 0 || c.debounceMs > 60000) errors[`${key}.debounceMs`] = 'Debounce must be 0–60000 ms.';
    return { id: c.id as string | undefined, clientId: c.clientId as string, sourceSensorClientId: c.sourceSensorClientId as string, targetItemClientId: c.targetItemClientId as string, cooldownMs: c.cooldownMs as number, debounceMs: c.debounceMs as number, enabled: c.enabled !== false };
  });
  if (!unique(sensors.map(s => s.clientId)) || !unique(connections.map(c => c.clientId))) errors.flow = 'Client IDs must be unique.';
  if (new Set(sensors.filter(s => s.enabled && s.serialPort).map(s => s.serialPort)).size > 1) errors['flow.sensors'] = 'Use one controller serial port per playlist.';
  if (!unique(sensors.map(s => s.triggerKind === 'serial-message' ? `message:${s.serialPort}:${s.message}` : `button:${s.port}`))) errors['flow.sensors'] = 'Sensor triggers must be unique.';
  if (!unique(connections.map(c => c.sourceSensorClientId))) errors['flow.connections'] = 'Only one target per sensor is supported.';
  if (publish && sensors.some(s => !connections.some(c => c.sourceSensorClientId === s.clientId))) errors['flow.connections'] = 'Every sensor needs a target video.';
  if (Object.keys(errors).length) throw new PlaylistPayloadError(errors);
  if (publish && sensors.some(s => s.triggerKind === 'serial-message')) throw new PlaylistPayloadError({ flow: 'Controller-message rules can be saved as drafts, but publishing requires the updated worker and player.' }, 409);
  return { sensors, connections };
}
export const playlistDetailInclude = { playlistItems: { include: { media: { include: { mediaType: true } } }, orderBy: { position: 'asc' as const } }, flowNodes: true, flowEdges: true };
export function serializeFlow(playlist: { flowNodes: Array<{ id: string; kind: string; playlistItemId: string | null; name: string; connectionType: string | null; port: string | null; serialPort?: string | null; operator: string | null; expectedValue: Prisma.JsonValue | null; matchMode?: string | null; matchValue?: string | null; enabled: boolean; x: number; y: number }>; flowEdges: Array<{ id: string; sourceNodeId: string; targetNodeId: string; cooldownMs: number; debounceMs: number; enabled: boolean }> }) {
  const nodes = playlist.flowNodes;
  return { sensors: nodes.filter(n => n.kind === 'SENSOR').map(n => ({ id: n.id, clientId: n.id, name: n.name, connectionType: n.connectionType, port: n.port ?? '', serialPort: n.serialPort ?? undefined, operator: n.operator, expectedValue: n.expectedValue, triggerKind: n.matchMode === 'exact' ? 'serial-message' as const : 'legacy-button' as const, ...(n.matchMode === 'exact' ? { message: n.matchValue ?? '' } : {}), enabled: n.enabled, x: n.x, y: n.y })), connections: playlist.flowEdges.map(e => ({ id: e.id, clientId: e.id, sourceSensorClientId: e.sourceNodeId, targetItemClientId: nodes.find(n => n.id === e.targetNodeId)?.playlistItemId, cooldownMs: e.cooldownMs, debounceMs: e.debounceMs, enabled: e.enabled })) };
}
