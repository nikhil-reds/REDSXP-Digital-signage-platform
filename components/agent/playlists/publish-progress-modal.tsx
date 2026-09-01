"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button, Modal } from "@/components/ui";

interface PublishProgressModalProps {
  open: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
  onDone: () => void;
  playlistName: string;
  itemCount: number;
  totalLabel: string;
  displayName: string;
  displayRes: string;
  deviceName: string;
  renderStatus: string | null;
  renderUrl: string | null;
}

export default function PublishProgressModal({
  open,
  saving,
  error,
  onClose,
  onRetry,
  onDone,
  playlistName,
  itemCount,
  totalLabel,
  displayName,
  displayRes,
  deviceName,
  renderStatus,
  renderUrl,
}: PublishProgressModalProps) {
  const succeeded = !saving && !error;

  const title = error ? "Publish failed" : succeeded ? "Published successfully" : "Publishing loop…";

  const description = error
    ? error
    : succeeded
      ? `“${playlistName}” is live and syncing to your display targets.`
      : `Saving “${playlistName}” and pushing it to deployment.`;

  const rows: [string, React.ReactNode][] = [
    ["Playlist", <span key="n" className="truncate">{playlistName}</span>],
    ["Clips", itemCount],
    ["Loop Duration", totalLabel],
    [
      "Display",
      <>
        {displayName} · {displayRes}
      </>,
    ],
    ["Output", deviceName],
    ["Render", <span key="r" className="capitalize">{renderStatus?.replaceAll("_", " ") ?? "Queued"}</span>],
  ];
  if (renderUrl) rows.push(["Video", <span key="v" className="truncate">{renderUrl}</span>]);

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : succeeded ? onDone : onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        error ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={onRetry}>
              Retry
            </Button>
          </>
        ) : succeeded ? (
          <Button variant="primary" onClick={onDone}>
            Done
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            Publishing…
          </Button>
        )
      }
    >
      <div className="flex flex-col items-center gap-4">
        <span
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            error
              ? "bg-app-danger-surface text-app-danger-text"
              : succeeded
                ? "bg-app-accent-surface text-app-accent-text"
                : "bg-app-surface-alt text-app-muted"
          }`}
        >
          {error ? (
            <AlertTriangle className="w-6 h-6" />
          ) : succeeded ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Loader2 className="w-6 h-6 animate-spin" />
          )}
        </span>

        <div className="w-full border border-app-border rounded-lg bg-app-surface-alt px-3.5 py-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-left text-caption">
          {rows.map(([label, value]) => (
            <React.Fragment key={label}>
              <span className="text-app-muted">{label}</span>
              <span className="font-semibold text-app-text min-w-0">{value}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </Modal>
  );
}
