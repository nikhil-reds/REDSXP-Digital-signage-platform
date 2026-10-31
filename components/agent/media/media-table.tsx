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
        <div className="p-3 bg-app-accent-surface border-b border-app-border flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <span className="text-body font-semibold text-app-accent-text">
            {selectedIds.length} assets selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
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

      <div className="media-list-cards divide-y divide-app-border">
        <label className="flex min-h-11 items-center gap-3 p-4 text-body">
          <Checkbox checked={assets.length > 0 && assets.every((asset) => selectedIds.includes(asset.id))} onChange={handleSelectAll} /> Select all assets
        </label>
        {assets.map((asset) => (
          <article key={asset.id} className="min-w-0 space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Checkbox checked={selectedIds.includes(asset.id)} onChange={(event) => handleSelectOne(asset.id, event.target.checked)} aria-label={`Select ${asset.name}`} />
              <button className="min-w-0 min-h-11 flex-1 text-left text-body font-semibold [overflow-wrap:anywhere]" onClick={() => onSelectMedia(asset)}>{asset.name}</button>
            </div>
            <div className="flex flex-wrap gap-2"><Badge tone="neutral">{asset.type}</Badge><Badge tone={statusTone(asset.status)}>{asset.status}</Badge></div>
            <dl className="grid grid-cols-2 gap-3 text-body">
              {[["Resolution", asset.dimensions], ["Size", asset.size], ["Uploaded by", asset.uploader], ["Date", asset.date], ["Playlists", String(asset.usedInPlaylists.length)]].map(([label, value]) => (
                <div key={label} className="min-w-0"><dt className="text-caption text-app-muted">{label}</dt><dd className="[overflow-wrap:anywhere]">{value}</dd></div>
              ))}
            </dl>
            <Button variant="secondary" size="sm" onClick={() => onSelectMedia(asset)}>Preview asset</Button>
          </article>
        ))}
      </div>
      <div className="media-desktop-table overflow-x-auto" tabIndex={0} role="region" aria-label="Media assets; scroll horizontally for more columns">
        <table className="w-full min-w-[1000px] text-left border-collapse">
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
                      <button className="min-h-11 max-w-[240px] truncate text-left hover:underline" title={asset.name} onClick={(event) => { event.stopPropagation(); onSelectMedia(asset); }}>{asset.name}</button>
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
