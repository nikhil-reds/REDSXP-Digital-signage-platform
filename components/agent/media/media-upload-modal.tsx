"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, RefreshCw, AlertCircle, CheckCircle2, Link, Eye, Save, Code } from "lucide-react";
import type { MediaAsset } from "./media-grid";
import {
  Badge,
  Button,
  Card,
  FieldLabel,
  Modal,
  ProgressBar,
  SegmentedControl,
  TextInput,
} from "@/components/ui";

interface MediaUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (newAsset: MediaAsset) => void;
}

type UploadingFile = {
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "transcoding" | "success" | "failed";
  error?: string;
};

function readVideoMetadata(file: File): Promise<{ durationSec: number; width: number | null; height: number | null }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        durationSec: Math.max(1, Math.ceil(video.duration)),
        width: video.videoWidth || null,
        height: video.videoHeight || null,
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to read video metadata"));
    };
    video.src = url;
  });
}

export default function MediaUploadModal({ onClose, onUploadSuccess }: MediaUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"file" | "link">("file");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDuration, setLinkDuration] = useState("20");
  const [linkWidth, setLinkWidth] = useState("1920");
  const [linkHeight, setLinkHeight] = useState("1080");
  const [linkError, setLinkError] = useState("");
  const [linkPreviewUrl, setLinkPreviewUrl] = useState("");
  const [isSavingLink, setIsSavingLink] = useState(false);

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

  const updateFileStatus = (filename: string, updates: Partial<UploadingFile>) => {
    setUploadingFiles(prev => prev.map(f => f.name === filename ? { ...f, ...updates } : f));
  };

  const getValidatedLinkUrl = () => {
    try {
      const url = new URL(linkUrl.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return url.toString();
    } catch {
      return null;
    }
  };

  const deriveLinkName = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return "HTML Link";
    }
  };

  const handlePreviewLink = () => {
    const validatedUrl = getValidatedLinkUrl();
    if (!validatedUrl) {
      setLinkError("Enter a valid http or https URL.");
      return;
    }
    setLinkError("");
    setLinkPreviewUrl(validatedUrl);
    if (!linkName.trim()) setLinkName(deriveLinkName(validatedUrl));
  };

  const handleSaveLink = async () => {
    const validatedUrl = getValidatedLinkUrl();
    if (!validatedUrl) {
      setLinkError("Enter a valid http or https URL.");
      return;
    }

    const durationSec = Number(linkDuration);
    const width = Number(linkWidth);
    const height = Number(linkHeight);
    const name = linkName.trim() || deriveLinkName(validatedUrl);

    if (!Number.isFinite(durationSec) || durationSec < 1) {
      setLinkError("Duration must be at least 1 second.");
      return;
    }
    if (!Number.isFinite(width) || width < 1 || !Number.isFinite(height) || height < 1) {
      setLinkError("Resolution must use positive width and height values.");
      return;
    }

    setIsSavingLink(true);
    setLinkError("");

    try {
      const createRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "external_url",
          type: "HTML5",
          name,
          filename: name,
          url: validatedUrl,
          durationSec,
          width,
          height,
          status: "READY",
        }),
      });

      const data = await createRes.json().catch(() => null);
      if (!createRes.ok) throw new Error(data?.error || "Failed to save HTML link");

      onUploadSuccess(data);
      setLinkName("");
      setLinkUrl("");
      setLinkPreviewUrl("");
      setLinkDuration("20");
      setLinkWidth("1920");
      setLinkHeight("1080");
    } catch (error: unknown) {
      setLinkError(error instanceof Error ? error.message : "Failed to save HTML link");
    } finally {
      setIsSavingLink(false);
    }
  };

  const uploadFileToS3 = async (file: File) => {
    try {
      // 1. Get Presigned URL
      const presignedRes = await fetch("/api/media/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          // Declared up front so the storage quota is checked before the URL is
          // issued rather than after the bytes land.
          sizeBytes: file.size
        })
      });
      
      if (!presignedRes.ok) {
        // 402 is the plan quota talking; its message names the limit.
        const problem = await presignedRes.json().catch(() => null);
        throw new Error(problem?.message || problem?.error || "Failed to get upload URL");
      }
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
      const videoMetadata = mediaType === "Video" ? await readVideoMetadata(file).catch(() => null) : null;

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
          type: mediaType,
          durationSec: videoMetadata?.durationSec,
          width: videoMetadata?.width,
          height: videoMetadata?.height
        })
      });

      if (!createRes.ok) throw new Error("Failed to save media record");
      const newAsset = await createRes.json();

      updateFileStatus(file.name, { status: "success" });
      onUploadSuccess(newAsset);

    } catch (error: unknown) {
      console.error("Upload error:", error);
      updateFileStatus(file.name, { status: "failed", error: error instanceof Error ? error.message : "Upload failed" });
    }
  };

  const statusLabel = (file: UploadingFile) => {
    if (file.status === "uploading")
      return { tone: "accent" as const, text: `Uploading ${file.progress}%`, icon: null };
    if (file.status === "transcoding")
      return { tone: "warning" as const, text: "Processing", icon: RefreshCw };
    if (file.status === "success")
      return { tone: "accent" as const, text: "Ready", icon: CheckCircle2 };
    return { tone: "danger" as const, text: "Failed", icon: AlertCircle };
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Add Media Asset"
      description="Upload files or register an HTML5 web link for signage playback."
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Window
        </Button>
      }
    >
      <div className="space-y-4">
        <SegmentedControl
          value={activeTab}
          onChange={setActiveTab}
          className="w-full [&>button]:flex-1"
          options={[
            { value: "file", label: "File Upload" },
            { value: "link", label: "HTML Link" },
          ]}
        />

        {/* Drag & drop zone */}
        {activeTab === "file" && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*,video/mp4,.zip,.html"
            />
            <button
              type="button"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text ${
                dragActive
                  ? "border-app-accent-text bg-app-accent-surface"
                  : "border-app-border-strong hover:border-app-accent-text"
              }`}
            >
              <span className="w-12 h-12 rounded-full bg-app-accent-surface text-app-accent-text flex items-center justify-center border border-app-border">
                <UploadCloud className="w-6 h-6" />
              </span>
              <span>
                <span className="block text-body font-semibold text-app-text">
                  Drag and drop files here
                </span>
                <span className="block text-caption text-app-muted mt-1">
                  or click to browse files from your disk
                </span>
              </span>
              <span className="text-caption text-app-muted uppercase tracking-headline font-semibold">
                Max single file 250 MB · HTML accepts .html or zipped packages
              </span>
            </button>

            {/* Upload Progress Queue */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-2.5">
                <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
                  Transfer Queue ({uploadingFiles.length})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {uploadingFiles.map((file, idx) => {
                    const s = statusLabel(file);
                    const StatusIcon = s.icon;
                    return (
                      <Card key={idx} size="row" padded className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <span className="block text-body font-semibold text-app-text truncate max-w-[280px]">
                              {file.name}
                            </span>
                            <span className="block text-caption text-app-muted mt-0.5">
                              {file.size}
                            </span>
                            {file.error && (
                              <span className="block text-caption text-app-danger-text mt-0.5">
                                {file.error}
                              </span>
                            )}
                          </div>
                          <Badge tone={s.tone}>
                            {StatusIcon && (
                              <StatusIcon
                                className={`w-3 h-3 ${
                                  file.status === "transcoding" ? "animate-spin" : ""
                                }`}
                                aria-hidden
                              />
                            )}
                            {s.text}
                          </Badge>
                        </div>

                        {(file.status === "uploading" || file.status === "transcoding") && (
                          <ProgressBar
                            value={file.progress}
                            tone={file.status === "transcoding" ? "warning" : "accent"}
                          />
                        )}

                        {(file.status === "uploading" || file.status === "failed") && (
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setUploadingFiles(
                                  uploadingFiles.filter((f) => f.name !== file.name),
                                )
                              }
                            >
                              {file.status === "failed" ? "Dismiss" : "Cancel"}
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "link" && (
          <div className="space-y-4">
            <div>
              <FieldLabel htmlFor="mu-url">HTML URL</FieldLabel>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-muted pointer-events-none" />
                <TextInput
                  id="mu-url"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    setLinkError("");
                  }}
                  placeholder="https://example.com/signage/menu.html"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="mu-name">Asset Name</FieldLabel>
              <TextInput
                id="mu-name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Rewards microsite"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <FieldLabel htmlFor="mu-dur">Duration</FieldLabel>
                <TextInput
                  id="mu-dur"
                  type="number"
                  min="1"
                  value={linkDuration}
                  onChange={(e) => setLinkDuration(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="mu-w">Width</FieldLabel>
                <TextInput
                  id="mu-w"
                  type="number"
                  min="1"
                  value={linkWidth}
                  onChange={(e) => setLinkWidth(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="mu-h">Height</FieldLabel>
                <TextInput
                  id="mu-h"
                  type="number"
                  min="1"
                  value={linkHeight}
                  onChange={(e) => setLinkHeight(e.target.value)}
                />
              </div>
            </div>

            {linkError && (
              <div className="p-2.5 rounded-lg border border-app-danger/30 bg-app-danger-surface text-app-danger-text text-body font-semibold flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{linkError}</span>
              </div>
            )}

            <div className="border border-app-border rounded-lg overflow-hidden bg-app-surface-alt aspect-video relative">
              {linkPreviewUrl ? (
                <iframe
                  src={linkPreviewUrl}
                  title="HTML link preview"
                  className="absolute inset-0 w-full h-full bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-app-muted">
                  <Code className="w-8 h-8 opacity-50" />
                  <span className="text-body font-semibold">
                    Preview an HTML link before saving
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" icon={Eye} onClick={handlePreviewLink}>
                Preview Link
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={isSavingLink ? RefreshCw : Save}
                onClick={handleSaveLink}
                disabled={isSavingLink}
              >
                {isSavingLink ? "Saving" : "Save HTML Link"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
