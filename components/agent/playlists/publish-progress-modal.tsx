"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

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
}: PublishProgressModalProps) {
  if (!open) return null;

  const succeeded = !saving && !error;

  return (
    <div
      onClick={saving ? undefined : succeeded ? onDone : onClose}
      className="fixed inset-0 bg-black/55 dark:bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-[70] animate-fadeIn font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-96 max-w-[92vw] bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4 text-center"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            error
              ? "bg-red-50 dark:bg-red-950/20 text-red-500"
              : succeeded
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500"
              : "bg-[#2859D9]/10 dark:bg-[#6F96FF]/10 text-[#2859D9] dark:text-[#6F96FF]"
          }`}
        >
          {error ? (
            <AlertTriangle className="w-6 h-6" />
          ) : succeeded ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Loader2 className="w-6 h-6 animate-spin" />
          )}
        </div>

        <div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {error ? "Publish failed" : succeeded ? "Published successfully" : "Publishing loop…"}
          </div>
          <div className="text-xs text-zinc-450 mt-1">
            {error
              ? error
              : succeeded
              ? `"${playlistName}" is live and syncing to your display targets.`
              : `Saving "${playlistName}" and pushing it to deployment.`}
          </div>
        </div>

        <div className="w-full border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#0D1320] px-3.5 py-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-left text-[11px]">
          <span className="text-zinc-450">Playlist</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{playlistName}</span>
          <span className="text-zinc-450">Clips</span>
          <span className="font-mono">{itemCount}</span>
          <span className="text-zinc-450">Loop Duration</span>
          <span className="font-mono">{totalLabel}</span>
          <span className="text-zinc-450">Display</span>
          <span className="font-semibold">
            {displayName} · <span className="font-mono">{displayRes}</span>
          </span>
          <span className="text-zinc-450">Output</span>
          <span className="font-semibold">{deviceName}</span>
        </div>

        <div className="flex gap-2 w-full">
          {error ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 h-9 rounded-lg border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                onClick={onRetry}
                className="flex-1 h-9 rounded-lg border-none bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold hover:opacity-90 cursor-pointer transition-opacity"
              >
                Retry
              </button>
            </>
          ) : succeeded ? (
            <button
              onClick={onDone}
              className="flex-1 h-9 rounded-lg border-none bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold hover:opacity-90 cursor-pointer transition-opacity"
            >
              Done
            </button>
          ) : (
            <button
              disabled
              className="flex-1 h-9 rounded-lg border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#18202E] text-xs font-bold text-zinc-450 cursor-not-allowed"
            >
              Publishing…
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
