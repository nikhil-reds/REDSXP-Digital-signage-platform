"use client";

import React from "react";
import { Film, Image as ImageIcon, Code, AlertCircle, RefreshCw, Archive, CheckCircle2 } from "lucide-react";

export interface MediaAsset {
  id: string;
  name: string;
  type: "Video" | "Image" | "HTML5";
  dimensions: string;
  duration?: string;
  size: string;
  status: "Uploading" | "Transcoding" | "Ready" | "Failed" | "Archived";
  progress?: number;
  reason?: string;
  uploader: string;
  date: string;
  usedInPlaylists: string[];
  cdnUrl?: string; // Real S3 URL
}

interface MediaGridProps {
  assets: MediaAsset[];
  onSelectMedia: (asset: MediaAsset) => void;
}

export default function MediaGrid({ assets, onSelectMedia }: MediaGridProps) {
  return (
    <div className="grid grid-cols-[repeat(5,minmax(0,1fr))] sm:grid-cols-[repeat(8,minmax(0,1fr))] lg:grid-cols-[repeat(10,minmax(0,1fr))] xl:grid-cols-[repeat(15,minmax(0,1fr))] gap-2">
      {assets.map((asset) => {
        const isVideo = asset.type === "Video";
        const isHtml = asset.type === "HTML5";
        const isReady = asset.status === "Ready";
        const isProcessing = asset.status === "Transcoding" || asset.status === "Uploading";
        const isFailed = asset.status === "Failed";

        // Determine aspect ratio for representation
        const isPortrait = asset.dimensions?.startsWith("1080") || asset.dimensions?.startsWith("2160");

        return (
          <div
            key={asset.id}
            onClick={() => onSelectMedia(asset)}
            className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-lg overflow-hidden shadow-2xs hover:shadow-sm hover:border-[#2859D9]/20 dark:hover:border-[#6F96FF]/20 cursor-pointer group flex flex-col justify-between transition-all duration-200"
          >
            {/* Visual Thumbnail representation */}
            <div className="relative aspect-video bg-[#F6F7F9] dark:bg-[#090D14] flex items-center justify-center border-b border-[#E2E6EC] dark:border-[#283243] overflow-hidden">

              {/* Actual Image if ready and cdnUrl is provided */}
              {asset.cdnUrl && !isVideo && !isHtml && (
                <img src={asset.cdnUrl} alt={asset.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              )}
              {asset.cdnUrl && isVideo && (
                <video src={asset.cdnUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" muted playsInline />
              )}

              {/* Type Icons (fallback) */}
              {(!asset.cdnUrl || isHtml) && isVideo && <Film className="w-3.5 h-3.5 text-[#2859D9] dark:text-[#6F96FF] opacity-40 group-hover:scale-105 transition-transform" />}
              {(!asset.cdnUrl || isHtml) && isHtml && <Code className="w-3.5 h-3.5 text-purple-500 opacity-40 group-hover:scale-105 transition-transform" />}
              {(!asset.cdnUrl || isHtml) && !isVideo && !isHtml && <ImageIcon className="w-3.5 h-3.5 text-emerald-500 opacity-40 group-hover:scale-105 transition-transform" />}

              {/* Badges */}
              <span className="absolute top-1 left-1 text-[6px] bg-zinc-900/80 text-white dark:bg-white/80 dark:text-zinc-950 font-bold px-1 py-0.2 rounded-sm uppercase tracking-wide">
                {asset.type}
              </span>

              {asset.duration && (
                <span className="absolute bottom-1 right-1 text-[6px] bg-zinc-950 text-white font-bold px-0.5 py-0.2 rounded-xs">
                  {asset.duration}
                </span>
              )}

              {isPortrait && (
                <span className="absolute top-1 right-1 text-[6px] border border-[#2859D9]/30 text-[#2859D9] bg-[#2859D9]/10 px-1 py-0.2 rounded-xs font-bold uppercase">
                  9:16
                </span>
              )}

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-1.5 text-center space-y-1 animate-fadeIn">
                  <RefreshCw className="w-3 h-3 text-white animate-spin" />
                  <span className="text-[6px] font-bold text-white uppercase tracking-wider">
                    {asset.status === "Transcoding" ? `${asset.progress}%` : "Uploading"}
                  </span>
                  <div className="w-full bg-zinc-700 h-0.5 rounded-full overflow-hidden">
                    <div className="bg-[#2859D9] h-full rounded-full transition-all" style={{ width: `${asset.progress || 0}%` }} />
                  </div>
                </div>
              )}

              {/* Failed Overlay */}
              {isFailed && (
                <div className="absolute inset-0 bg-red-950/60 dark:bg-red-950/80 flex flex-col items-center justify-center p-1.5 text-center space-y-0.5">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-[6px] font-bold text-red-400 uppercase tracking-wider leading-none">
                    Failed
                  </span>
                </div>
              )}
            </div>

            {/* Asset Metadata Footer */}
            <div className="p-1.5 space-y-0.5 min-w-0">
              <span className="block text-[8px] font-bold text-zinc-900 dark:text-zinc-50 truncate leading-tight group-hover:text-[#2859D9] dark:group-hover:text-[#6F96FF]">
                {asset.name}
              </span>
              <div className="flex justify-between items-center text-[6px] text-zinc-400 dark:text-zinc-550 font-semibold">
                <span className="truncate">{asset.dimensions}</span>
                <span>{asset.size}</span>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
