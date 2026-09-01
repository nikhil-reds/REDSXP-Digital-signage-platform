"use client";

import React, { useState, useEffect } from "react";
import { Grid, List, Upload, HardDrive, Filter } from "lucide-react";
import MediaGrid, { MediaAsset } from "@/components/agent/media/media-grid";
import MediaTable from "@/components/agent/media/media-table";
import MediaUploadModal from "@/components/agent/media/media-upload-modal";
import MediaPreviewDrawer from "@/components/agent/media/media-preview-drawer";
import {
  Button,
  Card,
  ProgressBar,
  SearchInput,
  SegmentedControl,
  Select,
  SkeletonCardGrid,
  SkeletonTable,
} from "@/components/ui";

export default function AgentMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  // Plan §2: skeleton on first load only — a refetch keeps the current content
  // on screen rather than replacing it with grey bars.
  const isFirstLoad = isLoading && assets.length === 0;


  // Filters State
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [orientationFilter, setOrientationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAssets(data);
      })
      .catch((err) => console.error("Failed to load assets:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter application
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.uploader.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "All" || asset.type === typeFilter;

    // Landscape starts 1920 or Flexible; Portrait starts 1080/2160 (height bigger)
    const isPortrait =
      asset.dimensions?.startsWith("1080") || asset.dimensions?.startsWith("2160");
    const matchesOrientation =
      orientationFilter === "All" ||
      (orientationFilter === "Landscape" && !isPortrait) ||
      (orientationFilter === "Portrait" && isPortrait);

    const matchesStatus = statusFilter === "All" || asset.status === statusFilter;

    return matchesSearch && matchesType && matchesOrientation && matchesStatus;
  });

  const handleUploadSuccess = (newAsset: MediaAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0 py-6 px-8 space-y-6 overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
          <div>
            <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
              Media Library
            </h1>
            <p className="text-body text-app-muted mt-1">
              Manage looping signage media assets. Upload images, MP4 videos, and HTML5 templates.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SegmentedControl
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: "grid", label: "Grid thumbnails", icon: Grid },
                { value: "table", label: "Compact table list", icon: List },
              ]}
            />

            <Button variant="primary" size="sm" icon={Upload} onClick={() => setShowUploadModal(true)}>
              Upload Asset
            </Button>
          </div>
        </div>

        {/* Quota limit Indicator bar */}
        <Card
          size="widget"
          padded
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0"
        >
          <div className="flex items-center gap-2 text-body text-app-muted">
            <HardDrive className="w-4 h-4 shrink-0" />
            <span>Storage Space Allocation:</span>
            <span className="font-semibold text-app-text">112 GB of 250 GB Used</span>
          </div>
          <ProgressBar value={112} max={250} className="flex-1 max-w-md w-full md:mx-4" />
          <span className="text-caption font-semibold text-app-muted uppercase tracking-headline">
            44.8% Used · 138 GB free
          </span>
        </Card>

        {/* Query Filters Panel */}
        <Card
          size="widget"
          padded
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0"
        >
          <SearchInput
            placeholder="Search assets, uploaders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            icon={Filter}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by format"
          >
            <option value="All">All Formats</option>
            <option value="Video">Video (MP4)</option>
            <option value="Image">Image (JPG/PNG)</option>
            <option value="HTML5">HTML5 Widgets</option>
          </Select>

          <Select
            icon={Filter}
            value={orientationFilter}
            onChange={(e) => setOrientationFilter(e.target.value)}
            aria-label="Filter by orientation"
          >
            <option value="All">All Orientations</option>
            <option value="Landscape">Landscape (16:9)</option>
            <option value="Portrait">Portrait (9:16)</option>
          </Select>

          <Select
            icon={Filter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by transcode state"
          >
            <option value="All">All Transcode States</option>
            <option value="Ready">Ready</option>
            <option value="Transcoding">Transcoding</option>
            <option value="Failed">Failed</option>
          </Select>
        </Card>

        {/* Visual Render Zone */}
        <div className="flex-1">
          {isFirstLoad ? (
            viewMode === "grid" ? (
              <SkeletonCardGrid count={8} columns={4} label="Loading media…" />
            ) : (
              <Card size="panel" className="overflow-hidden">
                <SkeletonTable rows={6} cols={9} label="Loading media…" />
              </Card>
            )
          ) : viewMode === "grid" ? (
            <MediaGrid assets={filteredAssets} onSelectMedia={(a) => setSelectedAsset(a)} />
          ) : (
            <MediaTable assets={filteredAssets} onSelectMedia={(a) => setSelectedAsset(a)} />
          )}
        </div>
      </div>

      {/* Render Slide details drawer */}
      {selectedAsset && (
        <MediaPreviewDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onDeleteAsset={handleDeleteAsset}
        />
      )}

      {/* Render upload modal */}
      {showUploadModal && (
        <MediaUploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
