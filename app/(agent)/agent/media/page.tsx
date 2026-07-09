"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Grid,
  List,
  Upload,
  HardDrive,
  Filter,
  ChevronDown
} from "lucide-react";
import MediaGrid, { MediaAsset } from "@/components/agent/media/media-grid";
import MediaTable from "@/components/agent/media/media-table";
import MediaUploadModal from "@/components/agent/media/media-upload-modal";
import MediaPreviewDrawer from "@/components/agent/media/media-preview-drawer";

const initialAssets: MediaAsset[] = [
  {
    id: "media-1",
    name: "Monsoon_Cold_Coffee_15s.mp4",
    type: "Video",
    dimensions: "1920×1080",
    duration: "15s",
    size: "42.8 MB",
    status: "Ready",
    uploader: "Aarav Mehta",
    date: "2 July 2026, 3:42 PM",
    usedInPlaylists: ["Monsoon Café Promotions"]
  },
  {
    id: "media-2",
    name: "Breakfast_Combo_Landscape.jpg",
    type: "Image",
    dimensions: "1920×1080",
    size: "4.2 MB",
    status: "Ready",
    uploader: "Sneha Iyer",
    date: "1 July 2026, 11:24 AM",
    usedInPlaylists: ["Breakfast Menu"]
  },
  {
    id: "media-3",
    name: "Rewards_QR_July.html",
    type: "HTML5",
    dimensions: "Flexible",
    size: "8.7 MB",
    status: "Ready",
    uploader: "Rohan Das",
    date: "30 June 2026, 10:15 AM",
    usedInPlaylists: ["Monsoon Café Promotions"]
  },
  {
    id: "media-4",
    name: "Mango_Frappe_Promo_10s.mp4",
    type: "Video",
    dimensions: "1080×1920",
    duration: "10s",
    size: "31.6 MB",
    status: "Transcoding",
    progress: 72,
    uploader: "Aarav Mehta",
    date: "Today, 4:28 PM",
    usedInPlaylists: []
  },
  {
    id: "media-5",
    name: "Store_Menu_July_v3.png",
    type: "Image",
    dimensions: "2160×3840",
    size: "12.4 MB",
    status: "Ready",
    uploader: "System",
    date: "29 June 2026, 9:00 AM",
    usedInPlaylists: ["Lunch Combos"]
  },
  {
    id: "media-6",
    name: "Independence_Day_Teaser.mp4",
    type: "Video",
    dimensions: "1920×1080",
    duration: "20s",
    size: "86.1 MB",
    status: "Failed",
    reason: "unsupported audio codec",
    uploader: "Rohan Das",
    date: "Today, 1:12 PM",
    usedInPlaylists: []
  }
];

export default function AgentMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [orientationFilter, setOrientationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetch("/api/media")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Map backend attributes to frontend UI requirements if needed
          setAssets(data);
        }
      })
      .catch(err => console.error("Failed to load assets:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter application
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                          asset.uploader.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "All" || asset.type === typeFilter;
    
    // Check orientation: Landscape starts with 1920 or is Flexible, Portrait starts with 1080 or 2160 (if height is bigger)
    const isPortrait = asset.dimensions?.startsWith("1080") || asset.dimensions?.startsWith("2160");
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
      <div className="flex-1 flex flex-col min-w-0 p-6 space-y-6 overflow-y-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6EC] dark:border-[#283243] pb-5 shrink-0">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold text-[#18202B] dark:text-[#F2F5F8] tracking-tight">
              Media Library
            </h1>
            <p className="text-xs text-[#657080] dark:text-[#9AA7B7]">
              Manage looping signage media assets. Upload images, MP4 videos, and HTML5 templates.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-0.5 p-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-white dark:bg-[#111722] shadow-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#F6F7F9] dark:bg-[#171F2C] text-[#2859D9] dark:text-[#6F96FF]"
                    : "text-zinc-400 hover:text-zinc-650"
                }`}
                title="Grid Thumbnails"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#F6F7F9] dark:bg-[#171F2C] text-[#2859D9] dark:text-[#6F96FF]"
                    : "text-zinc-400 hover:text-zinc-650"
                }`}
                title="Compact Table List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Upload File action */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Asset</span>
            </button>
          </div>
        </div>

        {/* Quota limit Indicator bar */}
        <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-zinc-550 dark:text-zinc-400 text-xs font-semibold">
            <HardDrive className="w-4 h-4 text-[#657080] shrink-0" />
            <span>Storage Space Allocation:</span>
            <span className="font-bold text-zinc-800 dark:text-white">112 GB of 250 GB Used</span>
          </div>
          <div className="flex-1 max-w-md w-full md:mx-4">
            <div className="w-full bg-[#E2E6EC] dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#2859D9] dark:bg-[#6F96FF] h-full rounded-full" style={{ width: "44.8%" }} />
            </div>
          </div>
          <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
            44.8% Used · 138 GB free
          </span>
        </div>

        {/* Query Filters Panel */}
        <div className="p-4 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search assets, uploaders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] placeholder-zinc-450 focus:outline-none"
            />
          </div>

          {/* Type Selector */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Formats</option>
              <option value="Video">Video (MP4)</option>
              <option value="Image">Image (JPG/PNG)</option>
              <option value="HTML5">HTML5 Widgets</option>
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Orientation Selector */}
          <div className="relative">
            <select
              value={orientationFilter}
              onChange={(e) => setOrientationFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Orientations</option>
              <option value="Landscape">Landscape (16:9)</option>
              <option value="Portrait">Portrait (9:16)</option>
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Status Selector */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Transcode States</option>
              <option value="Ready">Ready</option>
              <option value="Transcoding">Transcoding</option>
              <option value="Failed">Failed</option>
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Visual Render Zone */}
        <div className="flex-1">
          {viewMode === "grid" ? (
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
