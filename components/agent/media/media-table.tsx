"use client";

import React, { useState } from "react";
import {
  Film,
  Image as ImageIcon,
  Code,
  AlertCircle,
  RefreshCw,
  Archive,
  Trash,
  Tag,
  Folder,
} from "lucide-react";
import { MediaAsset } from "./media-grid";
import { Badge, Button, Card, Checkbox, Td, Th, Tr, type Tone } from "@/components/ui";

interface MediaTableProps {
  assets: MediaAsset[];
  onSelectMedia: (asset: MediaAsset) => void;
}

/** Transcode state → the portal-wide status vocabulary. */
function statusTone(status: MediaAsset["status"]): Tone {
  if (status === "Ready") return "accent";
  if (status === "Failed") return "danger";
  return "warning";
}

export default function MediaTable({ assets, onSelectMedia }: MediaTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? assets.map((a) => a.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  return (
    <Card size="panel" className="overflow-hidden">
      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-app-accent-surface border-b border-app-border flex items-center justify-between gap-3 animate-fadeIn">
          <span className="text-body font-semibold text-app-accent-text">
            {selectedIds.length} assets selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" icon={Folder}>
              Move to Folder
            </Button>
            <Button size="sm" variant="secondary" icon={Tag}>
              Add Tags
            </Button>
            <Button size="sm" variant="secondary" icon={Archive}>
              Archive
            </Button>
            <Button size="sm" variant="danger" icon={Trash}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-app-surface-alt select-none">
              <Th className="w-10 text-center">
                <Checkbox
                  checked={selectedIds.length === assets.length && assets.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all assets"
                />
              </Th>
              <Th>Filename</Th>
              <Th>Type</Th>
              <Th>Resolution</Th>
              <Th>File Size</Th>
              <Th>Status</Th>
              <Th>Assigned Playlists</Th>
              <Th>Uploaded By</Th>
              <Th>Date Added</Th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);
              const Icon =
                asset.type === "Video" ? Film : asset.type === "HTML5" ? Code : ImageIcon;
              const isExternalLink = asset.sourceType === "external_url";
              return (
                <Tr key={asset.id} interactive onClick={() => onSelectMedia(asset)}>
                  <Td className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(asset.id, e.target.checked)}
                      aria-label={`Select ${asset.name}`}
                    />
                  </Td>

                  <Td className="font-semibold">
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-app-muted shrink-0" />
                      <span className="truncate max-w-[200px]">{asset.name}</span>
                    </span>
                  </Td>

                  <Td className="text-app-muted uppercase tracking-headline">
                    {isExternalLink ? "HTML Link" : asset.type}
                  </Td>
                  <Td className="text-app-muted">{asset.dimensions}</Td>
                  <Td className="text-app-muted">{asset.size}</Td>

                  <Td>
                    <Badge tone={statusTone(asset.status)}>
                      {asset.status === "Transcoding" && (
                        <RefreshCw className="w-3 h-3 animate-spin" aria-hidden />
                      )}
                      {asset.status === "Failed" && <AlertCircle className="w-3 h-3" aria-hidden />}
                      {asset.status}
                    </Badge>
                  </Td>

                  <Td>
                    {asset.usedInPlaylists.length > 0 ? (
                      <span className="font-semibold text-app-accent-text">
                        {asset.usedInPlaylists.length} playlists
                      </span>
                    ) : (
                      <span className="text-app-muted">Unused</span>
                    )}
                  </Td>

                  <Td className="text-app-muted">{asset.uploader}</Td>
                  <Td className="text-app-muted">{asset.date}</Td>
                </Tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
