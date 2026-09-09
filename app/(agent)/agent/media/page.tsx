"use client";

import React, { useState, useEffect } from "react";
import { Grid, List, Upload, HardDrive } from "lucide-react";
import MediaGrid, { MediaAsset } from "@/components/agent/media/media-grid";
import MediaTable from "@/components/agent/media/media-table";
import MediaUploadModal from "@/components/agent/media/media-upload-modal";
import MediaPreviewDrawer from "@/components/agent/media/media-preview-drawer";
import {
  Button,
  Card,
  CollectionPagination,
  CollectionToolbar,
  ProgressBar,
  SegmentedControl,
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
  const [sort, setSort] = useState("date-desc");
  const [groupBy, setGroupBy] = useState("none");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

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
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (groupBy === "type") return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
    if (groupBy === "status") return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    const difference = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sort === "date-asc" ? difference : -difference;
  });
  const totalPages = Math.max(1, Math.ceil(sortedAssets.length / pageSize));
  const visibleAssets = sortedAssets.slice((Math.min(page, totalPages) - 1) * pageSize, Math.min(page, totalPages) * pageSize);
  const resetPage = () => setPage(1);

  const handleUploadSuccess = (newAsset: MediaAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0 space-y-6 overflow-y-auto px-8 py-6 pb-24">
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
        <Card size="widget" padded className="shrink-0">
          <CollectionToolbar
            search={{ value: search, onChange: (value) => { setSearch(value); resetPage(); }, placeholder: "Search assets, uploaders…" }}
            filters={[
              { id: "type", label: "format", value: typeFilter, onChange: (value) => { setTypeFilter(value); resetPage(); }, options: [{ value: "All", label: "All formats" }, { value: "Video", label: "Video (MP4)" }, { value: "Image", label: "Image (JPG/PNG)" }, { value: "HTML5", label: "HTML5 widgets" }] },
              { id: "orientation", label: "orientation", value: orientationFilter, onChange: (value) => { setOrientationFilter(value); resetPage(); }, options: [{ value: "All", label: "All orientations" }, { value: "Landscape", label: "Landscape (16:9)" }, { value: "Portrait", label: "Portrait (9:16)" }] },
              { id: "status", label: "transcode state", value: statusFilter, onChange: (value) => { setStatusFilter(value); resetPage(); }, options: [{ value: "All", label: "All transcode states" }, { value: "Ready", label: "Ready" }, { value: "Transcoding", label: "Transcoding" }, { value: "Failed", label: "Failed" }] },
            ]}
            sort={{ value: sort, onChange: (value) => { setSort(value); resetPage(); }, options: [{ value: "date-desc", label: "Upload date: newest" }, { value: "date-asc", label: "Upload date: oldest" }, { value: "name-asc", label: "Name: A–Z" }, { value: "name-desc", label: "Name: Z–A" }] }}
            groupBy={{ value: groupBy, onChange: (value) => { setGroupBy(value); resetPage(); }, options: [{ value: "none", label: "No grouping" }, { value: "type", label: "Group by type" }, { value: "status", label: "Group by status" }] }}
            hasActiveControls={Boolean(search) || typeFilter !== "All" || orientationFilter !== "All" || statusFilter !== "All" || sort !== "date-desc" || groupBy !== "none"}
            onClear={() => { setSearch(""); setTypeFilter("All"); setOrientationFilter("All"); setStatusFilter("All"); setSort("date-desc"); setGroupBy("none"); resetPage(); }}
          />
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
            <MediaGrid assets={visibleAssets} onSelectMedia={(a) => setSelectedAsset(a)} />
          ) : (
            <MediaTable assets={visibleAssets} onSelectMedia={(a) => setSelectedAsset(a)} />
          )}
        </div>
        {!isFirstLoad && <CollectionPagination page={page} pageSize={pageSize} total={sortedAssets.length} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); resetPage(); }} pageSizeOptions={[12, 24, 48, 96]} />}
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
