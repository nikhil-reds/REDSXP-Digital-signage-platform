"use client";

import React from "react";
import { Film, Image as ImageIcon, Code, AlertCircle, RefreshCw } from "lucide-react";
import { Badge, Card } from "@/components/ui";

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
  sourceType?: "upload" | "external_url";
  externalUrl?: string | null;
}

interface MediaGridProps {
  assets: MediaAsset[];
  onSelectMedia: (asset: MediaAsset) => void;
}

export default function MediaGrid({ assets, onSelectMedia }: MediaGridProps) {
  return (
    // Was up to 15 columns with 6px labels. The scale floor is 12px, so tiles
    // are sized to fit real text rather than shrinking the type to fit tiles.
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {assets.map((asset) => {
        const isVideo = asset.type === "Video";
        const isHtml = asset.type === "HTML5";
        const isProcessing = asset.status === "Transcoding" || asset.status === "Uploading";
        const isFailed = asset.status === "Failed";
        const isExternalLink = asset.sourceType === "external_url";
        const isPortrait =
          asset.dimensions?.startsWith("1080") || asset.dimensions?.startsWith("2160");

        const FallbackIcon = isVideo ? Film : isHtml ? Code : ImageIcon;

        return (
          <Card
            key={asset.id}
            as="button"
            size="row"
            interactive
            onClick={() => onSelectMedia(asset)}
            className="overflow-hidden group flex flex-col text-left w-full"
          >
            {/* Visual Thumbnail representation */}
            <div className="relative aspect-video w-full bg-app-surface-alt flex items-center justify-center border-b border-app-border overflow-hidden">
              {asset.cdnUrl && !isVideo && !isHtml && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={asset.cdnUrl}
                  alt={asset.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
              {asset.cdnUrl && isVideo && (
                <video
                  src={asset.cdnUrl}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                  muted
                  playsInline
                />
              )}

              {/* Type icon fallback — neutral, the badge already names the type */}
              {(!asset.cdnUrl || isHtml) && (
                <FallbackIcon className="w-6 h-6 text-app-muted opacity-50 group-hover:scale-105 transition-transform" />
              )}

              <span className="absolute top-1.5 left-1.5">
                <Badge tone="neutral" uppercase>
                  {isExternalLink ? "HTML Link" : asset.type}
                </Badge>
              </span>

              {asset.duration && (
                <span className="absolute bottom-1.5 right-1.5">
                  <Badge tone="neutral">{asset.duration}</Badge>
                </span>
              )}

              {isPortrait && (
                <span className="absolute top-1.5 right-1.5">
                  <Badge tone="accent">9:16</Badge>
                </span>
              )}

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-3 text-center gap-1.5 animate-fadeIn">
                  <RefreshCw className="w-4 h-4 text-reds-offwhite animate-spin" />
                  <span className="text-caption font-semibold text-reds-offwhite uppercase tracking-headline">
                    {asset.status === "Transcoding" ? `${asset.progress}%` : "Uploading"}
                  </span>
                  <div className="w-full bg-reds-cool-80 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-app-accent h-full rounded-full transition-[width]"
                      style={{ width: `${asset.progress || 0}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Failed Overlay */}
              {isFailed && (
                <div className="absolute inset-0 bg-app-danger-surface/95 flex flex-col items-center justify-center p-3 text-center gap-1">
                  <AlertCircle className="w-4 h-4 text-app-danger-text" />
                  <span className="text-caption font-semibold text-app-danger-text uppercase tracking-headline">
                    Failed
                  </span>
                </div>
              )}
            </div>

            {/* Asset Metadata Footer */}
            <div className="p-3 min-w-0 w-full">
              <span className="block text-body font-semibold text-app-text truncate">
                {asset.name}
              </span>
              <span className="flex justify-between items-center gap-2 text-caption text-app-muted mt-0.5">
                <span className="truncate">{asset.dimensions}</span>
                <span className="shrink-0">{asset.size}</span>
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
