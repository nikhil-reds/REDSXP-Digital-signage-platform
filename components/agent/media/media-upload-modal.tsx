"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface MediaUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (newAsset: any) => void;
}

export default function MediaUploadModal({ onClose, onUploadSuccess }: MediaUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadingFiles, setUploadingFiles] = useState<Array<{
    name: string;
    size: string;
    progress: number;
    status: "uploading" | "transcoding" | "success" | "failed";
    error?: string;
  }>>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    // Add to UI
    const newUploads = files.map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      progress: 0,
      status: "uploading" as const
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploads]);

    // Process each file
    files.forEach(file => uploadFileToS3(file));
  };

  const updateFileStatus = (filename: string, updates: any) => {
    setUploadingFiles(prev => prev.map(f => f.name === filename ? { ...f, ...updates } : f));
  };

  const uploadFileToS3 = async (file: File) => {
    try {
      // 1. Get Presigned URL
      const presignedRes = await fetch("/api/media/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream"
        })
      });
      
      if (!presignedRes.ok) throw new Error("Failed to get upload URL");
      const { presignedUrl, s3Key, cdnUrl } = await presignedRes.json();

      // 2. Upload to S3 using XMLHttpRequest for progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            updateFileStatus(file.name, { progress });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`S3 Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      // 3. Status transcode processing...
      updateFileStatus(file.name, { status: "transcoding", progress: 100 });

      // Determine type
      let mediaType = "Image";
      if (file.type.includes("video")) mediaType = "Video";
      if (file.type.includes("html") || file.name.endsWith(".zip")) mediaType = "HTML5";

      // 4. Save to Database
      const createRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          filename: file.name,
          s3Key,
          cdnUrl,
          sizeBytes: file.size,
          type: mediaType
        })
      });

      if (!createRes.ok) throw new Error("Failed to save media record");
      const newAsset = await createRes.json();

      updateFileStatus(file.name, { status: "success" });
      onUploadSuccess(newAsset);

    } catch (error: any) {
      console.error("Upload error:", error);
      updateFileStatus(file.name, { status: "failed", error: error.message || "Upload failed" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[480px] max-w-full shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
              Upload Media Assets
            </h3>
            <p className="text-[10px] text-[#657080] dark:text-[#9AA7B7] mt-0.5">
              Supports H.264 MP4 videos, JPG/PNG images, and HTML5 zip containers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-55 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Container body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Drag & drop zone */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
            accept="image/*,video/mp4,.zip,.html"
          />
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              dragActive
                ? "border-[#2859D9] bg-blue-50/10 dark:border-[#6F96FF]"
                : "border-[#E2E6EC] hover:border-[#2859D9]/55 dark:border-[#283243] dark:hover:border-[#6F96FF]/55"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20 text-[#2859D9] dark:text-[#6F96FF] flex items-center justify-center border border-[#E2E6EC] dark:border-[#283243]">
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="block font-bold text-zinc-800 dark:text-zinc-200">
                Drag and drop files here
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">
                or click to browse files from your disk
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wide font-semibold mt-2">
              Max single file upload size limit: 250 MB
            </span>
          </div>

          {/* Upload Progress Queue */}
          {uploadingFiles.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">
                Transfer Queue ({uploadingFiles.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {uploadingFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-zinc-50/10 dark:bg-zinc-950/10 space-y-2 relative"
                  >
                    <div className="flex justify-between items-start gap-2 text-[10px]">
                      <div className="min-w-0">
                        <span className="block font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[280px]">
                          {file.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 mt-0.5 block">{file.size}</span>
                        {file.error && <span className="text-[9px] text-red-500 mt-0.5 block">{file.error}</span>}
                      </div>
                      
                      {/* Status indicator */}
                      <span className="shrink-0 font-bold uppercase tracking-wider text-[8px]">
                        {file.status === "uploading" && <span className="text-blue-500">Uploading {file.progress}%</span>}
                        {file.status === "transcoding" && <span className="text-amber-500 flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5 animate-spin" /> Processing</span>}
                        {file.status === "success" && <span className="text-emerald-500 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Ready</span>}
                        {file.status === "failed" && <span className="text-red-500 flex items-center gap-0.5"><AlertCircle className="w-3 h-3" /> Failed</span>}
                      </span>
                    </div>

                    {/* Progress slider bar */}
                    {(file.status === "uploading" || file.status === "transcoding") && (
                      <div className="w-full bg-[#E2E6EC] dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            file.status === "transcoding" ? "bg-amber-500" : "bg-[#2859D9]"
                          }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Cancel trigger */}
                    {(file.status === "uploading" || file.status === "failed") && (
                      <button
                        onClick={() => setUploadingFiles(uploadingFiles.filter((f) => f.name !== file.name))}
                        className="absolute right-3 bottom-3 text-[9px] font-bold text-zinc-400 hover:text-red-500 cursor-pointer"
                      >
                        {file.status === "failed" ? "Dismiss" : "Cancel"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E2E6EC] dark:border-[#283243] flex justify-end bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
