"use client";

import React, { useState } from "react";
import {
  X,
  Film,
  Image as ImageIcon,
  Code,
  Trash,
  AlertTriangle,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import { MediaAsset } from "./media-grid";
import {
  Badge,
  Button,
  Card,
  DataField,
  IconButton,
  type Tone,
} from "@/components/ui";

interface MediaPreviewDrawerProps {
  asset: MediaAsset;
  onClose: () => void;
  onDeleteAsset: (id: string) => void;
}

function statusTone(status: MediaAsset["status"]): Tone {
  if (status === "Ready") return "accent";
  if (status === "Failed") return "danger";
  return "warning";
}

export default function MediaPreviewDrawer({
  asset,
  onClose,
  onDeleteAsset,
}: MediaPreviewDrawerProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isVideo = asset.type === "Video";
  const isHtml = asset.type === "HTML5";
  const isUsed = asset.usedInPlaylists.length > 0;
  const isExternalLink = asset.sourceType === "external_url";

  const TypeIcon = isVideo ? Film : isHtml ? Code : ImageIcon;

  const handleDeleteTrigger = () => {
    if (isUsed) return; // button is disabled; the lock panel explains why
    setConfirmDelete(true);
  };

  return (
    <div className="w-96 bg-app-surface border-l border-app-border flex flex-col h-full font-sans shadow-2xl shrink-0 overflow-y-auto relative">
      {/* Header */}
      <div className="p-5 border-b border-app-border flex justify-between items-start gap-3 shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="p-2 bg-app-accent-surface text-app-accent-text rounded-lg shrink-0 mt-0.5">
            <TypeIcon className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-heading text-h6 font-semibold tracking-headline text-app-text truncate">
              {asset.name}
            </h2>
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              <Badge tone="neutral" uppercase>
                {isExternalLink ? "HTML Link" : asset.type}
              </Badge>
              <Badge tone={statusTone(asset.status)}>{asset.status}</Badge>
            </div>
          </div>
        </div>
        <IconButton icon={X} onClick={onClose} aria-label="Close preview" size="sm" />
      </div>

      {/* Asset Preview Slot */}
      <div className="border-b border-app-border bg-app-surface-alt aspect-video flex items-center justify-center relative overflow-hidden select-none shrink-0">
        {asset.cdnUrl && !isVideo && !isHtml && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={asset.cdnUrl}
            alt={asset.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
        {asset.cdnUrl && isVideo && (
          <video src={asset.cdnUrl} className="absolute inset-0 w-full h-full object-contain" controls />
        )}
        {asset.cdnUrl && isHtml && isExternalLink && (
          <iframe
            src={asset.cdnUrl}
            title={asset.name}
            className="absolute inset-0 w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}

        {(!asset.cdnUrl || (isHtml && !isExternalLink)) && (
          <>
            <TypeIcon className="w-12 h-12 text-app-muted opacity-50" />
            <span className="absolute bottom-2 left-2">
              <Badge tone="neutral">{isHtml ? "HTML Package" : "File Preview Slot"}</Badge>
            </span>
          </>
        )}
      </div>

      {isExternalLink && asset.cdnUrl && (
        <div className="p-4 border-b border-app-border shrink-0">
          <a
            href={asset.cdnUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 text-body font-semibold rounded-lg border border-app-border text-app-accent-text flex items-center justify-center gap-1.5 hover:bg-app-surface-alt transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open HTML Link
          </a>
        </div>
      )}

      {/* Detailed Metadata parameters */}
      <div className="p-5 border-b border-app-border space-y-3 shrink-0">
        <h3 className="text-body font-semibold text-app-text">Asset Information</h3>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          <DataField label={isExternalLink ? "Source" : "File size"} value={asset.size} />
          <DataField label="Dimensions" value={asset.dimensions} />
          {asset.duration && <DataField label="Duration" value={asset.duration} />}
          <DataField label="Upload state" value={asset.status} />
          <DataField label="Uploaded by" value={asset.uploader} />
          <DataField label="Upload date" value={asset.date} />
        </div>
      </div>

      {/* Playlist References & Alerts */}
      <div className="p-5 space-y-4 flex-1">
        <div className="space-y-2">
          <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
            Used In Active Playlists
          </span>
          {isUsed ? (
            <div className="space-y-1.5">
              {asset.usedInPlaylists.map((pl, idx) => (
                <Card key={idx} size="row" padded className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-app-muted shrink-0" />
                  <span className="text-body font-semibold text-app-text truncate">{pl}</span>
                </Card>
              ))}
            </div>
          ) : (
            <Card size="row" padded>
              <p className="text-body text-app-muted">
                Not referenced in any active loop playlist. Safe to delete.
              </p>
            </Card>
          )}
        </div>

        {/* Locked Warning Panel */}
        {isUsed && (
          <div className="p-3 bg-app-warning-surface border border-app-warning/30 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-app-warning-text shrink-0 mt-0.5" />
            <p className="text-body text-app-warning-text font-semibold">
              Delete Lock Active: this asset is currently deployed on screens. Swap the playlist
              references first before deletion.
            </p>
          </div>
        )}

        {/* Delete Trigger */}
        <div className="pt-4 border-t border-app-border">
          {confirmDelete ? (
            <div className="space-y-3 border border-app-danger/30 p-3 rounded-lg bg-app-danger-surface">
              <span className="block text-body font-semibold text-app-danger-text">
                Confirm Deletion?
              </span>
              <p className="text-caption text-app-muted">This action cannot be undone.</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    onDeleteAsset(asset.id);
                    onClose();
                  }}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant={isUsed ? "secondary" : "danger"}
              icon={Trash}
              className="w-full"
              disabled={isUsed}
              title={isUsed ? "Referenced by an active playlist" : undefined}
              onClick={handleDeleteTrigger}
            >
              Delete Asset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
