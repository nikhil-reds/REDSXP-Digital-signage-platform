"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  RefreshCw,
  Power,
  Layers,
  FileDown,
  Info,
  Sliders,
  Terminal,
  FileSpreadsheet,
  AlertTriangle,
  PlaySquare,
  AlertCircle
} from "lucide-react";

export interface ScreenDevice {
  id: string;
  name: string;
  location: string;
  group: string;
  model: string;
  status: "Online" | "Delayed" | "Offline";
  content: string;
  firmware: string;
  storage: string;
  heartbeat: string;
  alertsCount: number;
  alertsSeverity?: "critical" | "high" | "medium" | "none";
}

interface ScreensTableProps {
  screens: ScreenDevice[];
  onSelectScreen: (screen: ScreenDevice) => void;
  selectedScreenId: string | null;
}

export default function ScreensTable({ screens, onSelectScreen, selectedScreenId }: ScreensTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Modal Confirmations
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: "restart" | "sync" | "bulk-sync" | "bulk-assign" | "none";
    screenName?: string;
    ids?: string[];
  }>({ show: false, type: "none" });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(screens.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  const executeAction = (action: string, targetName: string) => {
    alert(`Action "${action}" triggered for ${targetName}`);
    setConfirmModal({ show: false, type: "none" });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl overflow-hidden shadow-xs relative">
      
      {/* Bulk Action Controls */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-3 transition-all animate-fadeIn">
          <span className="text-xs font-bold text-[#2859D9] dark:text-[#6F96FF]">
            {selectedIds.length} screens selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmModal({ show: true, type: "bulk-assign", ids: selectedIds })}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <PlaySquare className="w-3 h-3 text-[#2859D9] dark:text-[#6F96FF]" />
              Assign Playlist
            </button>
            <button
              onClick={() => setConfirmModal({ show: true, type: "bulk-sync", ids: selectedIds })}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-emerald-500" />
              Sync Manifest
            </button>
            <button
              onClick={() => executeAction("Bulk Export", `${selectedIds.length} screens`)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-[#E2E6EC] dark:border-[#283243] rounded text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3 h-3 text-purple-500" />
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Table area */}
      <div className="overflow-x-auto flex-1 min-h-[400px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F6F7F9] dark:bg-[#171F2C]/50 text-[#657080] dark:text-[#9AA7B7] font-bold border-b border-[#E2E6EC] dark:border-[#283243] select-none">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === screens.length && screens.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-[#E2E6EC] dark:border-[#283243] focus:ring-[#2859D9]"
                />
              </th>
              <th className="p-3.5">Screen Name</th>
              <th className="p-3.5">Store/Location</th>
              <th className="p-3.5">Screen Group</th>
              <th className="p-3.5">Device Model</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Current Content</th>
              <th className="p-3.5">Firmware</th>
              <th className="p-3.5">Storage</th>
              <th className="p-3.5">Last Heartbeat</th>
              <th className="p-3.5">Active Alerts</th>
              <th className="p-3.5 w-12 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6EC] dark:divide-[#283243]">
            {screens.map((screen) => {
              const isSelected = selectedScreenId === screen.id;
              const isRowChecked = selectedIds.includes(screen.id);

              return (
                <tr
                  key={screen.id}
                  className={`hover:bg-[#F6F7F9]/30 dark:hover:bg-[#171F2C]/10 transition-all cursor-pointer ${
                    isSelected ? "bg-blue-50/10 dark:bg-blue-950/5 font-medium" : ""
                  }`}
                >
                  <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isRowChecked}
                      onChange={(e) => handleSelectOne(screen.id, e.target.checked)}
                      className="rounded border-[#E2E6EC] dark:border-[#283243] focus:ring-[#2859D9]"
                    />
                  </td>
                  <td
                    className="p-3.5 font-bold text-[#18202B] dark:text-[#F2F5F8] hover:text-[#2859D9] dark:hover:text-[#6F96FF]"
                    onClick={() => onSelectScreen(screen)}
                  >
                    {screen.name}
                  </td>
                  <td className="p-3.5 text-zinc-550 dark:text-zinc-400" onClick={() => onSelectScreen(screen)}>
                    {screen.location}
                  </td>
                  <td className="p-3.5 text-zinc-500" onClick={() => onSelectScreen(screen)}>
                    {screen.group}
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-zinc-450" onClick={() => onSelectScreen(screen)}>
                    {screen.model}
                  </td>
                  
                  {/* Status chip */}
                  <td className="p-3.5" onClick={() => onSelectScreen(screen)}>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                        screen.status === "Online"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50"
                          : screen.status === "Delayed"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100/50"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          screen.status === "Online"
                            ? "bg-emerald-500"
                            : screen.status === "Delayed"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      {screen.status}
                    </span>
                  </td>
                  
                  <td className="p-3.5 text-[#2859D9] dark:text-[#6F96FF] font-semibold truncate max-w-[150px]" onClick={() => onSelectScreen(screen)}>
                    {screen.content}
                  </td>
                  <td className="p-3.5 text-zinc-400 font-mono text-[10px]" onClick={() => onSelectScreen(screen)}>
                    {screen.firmware}
                  </td>
                  
                  {/* Storage percent */}
                  <td className="p-3.5 w-24" onClick={() => onSelectScreen(screen)}>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            parseInt(screen.storage) >= 90 ? "bg-amber-500" : "bg-zinc-500"
                          }`}
                          style={{ width: screen.storage }}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-zinc-500 shrink-0">
                        {screen.storage}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-3.5 text-zinc-500" onClick={() => onSelectScreen(screen)}>
                    {screen.heartbeat}
                  </td>

                  {/* Active Alerts */}
                  <td className="p-3.5" onClick={() => onSelectScreen(screen)}>
                    {screen.alertsCount > 0 ? (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-sm font-bold border inline-flex items-center gap-1 ${
                          screen.alertsSeverity === "critical"
                            ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-100/50"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50"
                        }`}
                      >
                        <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                        <span>{screen.alertsCount} Alert</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-400">—</span>
                    )}
                  </td>

                  {/* Row Actions Menu */}
                  <td className="p-3.5 text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === screen.id ? null : screen.id)}
                      className="p-1 rounded-md text-zinc-400 hover:bg-[#F6F7F9] dark:hover:bg-[#171F2C] hover:text-[#18202B] dark:hover:text-[#F2F5F8] transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    
                    {activeMenuId === screen.id && (
                      <div className="absolute right-8 top-2 w-40 bg-white dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] rounded-lg shadow-lg py-1.5 z-10 font-sans text-left animate-fadeIn">
                        <button
                          onClick={() => {
                            onSelectScreen(screen);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-350 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                        >
                          <Info className="w-3 h-3 text-[#2859D9] dark:text-[#6F96FF]" />
                          Open Details
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({ show: true, type: "sync", screenName: screen.name });
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-350 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 text-emerald-500" />
                          Force Sync
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({ show: true, type: "restart", screenName: screen.name });
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                        >
                          <Power className="w-3 h-3 text-red-500" />
                          Remote Restart
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal Overlay */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] p-6 rounded-xl w-96 max-w-full shadow-2xl text-center font-sans space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mx-auto border border-amber-100 dark:border-amber-900/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">
                {confirmModal.type === "restart" && "Confirm Remote Restart"}
                {confirmModal.type === "sync" && "Confirm Content Sync"}
                {confirmModal.type === "bulk-sync" && "Confirm Bulk Sync"}
                {confirmModal.type === "bulk-assign" && "Confirm Bulk Assignment"}
              </h3>
              <p className="text-xs text-[#657080] dark:text-[#9AA7B7] leading-relaxed">
                {confirmModal.type === "restart" && `Are you sure you want to trigger a remote hard-reboot command to player "${confirmModal.screenName}"? This will cause a temporary screen blackout for 45-60s.`}
                {confirmModal.type === "sync" && `Are you sure you want to force manifest deployment update to player "${confirmModal.screenName}"?`}
                {confirmModal.type === "bulk-sync" && `Force manifest updates on all ${confirmModal.ids?.length} selected screens?`}
                {confirmModal.type === "bulk-assign" && `Assign new content loop playlists to all ${confirmModal.ids?.length} selected screens?`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmModal({ show: false, type: "none" })}
                className="flex-1 py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = confirmModal.screenName || `${confirmModal.ids?.length} selected screens`;
                  executeAction(confirmModal.type.toUpperCase(), target);
                }}
                className="flex-1 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
