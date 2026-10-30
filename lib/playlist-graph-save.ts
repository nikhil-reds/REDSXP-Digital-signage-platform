import type { Prisma } from '@/app/generated/prisma/client';
import { PlaylistPayloadError, type FlowInput } from './playlist-flow';

type Tx = Prisma.TransactionClient;
type ItemInput = { id?: string; clientId?: string; mediaId: string; position: number; durationSec: number; fit?: string; objectPosition?: string; zoneId?: string };
export async function savePlaylistGraph(tx: Tx, playlistId: string, tenantId: string, items: ItemInput[] | undefined, flow: FlowInput | undefined) {
  const existingItems = await tx.playlistItem.findMany({ where: { playlistId } });
  const existingNodes = await tx.playlistFlowNode.findMany({ where: { playlistId } });
  const existingEdges = await tx.playlistFlowEdge.findMany({ where: { playlistId } });
  const itemMap = new Map<string, string>();
  if (items) {
    const mediaIds = [...new Set(items.map(i => i.mediaId))];
    const media = await tx.media.findMany({ where: { id: { in: mediaIds }, tenantId, status: 'READY' }, include: { mediaType: true } });
    if (media.length !== mediaIds.length) throw new PlaylistPayloadError({ items: 'A media item is missing, not ready, or inaccessible.' }, 404);
    if (flow && flow.connections.some(c => { const target = items.find(i => i.clientId === c.targetItemClientId || i.id === c.targetItemClientId); return !target || media.find(m => m.id === target.mediaId)?.mediaType.name.toLowerCase() !== "video"; })) throw new PlaylistPayloadError({ "flow.connections": "Sensor targets must be playable videos." });
    if (new Set(items.map(i => i.clientId).filter(Boolean)).size !== items.filter(i => i.clientId).length) throw new PlaylistPayloadError({ items: 'Item client IDs must be unique.' });
    const retained = new Set<string>();
    for (const [index, item] of items.entries()) {
      if (item.id && !existingItems.some(e => e.id === item.id)) throw new PlaylistPayloadError({ [`items.${index}.id`]: 'Item is inaccessible.' }, 404);
      const data = { mediaId: item.mediaId, position: item.position, durationSec: item.durationSec, fit: item.fit || 'scale-down', objectPosition: item.objectPosition || 'center', zoneId: item.zoneId || 'full-screen' };
      const row = item.id ? await tx.playlistItem.update({ where: { id: item.id }, data }) : await tx.playlistItem.create({ data: { ...data, playlistId } });
      retained.add(row.id); itemMap.set(item.clientId || row.id, row.id); itemMap.set(row.id, row.id);
    }
    if (flow) { await tx.playlistFlowEdge.deleteMany({ where: { playlistId } }); await tx.playlistFlowNode.deleteMany({ where: { playlistId } }); }
    await tx.playlistItem.deleteMany({ where: { playlistId, id: { notIn: [...retained] } } });
  } else for (const item of existingItems) itemMap.set(item.id, item.id);
  if (flow) {
    if (!items) { await tx.playlistFlowEdge.deleteMany({ where: { playlistId } }); await tx.playlistFlowNode.deleteMany({ where: { playlistId } }); }
    for (const sensor of flow.sensors) if (sensor.id && !existingNodes.some(n => n.id === sensor.id && n.kind === 'SENSOR')) throw new PlaylistPayloadError({ flow: 'Sensor is inaccessible.' }, 404);
    for (const edge of flow.connections) if (edge.id && !existingEdges.some(e => e.id === edge.id)) throw new PlaylistPayloadError({ flow: 'Connection is inaccessible.' }, 404);
    const nodeMap = new Map<string, string>();
    for (const sensor of flow.sensors) {
      const row = await tx.playlistFlowNode.create({ data: { id: sensor.id, playlistId, kind: 'SENSOR', name: sensor.name.trim(), connectionType: sensor.connectionType, port: sensor.triggerKind === 'serial-message' ? null : sensor.port, serialPort: sensor.serialPort || null, operator: sensor.operator, expectedValue: sensor.triggerKind === 'serial-message' ? undefined : sensor.expectedValue, matchMode: sensor.triggerKind === 'serial-message' ? 'exact' : null, matchValue: sensor.triggerKind === 'serial-message' ? sensor.message : null, enabled: sensor.enabled, x: sensor.x, y: sensor.y } });
      nodeMap.set(sensor.clientId, row.id);
    }
    for (const edge of flow.connections) {
      const targetItemId = itemMap.get(edge.targetItemClientId);
      const sourceNodeId = nodeMap.get(edge.sourceSensorClientId);
      if (!targetItemId || !sourceNodeId) throw new PlaylistPayloadError({ flow: 'Connection target is missing.' });
      let target = await tx.playlistFlowNode.findUnique({ where: { playlistItemId: targetItemId } });
      if (!target) target = await tx.playlistFlowNode.create({ data: { playlistId, playlistItemId: targetItemId, kind: 'MEDIA', name: '', x: 0, y: 0 } });
      await tx.playlistFlowEdge.create({ data: { id: edge.id, playlistId, sourceNodeId, targetNodeId: target.id, cooldownMs: edge.cooldownMs, debounceMs: edge.debounceMs, enabled: edge.enabled } });
    }
  }
}
