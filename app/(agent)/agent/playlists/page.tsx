"use client";

import React, { useState } from "react";
import { Send, Eye, Save, Sparkles, X } from "lucide-react";
import SearchableLibrary, { LibraryItem } from "@/components/agent/playlists/searchable-library";
import PlaylistTimeline, { PlaylistItem } from "@/components/agent/playlists/playlist-timeline";
import PlaylistProperties from "@/components/agent/playlists/playlist-properties";
import PublishModal from "@/components/agent/playlists/publish-modal";

const initialPlaylistItems: PlaylistItem[] = [
  {
    uuid: "item-1",
    id: "lib-2",
    name: "Breakfast_Combo_Landscape.jpg",
    type: "Image",
    dimensions: "1920×1080",
    duration: 8,
    transition: "Fade",
    transitionDuration: 1
  },
  {
    uuid: "item-2",
    id: "lib-1",
    name: "Monsoon_Cold_Coffee_15s.mp4",
    type: "Video",
    dimensions: "1920×1080",
    duration: 15,
    transition: "Crossfade",
    transitionDuration: 1.5
  },
  {
    uuid: "item-3",
    id: "lib-3",
    name: "Rewards_QR_July.html",
    type: "HTML5",
    dimensions: "Flexible",
    duration: 20,
    transition: "Cut",
    transitionDuration: 0
  },
  {
    uuid: "item-4",
    id: "lib-5",
    name: "Store_Menu_July_v3.png",
    type: "Image",
    dimensions: "2160×3840",
    duration: 12,
    transition: "Fade",
    transitionDuration: 1
  }
];

export default function AgentPlaylistsPage() {
  const [playlistName, setPlaylistName] = useState("Monsoon Café Promotions");
  const [orientation, setOrientation] = useState<"Landscape" | "Portrait">("Landscape");
  const [items, setItems] = useState<PlaylistItem[]>(initialPlaylistItems);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  
  // State indicators
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Unsaved">("Saved");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Handlers
  const handleAddItem = (libItem: LibraryItem) => {
    const newItem: PlaylistItem = {
      uuid: `item-${Date.now()}`,
      id: libItem.id,
      name: libItem.name,
      type: libItem.type,
      dimensions: libItem.dimensions,
      duration: libItem.duration || 10,
      transition: "Fade",
      transitionDuration: 1
    };
    setItems([...items, newItem]);
    setSelectedIndex(items.length);
    setSaveStatus("Unsaved");
  };

  const handleUpdateItem = (idx: number, updated: PlaylistItem) => {
    setItems(items.map((item, i) => (i === idx ? updated : item)));
    setSaveStatus("Unsaved");
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
    setSelectedIndex(null);
    setSaveStatus("Unsaved");
  };

  const handleMoveItem = (idx: number, dir: "up" | "down") => {
    const newItems = [...items];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    const temp = newItems[idx];
    newItems[idx] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
    setSelectedIndex(targetIdx);
    setSaveStatus("Unsaved");
  };

  const handleDuplicateItem = (idx: number) => {
    const target = items[idx];
    const duplicated: PlaylistItem = {
      ...target,
      uuid: `item-${Date.now()}`
    };
    const newItems = [...items];
    newItems.splice(idx + 1, 0, duplicated);
    setItems(newItems);
    setSelectedIndex(idx + 1);
    setSaveStatus("Unsaved");
  };

  const handleSaveDraft = () => {
    setSaveStatus("Saved");
    alert("Draft changes saved successfully.");
  };

  const handleConfirmPublish = () => {
    setShowPublishModal(false);
    setSaveStatus("Saved");
    alert(`Manifest updated and deployed to 21 screens active in the Bengaluru Region!`);
  };

  const handleRestoreVersion = (version: any) => {
    alert(`Restored playlist loop to version ${version.version}.`);
    setSaveStatus("Unsaved");
  };

  const totalDuration = items.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      
      {/* Top Header Bar */}
      <div className="h-16 border-b border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <input
              type="text"
              value={playlistName}
              onChange={(e) => {
                setPlaylistName(e.target.value);
                setSaveStatus("Unsaved");
              }}
              className="text-sm font-bold text-zinc-900 dark:text-white bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-[#2859D9] focus:outline-none py-0.5 max-w-[240px]"
            />
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold px-1.5 py-0.2 rounded uppercase">
                {orientation} Layout
              </span>
              <span className="text-[9px] text-zinc-400 font-semibold">
                {items.length} files · Loop {totalDuration}s
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold ${
            saveStatus === "Saved" ? "text-emerald-500" : "text-amber-500"
          }`}>
            ● {saveStatus === "Saved" ? "Draft Saved" : "Unsaved Changes"}
          </span>

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-650 dark:text-zinc-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-650 dark:text-zinc-350 transition-colors shadow-2xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Canvas</span>
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] px-3.5 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Loop</span>
          </button>
        </div>
      </div>

      {/* Main Workspace split */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Side: searchable asset list */}
        <SearchableLibrary onAddItem={handleAddItem} />

        {/* Center Side: timeline sequencing grid */}
        <PlaylistTimeline
          items={items}
          selectedIndex={selectedIndex}
          onSelectItem={(idx) => setSelectedIndex(idx)}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onMoveItem={handleMoveItem}
          onDuplicateItem={handleDuplicateItem}
          orientation={orientation}
        />

        {/* Right Side: properties and settings */}
        <PlaylistProperties
          selectedItem={selectedIndex !== null ? items[selectedIndex] : null}
          onUpdateItem={(updated) => selectedIndex !== null && handleUpdateItem(selectedIndex, updated)}
          orientation={orientation}
          onUpdateOrientation={(o) => {
            setOrientation(o);
            setSaveStatus("Unsaved");
          }}
          onRestoreVersion={handleRestoreVersion}
        />

      </div>

      {/* Publish validation modal overlay */}
      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          onConfirm={handleConfirmPublish}
          screensCount={21}
        />
      )}

      {/* Visual Canvas loop preview modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fadeIn font-sans p-6">
          <div className="w-full max-w-4xl flex flex-col gap-4">
            <div className="flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6F96FF]">Loop Preview Canvas</span>
                <span className="text-sm font-semibold">{playlistName} ({totalDuration}s Loop)</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Visual simulation frame based on orientation choice */}
            <div className="flex-1 bg-[#111722] border border-zinc-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center p-8 min-h-[450px]">
              <div
                className={`bg-zinc-950 border border-zinc-700 shadow-2xl flex flex-col items-center justify-center text-center p-4 relative overflow-hidden transition-all duration-300 ${
                  orientation === "Landscape" ? "w-full max-w-2xl aspect-video" : "h-full max-h-[380px] aspect-[9/16]"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-950/20 text-[#6F96FF] border border-zinc-800 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Canvas Video Loop Playing</span>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[280px]">
                  Looping sequences of {items.length} tracks. Transitions (Fade/Crossfade/Cut) playing at loop endpoints.
                </p>
                <div className="absolute bottom-4 left-4 bg-zinc-900/90 text-white border border-zinc-800 px-2.5 py-1 rounded text-[9px] font-bold">
                  Orientation Mode: {orientation}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
