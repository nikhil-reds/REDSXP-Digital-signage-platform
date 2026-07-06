"use client";

import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw, X, FileText, CheckCircle2 } from "lucide-react";

interface GenerationProgressProps {
  onCancel: () => void;
  onComplete: () => void;
}

export default function GenerationProgress({ onCancel, onComplete }: GenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Fetching database tables...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }

        const nextProgress = prev + Math.floor(Math.random() * 15) + 5;
        const bounded = Math.min(nextProgress, 100);

        // Update stage based on progress
        if (bounded >= 75) {
          setStage("Compiling document package...");
        } else if (bounded >= 40) {
          setStage("Formatting tables & trends layouts...");
        } else {
          setStage("Fetching database logs & aggregates...");
        }

        return bounded;
      });
    }, 450);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans p-6">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-96 max-w-full shadow-2xl p-6 text-center space-y-4">
        
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20 text-[#2859D9] dark:text-[#6F96FF] flex items-center justify-center mx-auto border border-[#E2E6EC] dark:border-[#283243]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
            Compiling Report File
          </h3>
          <p className="text-[10px] text-zinc-400 font-mono tracking-wide uppercase">
            {stage}
          </p>
        </div>

        {/* Progress Slider */}
        <div className="space-y-2">
          <div className="w-full bg-[#E2E6EC] dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2859D9] dark:bg-[#6F96FF] h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
            <span>Progress</span>
            <span className="font-mono">{progress}%</span>
          </div>
        </div>

        {/* Cancel actions */}
        <button
          onClick={onCancel}
          className="w-full py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-550 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Cancel Compilation
        </button>

      </div>
    </div>
  );
}
