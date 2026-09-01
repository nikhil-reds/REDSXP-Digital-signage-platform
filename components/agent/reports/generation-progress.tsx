"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button, Modal, ProgressBar } from "@/components/ui";

export default function GenerationProgress({ onCancel, onComplete }: { onCancel: () => void; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Fetching database tables…");

  useEffect(() => {
    const timer = window.setInterval(() => setProgress((previous) => {
      if (previous >= 100) { window.clearInterval(timer); window.setTimeout(onComplete, 500); return 100; }
      const next = Math.min(previous + Math.floor(Math.random() * 15) + 5, 100);
      setStage(next >= 75 ? "Compiling document package…" : next >= 40 ? "Formatting tables and trends…" : "Fetching logs and aggregates…");
      return next;
    }), 450);
    return () => window.clearInterval(timer);
  }, [onComplete]);

  return <Modal open onClose={onCancel} title="Compiling report" description={stage} size="sm">
    <div className="space-y-5 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-app-border bg-app-accent-surface text-app-accent-text"><Loader2 className="h-6 w-6 animate-spin" /></div><ProgressBar value={progress} label={`${progress}% complete`} /><Button onClick={onCancel} className="w-full">Cancel compilation</Button></div>
  </Modal>;
}
