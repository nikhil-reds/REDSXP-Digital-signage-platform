import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { validateMediaFile, MAX_MEDIA_BYTES } from '../lib/media-upload';
import { transferMediaFile } from '../lib/media-upload-transfer';
class FakeXHR {
  static last: FakeXHR;
  upload: {onprogress?: (event:{lengthComputable:boolean;loaded:number})=>void} = {};
  status=200; timeout=0; sent=false; aborted=false;
  onload?:()=>void; onerror?:()=>void; onabort?:()=>void; ontimeout?:()=>void;
  constructor(){FakeXHR.last=this;}
  open(){} setRequestHeader(){} send(){this.sent=true;} abort(){this.aborted=true;this.onabort?.();}
}
Object.assign(globalThis,{XMLHttpRequest:FakeXHR});
test('validation rejects empty, oversized and unsupported files but accepts limit and supported formats',()=>{
  assert.ok(validateMediaFile({name:'a.png',size:0}));
  assert.ok(validateMediaFile({name:'a.mp4',size:MAX_MEDIA_BYTES+1}));
  assert.ok(validateMediaFile({name:'a.exe',size:10}));
  for(const name of ['a.PNG','a.webm','a.mp4','a.html','a.zip']) assert.equal(validateMediaFile({name,size:MAX_MEDIA_BYTES}),undefined);
});
test('transfer reports real byte progress, caps progress, and resolves on successful PUT',async()=>{
  const values:number[]=[];const pending=transferMediaFile(new File(['1234'],'a.png'),'https://example.invalid','image/png',new AbortController().signal,value=>values.push(value));
  FakeXHR.last.upload.onprogress?.({lengthComputable:true,loaded:2});FakeXHR.last.upload.onprogress?.({lengthComputable:true,loaded:10});FakeXHR.last.onload?.();await pending;assert.deepEqual(values,[2,4]);
});
test('cancel aborts the active request and rejects; pre-cancelled uploads never send',async()=>{
  const controller=new AbortController();const pending=transferMediaFile(new File(['x'],'a.png'),'https://example.invalid','image/png',controller.signal,()=>{});controller.abort();await assert.rejects(pending,{name:'AbortError'});assert.equal(FakeXHR.last.aborted,true);
  await assert.rejects(transferMediaFile(new File(['x'],'a.png'),'https://example.invalid','image/png',controller.signal,()=>{}),{name:'AbortError'});assert.equal(FakeXHR.last.sent,false);
});
test('network and HTTP errors reject without reporting completion',async()=>{
  let pending=transferMediaFile(new File(['x'],'a.png'),'https://example.invalid','image/png',new AbortController().signal,()=>{});FakeXHR.last.status=500;FakeXHR.last.onload?.();await assert.rejects(pending,/500/);
  pending=transferMediaFile(new File(['x'],'a.png'),'https://example.invalid','image/png',new AbortController().signal,()=>{});FakeXHR.last.onerror?.();await assert.rejects(pending,/Connection lost/);
});
