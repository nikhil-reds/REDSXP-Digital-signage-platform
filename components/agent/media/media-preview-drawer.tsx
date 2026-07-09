"use client";

import React, { useState } from "react";
import { X, Film, Image as ImageIcon, Code, Trash, AlertTriangle, HelpCircle, HardDrive, Calendar } from "lucide-react";
import { MediaAsset } from "./media-grid";

interface MediaPreviewDrawerProps {
  asset: MediaAsset;
  onClose: () => void;
  onDeleteAsset: (id: string) => void;
}

export default function MediaPreviewDrawer({ asset, onClose, onDeleteAsset }: MediaPreviewDrawerProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isVideo = asset.type === "Video";
  const isHtml = asset.type === "HTML5";
  const isUsed = asset.usedInPlaylists.length > 0;

  const handleDeleteTrigger = () => {
    if (isUsed) {
      alert(`Safety Warning: "${asset.name}" is currently referenced in active playlists. You must swap them out before deletion.`);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="w-96 bg-white dark:bg-[#111722] border-l border-[#E2E6EC] dark:border-[#283243] flex flex-col h-full font-sans shadow-2xl shrink-0 overflow-y-auto relative">
      
      {/* Header */}
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-start bg-[#F6F7F9]/50 dark:bg-[#171F2C]/30">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-[#2859D9] dark:text-[#6F96FF] rounded-lg shrink-0 mt-0.5">
            {isVideo ? <Film className="w-4.5 h-4.5" /> : isHtml ? <Code className="w-4.5 h-4.5" /> : <ImageIcon className="w-4.5 h-4.5" />}
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 leading-snug truncate">
              {asset.name}
            </h2>
            <div className="mt-1">
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-bold bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] text-zinc-500 uppercase">
                {asset.type}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Asset Preview Slot */}
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/30 dark:bg-zinc-950/20 aspect-video flex items-center justify-center relative overflow-hidden select-none">
        
        {asset.cdnUrl && !isVideo && !isHtml && (
          <img src={asset.cdnUrl} alt={asset.name} className="absolute inset-0 w-full h-full object-contain" />
        )}
        {asset.cdnUrl && isVideo && (
          <video src={asset.cdnUrl} className="absolute inset-0 w-full h-full object-contain" controls />
        )}

        {/* Fallback Icons if no URL or if HTML */}
        {(!asset.cdnUrl || isHtml) && (
          <>
            {isVideo ? (
              <Film className="w-12 h-12 text-[#2859D9]/40" />
            ) : isHtml ? (
              <Code className="w-12 h-12 text-purple-500/40" />
            ) : (
              <ImageIcon className="w-12 h-12 text-emerald-500/40" />
            )}
            <span className="absolute bottom-2 left-2 text-[9px] font-bold text-zinc-400 bg-white/80 dark:bg-zinc-950/80 px-1.5 py-0.5 rounded border border-[#E2E6EC] dark:border-[#283243]">
              File Preview Slot
            </span>
          </>
        )}
      </div>

      {/* Detailed Metadata parameters */}
      <div className="p-4 border-b border-[#E2E6EC] dark:border-[#283243] space-y-3.5 text-xs">
        <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">
          Asset Information
        </h3>
        
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
          <div>
            <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">File size</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block font-mono">{asset.size}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Dimensions</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block font-mono">{asset.dimensions}</span>
          </div>
          {asset.duration && (
            <div>
              <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Duration</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block font-mono">{asset.duration}</span>
            </div>
          )}
          <div>
            <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Upload state</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-500 mt-0.5 block uppercase text-[9px]">{asset.status}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Uploaded by</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block">{asset.uploader}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Upload date</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block font-mono">{asset.date}</span>
          </div>
        </div>
      </div>

      {/* Playlist References & Alerts */}
      <div className="p-4 space-y-4 flex-1 text-xs">
        
        {/* Usage references list */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">
            Used In Active Playlists
          </span>
          {isUsed ? (
            <div className="space-y-1.5">
              {asset.usedInPlaylists.map((pl, idx) => (
                <div
                  key={idx}
                  className="p-2.5 border border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-950/20 rounded-lg flex items-center gap-2"
                >
                  <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{pl}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-lg text-center text-zinc-400 dark:text-zinc-500">
              Not referenced in any active loop playlist. Safe to delete.
            </div>
          )}
        </div>

        {/* Locked Warning Panel */}
        {isUsed && (
          <div className="p-3 bg-amber-50/70 border border-amber-100/50 dark:bg-amber-955/15 dark:border-amber-900/30 rounded-xl flex items-start gap-2 text-[10px]">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-amber-800 dark:text-amber-450 leading-relaxed font-semibold">
              Delete Lock Active: This asset is currently deployed on screens. Swap playlists references first before deletion.
            </div>
          </div>
        )}

        {/* Delete Trigger */}
        <div className="pt-4 border-t border-[#E2E6EC] dark:border-[#283243] mt-4">
          {confirmDelete ? (
            <div className="space-y-3 text-center border border-red-200 dark:border-red-900/30 p-3 rounded-lg bg-red-50/30 dark:bg-red-950/10">
              <span className="block font-bold text-red-700 dark:text-red-400">Confirm Deletion?</span>
              <p className="text-[10px] text-zinc-400">This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 border border-[#E2E6EC] dark:border-[#283243] text-[10px] font-bold rounded text-zinc-600 dark:text-zinc-350 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteAsset(asset.id);
                    onClose();
                  }}
                  className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDeleteTrigger}
              className={`w-full py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                isUsed
                  ? "bg-zinc-100 dark:bg-[#171F2C] text-zinc-400 cursor-not-allowed border border-[#E2E6EC] dark:border-[#283243]"
                  : "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/30"
              }`}
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Delete Asset</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
