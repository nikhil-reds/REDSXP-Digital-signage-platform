export function transferMediaFile(file: File, url: string, contentType: string, signal: AbortSignal, onProgress: (loaded:number) => void): Promise<void> {
  return new Promise<void>((resolve,reject) => {
          const xhr = new XMLHttpRequest();
          const abort = () => xhr.abort();
          const cleanup = () => signal.removeEventListener('abort',abort);
          xhr.open('PUT',url); xhr.setRequestHeader('Content-Type',contentType); xhr.timeout = 15 * 60 * 1000;
          xhr.upload.onprogress = event => { if (event.lengthComputable && !signal.aborted) onProgress(Math.min(event.loaded,file.size)); };
          xhr.onload = () => { cleanup(); if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error(`Upload failed (${xhr.status}). Please retry.`)); };
          xhr.onerror = () => { cleanup(); reject(new Error('Connection lost. Please retry.')); };
          xhr.ontimeout = () => { cleanup(); reject(new Error('Upload timed out. Please retry.')); };
          xhr.onabort = () => { cleanup(); reject(new DOMException('Cancelled','AbortError')); };
          signal.addEventListener('abort',abort,{once:true});
          if (signal.aborted) { cleanup(); reject(new DOMException('Cancelled','AbortError')); return; }
          xhr.send(file);
        });
}
