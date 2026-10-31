"use client";
import { FileImage, FileVideo, FileCode } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { formatBytes, mediaContentType } from "@/lib/media-upload";
import type { useMediaUploadQueue } from "./use-media-upload-queue";
export default function MediaUploadQueue({queue}:{queue:ReturnType<typeof useMediaUploadQueue>}) {
  const failed=queue.items.filter(item => ['failed','cancelled'].includes(item.status));
  const transferred=queue.items.reduce((sum,item)=>sum+item.loaded,0);
  const total=queue.items.filter(item=>item.status!=='invalid').reduce((sum,item)=>sum+item.file.size,0);
  return <>
    {queue.notice && <p role="status" className="text-body text-app-muted">{queue.notice}</p>}
    {!!queue.items.length && <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><strong>{queue.items.length} files · {formatBytes(queue.items.reduce((sum,item)=>sum+item.file.size,0))}</strong><Button size="sm" variant="ghost" onClick={queue.clear} disabled={queue.busy}>Clear queue</Button></div>
      {queue.items.some(item=>!['queued','invalid'].includes(item.status)) && <div><ProgressBar value={transferred} max={total||1} label="Overall transferred bytes"/><p className="text-caption text-app-muted mt-1">{formatBytes(transferred)} / {formatBytes(total)} transferred · Saving completes separately</p></div>}
      <div className="media-upload-queue space-y-2">
        {queue.items.map(item=>{const type=mediaContentType(item.file.name);const Icon=type.startsWith('video/')?FileVideo:type.startsWith('image/')?FileImage:FileCode;return <Card key={item.id} size="row" padded className="space-y-2">
          <div className="flex items-start gap-3"><Icon className="w-5 h-5 shrink-0 mt-1" aria-hidden/><div className="min-w-0 flex-1"><strong className="block break-words [overflow-wrap:anywhere]">{item.file.name}</strong><span className="text-caption text-app-muted">{formatBytes(item.file.size)} · {item.file.name.split('.').at(-1)?.toUpperCase()}</span></div></div>
          <div className="flex flex-wrap items-center justify-between gap-2"><Badge tone={['failed','invalid'].includes(item.status)?'danger':item.status==='success'?'accent':'neutral'}>{({queued:'Queued',waiting:'Waiting',uploading:'Uploading',saving:'Saving',success:'Complete',failed:'Failed',cancelled:'Cancelled',invalid:'Invalid'})[item.status]}{item.status==='uploading'?' '+Math.round(item.loaded/item.file.size*100)+'%':''}</Badge>
            {['queued','invalid','cancelled','failed'].includes(item.status) && <Button size="sm" variant="ghost" onClick={()=>queue.remove(item.id)} disabled={queue.busy}>Remove</Button>}
            {['waiting','uploading'].includes(item.status) && <Button size="sm" variant="ghost" onClick={()=>queue.cancel(item.id)}>Cancel upload</Button>}
            {['failed','cancelled'].includes(item.status) && <Button size="sm" variant="secondary" onClick={()=>void queue.start([item.id])} disabled={queue.busy}>Retry</Button>}
          </div>
          {item.status==='uploading' && <><ProgressBar value={item.loaded} max={item.file.size} label={'Upload progress for '+item.file.name}/><p className="text-caption text-app-muted">{formatBytes(item.loaded)} / {formatBytes(item.file.size)}</p></>}
          {item.status==='saving' && <p role="status" className="text-caption text-app-muted">File transferred. Saving asset…</p>}
          {item.error && <p className="text-caption text-app-danger-text" role="status">{item.error}</p>}
        </Card>})}
      </div>
      {!!failed.length && <Button variant="secondary" disabled={queue.busy} onClick={()=>void queue.start(failed.map(item=>item.id))}>Retry failed / cancelled files</Button>}
    </div>}
  </>;
}
