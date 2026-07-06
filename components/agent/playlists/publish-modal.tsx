"use client";

import React from "react";
import { AlertTriangle, X, CheckCircle2, ShieldAlert } from "lucide-react";

interface PublishModalProps {
  onClose: () => void;
  onConfirm: () => void;
  screensCount: number;
}

export default function PublishModal({ onClose, onConfirm, screensCount }: PublishModalProps) {
  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-96 max-w-full shadow-2xl p-6 text-center space-y-4">
        
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20 text-[#2859D9] dark:text-[#6F96FF] flex items-center justify-center mx-auto border border-[#E2E6EC] dark:border-[#283243]">
          <ShieldAlert className="w-6 h-6" />
        </div>
        
        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
            Publish Playlist Playlist
          </h3>
          <p className="text-xs text-[#657080] dark:text-[#9AA7B7] leading-relaxed">
            This action will push loops updates in bulk. It directly impacts <span className="font-bold text-zinc-900 dark:text-white">{screensCount} active player nodes</span> in the Bengaluru region.
          </p>
        </div>

        {/* Impact Warning summary */}
        <div className="p-3 border border-amber-100 dark:border-amber-900/30 bg-amber-50/20 dark:bg-[#171F2C] rounded-lg text-left text-[10px] space-y-1 font-medium">
          <span className="font-bold text-amber-600 dark:text-amber-500 block mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Deployment Validation
          </span>
          <p>● Deployed screens will reload assets immediately.</p>
          <p>● Offline devices will apply changes upon heartbeat sync.</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-650 dark:text-zinc-350 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            Publish Playlist
          </button>
        </div>
        
      </div>
    </div>
  );
}
