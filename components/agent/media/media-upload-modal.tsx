"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, RefreshCw, AlertCircle, Link, Eye, Save, Code, ShieldAlert } from "lucide-react";
import { useMediaUploadQueue } from "./use-media-upload-queue";
import MediaUploadQueue from "./media-upload-queue";
import { MEDIA_ACCEPT } from "@/lib/media-upload";
import type { MediaAsset } from "./media-grid";
import {
  Button,
  Card,
  FieldLabel,
  Modal,
  SegmentedControl,
  TextInput,
} from "@/components/ui";

interface MediaUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (newAsset: MediaAsset) => void;
}

export default function MediaUploadModal({ onClose, onUploadSuccess }: MediaUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"file" | "link">("file");
  const queue = useMediaUploadQueue(onUploadSuccess);
  const [confirmClose, setConfirmClose] = useState(false);
  const [closing, setClosing] = useState(false);
  const keepReviewingRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (confirmClose) { keepReviewingRef.current?.querySelector<HTMLButtonElement>("button")?.focus(); keepReviewingRef.current?.scrollIntoView({ block: "nearest" }); } }, [confirmClose]);
  const queued = queue.items.filter(item => item.status === 'queued');
  const completed = queue.items.filter(item => item.status === 'success').length;
  useEffect(() => { if (closing && !queue.busy) onClose(); }, [closing,queue.busy,onClose]);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDuration, setLinkDuration] = useState("20");
  const [linkWidth, setLinkWidth] = useState("1920");
  const [linkHeight, setLinkHeight] = useState("1080");
  const [linkError, setLinkError] = useState("");
  const [linkPreviewUrl, setLinkPreviewUrl] = useState("");
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

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
      queue.add(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      queue.add(Array.from(e.target.files));
      e.target.value = "";
    }
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
      if (createRes.status === 403) {
        setAccessDenied(true);
        return;
      }
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

  const requestClose = () => {
    if (isSavingLink || closing) return;
    if (queue.busy || queued.length > 0) { setConfirmClose(true); return; }
    onClose();
  };

  return (
    <Modal
      open
      onClose={requestClose}
      title="Add Media Assets"
      description="Select and review files, then click Upload. Or save an HTML web link."
      size="lg"
      className="media-upload-dialog"
      footer={<div className="media-upload-footer">
        <span className="text-caption text-app-muted" role="status">{queue.busy ? 'Uploads in progress' : queue.items.length ? `${completed} uploaded · ${queued.length} queued · ${queue.items.filter(item => ['failed', 'cancelled', 'invalid'].includes(item.status)).length} need attention` : 'No files selected'}</span>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={requestClose} disabled={isSavingLink || closing}>{closing ? 'Finishing saves…' : completed && !queued.length && !queue.busy ? 'Done' : 'Cancel'}</Button>
          {activeTab === 'file' && <Button onClick={() => void queue.start()} disabled={!queued.length || queue.busy || closing || confirmClose || accessDenied}>Upload{queued.length ? ' ' + queued.length + ' file' + (queued.length === 1 ? '' : 's') : ''}</Button>}
        </div>
      </div>}
    >
      <div className="space-y-4">
        {confirmClose && <div role="alert" className="rounded-lg border border-app-warning p-3 space-y-3">
          <p>{queue.busy ? 'Cancel unfinished uploads and close? Completed assets stay saved. Any save in progress will finish first.' : 'Discard the files waiting in your queue?'}</p>
          <div ref={keepReviewingRef} className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setConfirmClose(false)}>{queue.busy ? 'Keep uploading' : 'Keep reviewing'}</Button><Button onClick={() => { setConfirmClose(false); if (queue.busy) { queue.cancelAll(); setClosing(true); } else onClose(); }}>{queue.busy ? 'Cancel uploads and close' : 'Discard queue and close'}</Button></div>
        </div>}
        <div inert={confirmClose || closing} className="space-y-4">
        {accessDenied ? (
          <Card size="panel" className="border-app-danger-border bg-app-danger-surface/40">
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-app-danger-surface text-app-danger-text">
                <ShieldAlert className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="font-heading text-h6 font-semibold text-app-text">You don’t have upload access</h3>
              <p className="mt-2 max-w-md text-body text-app-muted">
                Your current workspace role cannot add media assets. Ask a workspace administrator to grant media upload access.
              </p>
              <Button className="mt-5" variant="secondary" onClick={onClose}>Close</Button>
            </div>
          </Card>
        ) : <>
        <SegmentedControl
          value={activeTab}
          onChange={(tab) => { if (!isSavingLink) setActiveTab(tab); }}
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
              accept={MEDIA_ACCEPT}
            />
            <button
              type="button"
              data-has-files={queue.items.length > 0}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-4 sm:p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent-text ${
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
                  {queue.items.length ? 'Add more files' : 'Choose files or drag and drop here'}
                </span>
                <span className="block text-caption text-app-muted mt-1">
                  Files stay on your device until you click Upload.
                </span>
              </span>
              <span className="text-caption text-app-muted uppercase tracking-headline font-semibold">
                Max 250 MB per file · Images, MP4, WebM, HTML and ZIP
              </span>
            </button>

            <MediaUploadQueue queue={queue}/>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <div className="flex flex-wrap justify-end gap-2">
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
        </>}
        </div>
      </div>
    </Modal>
  );
}
