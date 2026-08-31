"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  RefreshCw,
  Power,
  Info,
  FileSpreadsheet,
  AlertTriangle,
  PlaySquare,
  AlertCircle,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Modal,
  ProgressBar,
  StatusDot,
  Td,
  Th,
  Tr,
  type Status,
} from "@/components/ui";

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
  installId?: string | null;
  platform?: "LINUX" | "WINDOWS" | null;
  playerRegistrationId?: string | null;
}

/** Device status → the portal-wide status vocabulary. */
const DEVICE_STATUS: Record<ScreenDevice["status"], Status> = {
  Online: "online",
  Delayed: "warning",
  Offline: "error",
};

interface ScreensTableProps {
  screens: ScreenDevice[];
  onSelectScreen: (screen: ScreenDevice) => void;
  selectedScreenId: string | null;
}

export default function ScreensTable({
  screens,
  onSelectScreen,
  selectedScreenId,
}: ScreensTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: "restart" | "sync" | "bulk-sync" | "bulk-assign" | "none";
    screenName?: string;
    ids?: string[];
  }>({ show: false, type: "none" });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? screens.map((s) => s.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const executeAction = (action: string, targetName: string) => {
    alert(`Action "${action}" triggered for ${targetName}`);
    setConfirmModal({ show: false, type: "none" });
  };

  const confirmTitle = {
    restart: "Confirm Remote Restart",
    sync: "Confirm Content Sync",
    "bulk-sync": "Confirm Bulk Sync",
    "bulk-assign": "Confirm Bulk Assignment",
    none: "",
  }[confirmModal.type];

  const confirmBody = {
    restart: `Are you sure you want to trigger a remote hard-reboot command to player “${confirmModal.screenName}”? This will cause a temporary screen blackout for 45–60s.`,
    sync: `Are you sure you want to force manifest deployment update to player “${confirmModal.screenName}”?`,
    "bulk-sync": `Force manifest updates on all ${confirmModal.ids?.length} selected screens?`,
    "bulk-assign": `Assign new content loop playlists to all ${confirmModal.ids?.length} selected screens?`,
    none: "",
  }[confirmModal.type];

  return (
    <Card size="panel" className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      {/* Bulk Action Controls */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-app-accent-surface border-b border-app-border flex items-center justify-between gap-3 animate-fadeIn">
          <span className="text-body font-semibold text-app-accent-text">
            {selectedIds.length} screens selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={PlaySquare}
              onClick={() => setConfirmModal({ show: true, type: "bulk-assign", ids: selectedIds })}
            >
              Assign Playlist
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={RefreshCw}
              onClick={() => setConfirmModal({ show: true, type: "bulk-sync", ids: selectedIds })}
            >
              Sync Manifest
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={FileSpreadsheet}
              onClick={() => executeAction("Bulk Export", `${selectedIds.length} screens`)}
            >
              Export Selected
            </Button>
          </div>
        </div>
      )}

      {/* Main Table area */}
      <div className="overflow-x-auto flex-1 min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-app-surface-alt select-none">
              <Th className="w-10 text-center">
                <Checkbox
                  checked={selectedIds.length === screens.length && screens.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all screens"
                />
              </Th>
              <Th>Screen Name</Th>
              <Th>Store/Location</Th>
              <Th>Screen Group</Th>
              <Th>Device Model</Th>
              <Th>Status</Th>
              <Th>Current Content</Th>
              <Th>Firmware</Th>
              <Th>Storage</Th>
              <Th>Last Heartbeat</Th>
              <Th>Active Alerts</Th>
              <Th className="w-12 text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {screens.map((screen) => {
              const isSelected = selectedScreenId === screen.id;
              const isRowChecked = selectedIds.includes(screen.id);
              const storagePct = parseInt(screen.storage, 10) || 0;

              return (
                <Tr key={screen.id} interactive selected={isSelected}>
                  <Td className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isRowChecked}
                      onChange={(e) => handleSelectOne(screen.id, e.target.checked)}
                      aria-label={`Select ${screen.name}`}
                    />
                  </Td>
                  <Td className="font-semibold" onClick={() => onSelectScreen(screen)}>
                    {screen.name}
                  </Td>
                  <Td className="text-app-muted" onClick={() => onSelectScreen(screen)}>
                    {screen.location}
                  </Td>
                  <Td className="text-app-muted" onClick={() => onSelectScreen(screen)}>
                    {screen.group}
                  </Td>
                  <Td className="text-app-muted" onClick={() => onSelectScreen(screen)}>
                    {screen.model}
                  </Td>

                  <Td onClick={() => onSelectScreen(screen)}>
                    <StatusDot status={DEVICE_STATUS[screen.status]} label={screen.status} />
                  </Td>

                  <Td
                    className="text-app-accent-text font-semibold truncate max-w-[150px]"
                    onClick={() => onSelectScreen(screen)}
                  >
                    {screen.content}
                  </Td>
                  <Td className="text-app-muted" onClick={() => onSelectScreen(screen)}>
                    {screen.firmware}
                  </Td>

                  <Td className="w-28" onClick={() => onSelectScreen(screen)}>
                    <div className="flex items-center gap-2">
                      <ProgressBar
                        value={storagePct}
                        tone={storagePct >= 90 ? "warning" : "neutral"}
                        className="flex-1"
                      />
                      <span className="text-caption font-semibold text-app-muted shrink-0">
                        {screen.storage}
                      </span>
                    </div>
                  </Td>

                  <Td className="text-app-muted" onClick={() => onSelectScreen(screen)}>
                    {screen.heartbeat}
                  </Td>

                  <Td onClick={() => onSelectScreen(screen)}>
                    {screen.alertsCount > 0 ? (
                      <Badge tone={screen.alertsSeverity === "critical" ? "danger" : "warning"}>
                        <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden />
                        {screen.alertsCount} Alert
                      </Badge>
                    ) : (
                      <span className="text-caption text-app-muted">—</span>
                    )}
                  </Td>

                  {/* Row Actions Menu */}
                  <Td className="text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === screen.id ? null : screen.id)}
                      aria-label={`Actions for ${screen.name}`}
                      aria-expanded={activeMenuId === screen.id}
                      className="p-1 rounded-md text-app-muted hover:bg-app-surface-alt hover:text-app-text transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {activeMenuId === screen.id && (
                      <div className="absolute right-8 top-2 w-44 bg-app-surface border border-app-border rounded-lg shadow-xs py-1.5 z-10 text-left animate-fadeIn">
                        <button
                          onClick={() => {
                            onSelectScreen(screen);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-body font-semibold text-app-text hover:bg-app-surface-alt flex items-center gap-2 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-app-muted" />
                          Open Details
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({ show: true, type: "sync", screenName: screen.name });
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-body font-semibold text-app-text hover:bg-app-surface-alt flex items-center gap-2 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-app-muted" />
                          Force Sync
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({ show: true, type: "restart", screenName: screen.name });
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-body font-semibold text-app-danger-text hover:bg-app-surface-alt flex items-center gap-2 cursor-pointer"
                        >
                          <Power className="w-3.5 h-3.5" />
                          Remote Restart
                        </button>
                      </div>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, type: "none" })}
        title={confirmTitle}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModal({ show: false, type: "none" })}>
              Cancel
            </Button>
            <Button
              variant={confirmModal.type === "restart" ? "danger" : "primary"}
              onClick={() =>
                executeAction(
                  confirmModal.type.toUpperCase(),
                  confirmModal.screenName || `${confirmModal.ids?.length} selected screens`,
                )
              }
            >
              Confirm
            </Button>
          </>
        }
      >
        <div className="flex gap-3">
          <span className="w-10 h-10 rounded-full bg-app-warning-surface text-app-warning-text flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </span>
          <p className="text-body text-app-muted">{confirmBody}</p>
        </div>
      </Modal>
    </Card>
  );
}
