export const MAX_MEDIA_BYTES = 250 * 1024 * 1024;
export const MEDIA_ACCEPT = "image/jpeg,image/png,image/gif,image/webp,image/avif,image/svg+xml,video/mp4,video/webm,.html,.htm,.zip";
export function validateMediaFile(file: { name: string; size: number }) {
  if (!Number.isSafeInteger(file.size) || file.size <= 0) return "This file is empty or has an invalid size.";
  if (file.size > MAX_MEDIA_BYTES) return "File exceeds the 250 MB limit.";
  if (!/\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|html?|zip)$/i.test(file.name)) return "Unsupported format. Choose an image, MP4, WebM, HTML, or ZIP file.";
  return undefined;
}
export function mediaContentType(name: string) {
  const extension = name.split('.').at(-1)?.toLowerCase() ?? '';
  const types: Record<string,string> = { jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',gif:'image/gif',webp:'image/webp',avif:'image/avif',svg:'image/svg+xml',mp4:'video/mp4',webm:'video/webm',html:'text/html',htm:'text/html',zip:'application/zip' };
  return types[extension] ?? 'application/octet-stream';
}
export function formatBytes(bytes: number) { return bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }
