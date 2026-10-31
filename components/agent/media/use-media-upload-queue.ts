"use client";
import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "./media-grid";
import { transferMediaFile } from "@/lib/media-upload-transfer";
import { mediaContentType, validateMediaFile } from "@/lib/media-upload";
export type QueueItem = { id: string; file: File; status: 'queued' | 'waiting' | 'uploading' | 'saving' | 'success' | 'failed' | 'cancelled' | 'invalid'; loaded: number; error?: string; uploaded?: { s3Key: string; cdnUrl: string }; metadata?: {durationSec?: number; width?: number; height?: number} };
export function useMediaUploadQueue(onSuccess: (asset: MediaAsset) => void) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const itemsRef = useRef<QueueItem[]>([]);
  const controllers = useRef(new Map<string, AbortController>());
  const running = useRef(false);
  const mounted = useRef(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const successRef = useRef(onSuccess);
  useEffect(() => { successRef.current = onSuccess; }, [onSuccess]);
  useEffect(() => { mounted.current = true; const active = controllers.current; return () => { mounted.current = false; active.forEach(controller => controller.abort()); }; }, []);
  const commit = (next: QueueItem[]) => { itemsRef.current = next; if (mounted.current) setItems(next); };
  const update = (id: string, changes: Partial<QueueItem>) => commit(itemsRef.current.map(item => item.id === id ? {...item, ...changes} : item));
  const add = (files: File[]) => {
    const next = [...itemsRef.current]; let duplicates = 0;
    for (const file of files) {
      if (next.some(item => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified)) { duplicates++; continue; }
      const error = validateMediaFile(file);
      next.push({id:crypto.randomUUID(), file, status:error ? 'invalid' : 'queued', loaded:0, error});
    }
    commit(next); setNotice(duplicates ? `${duplicates} duplicate selection(s) skipped.` : 'Files added to the queue. Click Upload to start.');
  };
  const cancel = (id: string) => {
    const item = itemsRef.current.find(item => item.id === id);
    // A save may already have committed server-side; let it finish before closing.
    if (item?.status === 'saving') return;
    update(id, {status:'cancelled', error:undefined}); controllers.current.get(id)?.abort();
  };
  const remove = (id: string) => commit(itemsRef.current.filter(item => item.id !== id));
  const upload = async (entry: QueueItem) => {
    const controller = new AbortController(); controllers.current.set(entry.id,controller);
    const signal = controller.signal;
    const check = () => { if (signal.aborted) throw new DOMException('Cancelled','AbortError'); };
    try {
      let uploaded = entry.uploaded;
      let metadata = entry.metadata;
      if (!uploaded) {
        update(entry.id,{status:'uploading',loaded:0,error:undefined});
        const contentType = mediaContentType(entry.file.name);
        const response = await fetch('/api/media/presigned',{method:'POST',headers:{'Content-Type':'application/json'},signal,body:JSON.stringify({filename:entry.file.name,contentType,sizeBytes:entry.file.size})});
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || 'Unable to start upload.');
        check();
        await transferMediaFile(entry.file,data.presignedUrl,contentType,signal,loaded => update(entry.id,{loaded}));
        uploaded = {s3Key:data.s3Key,cdnUrl:data.cdnUrl};
        update(entry.id,{uploaded,loaded:entry.file.size}); check();
        if (contentType.startsWith('video/')) metadata = await readMetadata(entry.file,signal);
        update(entry.id,{metadata});
      }
      check(); update(entry.id,{status:'saving',error:undefined});
      const type = mediaContentType(entry.file.name).startsWith('video/') ? 'Video' : /\.(html?|zip)$/i.test(entry.file.name) ? 'HTML5' : 'Image';
      const result = await fetch('/api/media',{method:'POST',signal:AbortSignal.timeout(60000),headers:{'Content-Type':'application/json'},body:JSON.stringify({name:entry.file.name,filename:entry.file.name,...uploaded,sizeBytes:entry.file.size,type,...metadata})});
      const data = await result.json();
      if (!result.ok) throw new Error(data.message || data.error || 'File transferred, but saving failed. Retry to save without uploading again.');
      update(entry.id,{status:'success',loaded:entry.file.size});
      if (mounted.current) successRef.current(data);
    } catch (error) {
      update(entry.id,{status:signal.aborted ? 'cancelled' : 'failed',error:signal.aborted ? undefined : error instanceof Error ? error.message : 'Upload failed.'});
    } finally { controllers.current.delete(entry.id); }
  };
  const start = async (ids?: string[]) => {
    if (running.current) return;
    const batch = itemsRef.current.filter(item => ids ? ids.includes(item.id) && ['failed','cancelled'].includes(item.status) : item.status === 'queued');
    if (!batch.length) return;
    running.current = true; setBusy(true); setNotice('');
    const selected = new Set(batch.map(item => item.id));
    commit(itemsRef.current.map(item => selected.has(item.id) ? {...item,status:'waiting',error:undefined} : item));
    let cursor = 0;
    const worker = async () => { while (cursor < batch.length && mounted.current) { const entry = batch[cursor++]; if (itemsRef.current.find(item => item.id === entry.id)?.status === 'waiting') await upload(entry); } };
    try { await Promise.all([worker(),worker()]); } finally { running.current = false; if (mounted.current) { setBusy(false); setNotice('Upload batch finished. Review the results below.'); } }
  };
  return {items,busy,notice,add,start,cancel,remove,clear:() => commit(itemsRef.current.filter(item => !['queued','invalid','cancelled'].includes(item.status))),cancelAll:() => itemsRef.current.forEach(item => { if (['waiting','uploading'].includes(item.status)) cancel(item.id); })};
}
function readMetadata(file: File,signal:AbortSignal): Promise<{durationSec?:number;width?:number;height?:number}> {
  return new Promise(resolve => {
    const video = document.createElement('video'); const url = URL.createObjectURL(file);
    const finish = () => { clearTimeout(timer); signal.removeEventListener('abort',finish); const result = {durationSec:Number.isFinite(video.duration) ? Math.max(1,Math.ceil(video.duration)) : undefined,width:video.videoWidth || undefined,height:video.videoHeight || undefined}; video.onloadedmetadata=null; video.onerror=null; video.removeAttribute('src'); video.load(); URL.revokeObjectURL(url); resolve(result); };
    const timer = setTimeout(finish,5000); video.preload='metadata'; video.onloadedmetadata=finish; video.onerror=finish; signal.addEventListener('abort',finish,{once:true}); video.src=url;
  });
}
