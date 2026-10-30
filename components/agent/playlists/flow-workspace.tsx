"use client";
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useState } from 'react';
import { Plus, Radio, Trash2 } from 'lucide-react';
import type { EditorFlow, PlaylistClip } from './types';

const validMessage = (value: string) => value === value.trim() && /^[\x20-\x7E]{1,128}$/.test(value);

export default function FlowWorkspace({ items, flow, setFlow, library, inspector }: { items: PlaylistClip[]; flow: EditorFlow; setFlow: Dispatch<SetStateAction<EditorFlow>>; library: ReactNode; inspector: ReactNode; timelineCollapsed?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const videos = items.filter(i => i.type === 'Video');
  const selectedSensor = flow.sensors.find(s => s.clientId === selected);
  const update = (id: string, patch: Partial<EditorFlow['sensors'][number]>) => setFlow(f => ({ ...f, sensors: f.sensors.map(s => s.clientId === id ? { ...s, ...patch } : s) }));
  const target = (id: string) => flow.connections.find(c => c.sourceSensorClientId === id)?.targetItemClientId ?? '';
  const setTarget = (id: string, to: string) => setFlow(f => ({ ...f, connections: [...f.connections.filter(c => c.sourceSensorClientId !== id), ...(to ? [{ clientId: crypto.randomUUID(), sourceSensorClientId: id, targetItemClientId: to, cooldownMs: 2000, debounceMs: 100, enabled: true }] : [])] }));
  const add = () => { const clientId = crypto.randomUUID(); setFlow(f => ({ ...f, sensors: [...f.sensors, { clientId, name: `Sensor ${f.sensors.length + 1}`, connectionType: 'gpio', port: '', serialPort: 'COM4', operator: 'equals', expectedValue: true, enabled: true, triggerKind: 'serial-message', message: '', x: 80 + f.sensors.length * 240, y: 100 }] })); setSelected(clientId); };
  const remove = (id: string) => { setFlow(f => ({ sensors: f.sensors.filter(s => s.clientId !== id), connections: f.connections.filter(c => c.sourceSensorClientId !== id) })); setSelected(null); };
  return <div className="flex flex-1 min-h-0 overflow-hidden">
    {library}
    <section className="relative flex-1 overflow-auto bg-app-canvas p-5" aria-label="Playlist flow canvas">
      <div className="flex justify-between items-center mb-5"><h2 className="font-semibold">Dynamic flow</h2><button className="rounded border border-app-border px-3 py-2 flex gap-2 items-center" onClick={add}><Plus size={16}/><Radio size={16}/>Add sensor</button></div>
      <div className="flex flex-wrap gap-4">
        {flow.sensors.map(s => { const raw = s.triggerKind === 'serial-message'; const complete = !!s.name.trim() && (raw ? validMessage(s.message ?? '') : /^(?:[2-9]|1\d|2[0-7])$/.test(s.port)) && !!target(s.clientId); return <button key={s.clientId} onClick={() => setSelected(s.clientId)} className={`w-56 text-left rounded-xl border p-4 bg-app-surface ${selected === s.clientId ? 'border-green-500' : 'border-app-border'}`}><span className="flex items-center gap-2 font-semibold"><Radio size={16}/>{s.name}</span><span className="text-xs text-app-muted block mt-2 break-all">{raw ? s.message || 'Message needed' : `GPIO ${s.port || 'input needed'}`} · {complete ? raw ? 'Form complete' : 'Ready' : 'Incomplete'}</span></button>; })}
        {items.map(i => <div key={i.instanceId} className="w-56 rounded-xl border border-app-border p-4 bg-app-surface"><strong>{i.name}</strong><div className="text-xs text-app-muted mt-2">{i.type} · {i.duration}s</div></div>)}
      </div>
      {!flow.sensors.length && <p className="text-sm text-app-muted mt-8">Add a sensor when a controller message should play a video.</p>}
    </section>
    {selectedSensor ? <aside className="w-72 shrink-0 overflow-auto border-l border-app-border bg-app-surface p-4 space-y-4">
      <h3 className="font-semibold">Sensor settings</h3>
      <label className="block text-sm">Name<input className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1" value={selectedSensor.name} onChange={e => update(selectedSensor.clientId, { name: e.target.value })}/></label>
      <label className="block text-sm">Connection type<select className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1" value="gpio" disabled><option value="gpio">GPIO</option></select></label>
      <label className="block text-sm">Controller serial port<input className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1" placeholder="COM3, COM4, or /dev/ttyACM0" value={selectedSensor.serialPort ?? ''} onChange={e => update(selectedSensor.clientId, { serialPort: e.target.value.trim() })}/></label>
      <p className="text-xs text-app-muted">Use the serial port connected to this player.</p>
      <label className="block text-sm">Trigger format<select className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1" value={selectedSensor.triggerKind === 'serial-message' ? 'serial-message' : 'legacy-button'} onChange={e => update(selectedSensor.clientId, e.target.value === 'serial-message' ? { triggerKind: 'serial-message' } : { triggerKind: 'legacy-button', port: selectedSensor.port || '17', expectedValue: typeof selectedSensor.expectedValue === 'boolean' ? selectedSensor.expectedValue : true })}><option value="serial-message">Controller message</option><option value="legacy-button">Existing button input (2–27)</option></select></label>
      {selectedSensor.triggerKind === 'serial-message' ? <>
        <label className="block text-sm">Sensor value<input type="text" maxLength={128} className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1 font-mono" placeholder="XR[PU001]" value={selectedSensor.message ?? ''} onChange={e => update(selectedSensor.clientId, { message: e.target.value })}/></label>
        <p className="text-xs text-app-muted">Enter one complete message exactly as received, including letters and brackets. Examples: X001A[17], XR[PU001], X004B[Bs=NEAR].</p>
        <label className="block text-sm">Trigger when<select className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1" value="exact" disabled><option value="exact">Exact value received</option></select></label>
        <p className="text-xs text-amber-400">You can save this rule as a draft. Publishing requires the updated worker and player.</p>
      </> : <>
        <label className="block text-sm">Trigger input (2–27)<input type="number" min="2" max="27" className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1" value={selectedSensor.port} onChange={e => update(selectedSensor.clientId, { port: e.target.value })}/></label>
        <label className="block text-sm">Trigger when<select className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1" value={String(selectedSensor.expectedValue)} onChange={e => update(selectedSensor.clientId, { expectedValue: e.target.value === 'true' })}><option value="true">High / true</option><option value="false">Low / false</option></select></label>
      </>}
      <label className="block text-sm">Target video<select className="w-full rounded border border-app-border bg-app-canvas p-2 mt-1" value={target(selectedSensor.clientId)} onChange={e => setTarget(selectedSensor.clientId, e.target.value)}><option value="">Select video</option>{videos.map(v => <option key={v.instanceId} value={v.instanceId}>{v.name}</option>)}</select></label>
      <div className="text-xs text-app-muted">{target(selectedSensor.clientId) ? 'Sensor → video connected' : 'Choose a video to complete the sensor.'}</div>
      <button className="flex items-center gap-2 text-app-danger-text" onClick={() => remove(selectedSensor.clientId)}><Trash2 size={16}/>Remove sensor</button>
    </aside> : inspector}
  </div>;
}
