"use client";

import React, { useState } from "react";
import {
  X,
  RefreshCw,
  Power,
  MapPin,
  Calendar,
  AlertTriangle,
  History,
  HardDrive,
  Activity,
  Wifi,
  Sparkles,
  Zap,
  Ticket,
} from "lucide-react";
import { ScreenDevice } from "./screens-table";
import {
  Badge,
  Button,
  Card,
  DataField,
  EmptyState,
  IconButton,
  ProgressBar,
  StatusDot,
  Tabs,
  type Status,
} from "@/components/ui";

interface ScreensDetailDrawerProps {
  screen: ScreenDevice;
  onClose: () => void;
}

const DEVICE_STATUS: Record<ScreenDevice["status"], Status> = {
  Online: "online",
  Delayed: "warning",
  Offline: "error",
};

type TabId = "Overview" | "Playback" | "Schedule" | "Sensors" | "Alerts" | "Activity";

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "Overview", label: "Overview", icon: Activity },
  { id: "Playback", label: "Playback", icon: Sparkles },
  { id: "Schedule", label: "Schedule", icon: Calendar },
  { id: "Sensors", label: "Sensors", icon: Zap },
  { id: "Alerts", label: "Alerts & Logs", icon: AlertTriangle },
  { id: "Activity", label: "Activity", icon: History },
];

const playlistItems = [
  { name: "Breakfast_Combo_Landscape.jpg", meta: "Image · 8s · Fade transition" },
  { name: "Monsoon_Cold_Coffee_15s.mp4", meta: "Video (H.264) · 15s · Crossfade" },
  { name: "Rewards_QR_July.html", meta: "HTML5 widget · 20s · Cut" },
];

const sensors = [
  {
    name: "PIR Motion Detector (USB-1)",
    rule: "IF motion detected THEN trigger “Walk-in Offer”",
    value: "Motion: Yes",
    note: "Runs locally",
  },
  {
    name: "I2C Temperature Probe",
    rule: "IF temp < 18°C THEN show “Hot Coffee Favourites”",
    value: "17.6 °C",
    note: "Triggered",
  },
  {
    name: "Light Intensity Sensor",
    rule: "IF light < 80 lux THEN dim backlight to 45%",
    value: "68 Lux",
    note: "Dimmed",
  },
];

const schedule = [
  {
    time: "06:00 AM – 11:00 AM Daily",
    name: "Breakfast Menu Promo",
    meta: "Priority 30 · Fallback playlist linked",
    active: false,
  },
  {
    time: "11:00 AM – 04:00 PM Daily",
    name: "Lunch Combos Campaign",
    meta: "Priority 30 · Fallback playlist linked",
    active: false,
  },
  {
    time: "04:00 PM – 09:30 PM Daily",
    name: "Monsoon Café Promotions",
    meta: "Priority 40 · 21 active targets",
    active: true,
  },
];

const commandLog: { cmd: string; result: string; tone: "accent" | "danger" }[] = [
  { cmd: "[16:18:42] CMD: RESTART_DEVICE", result: "TIMEOUT", tone: "danger" },
  { cmd: "[16:04:12] CMD: SYNC_MANIFEST", result: "SUCCESS", tone: "accent" },
  { cmd: "[15:42:01] CMD: FORCE_HEARTBEAT", result: "SUCCESS", tone: "accent" },
];

const activity: { who: string; what: string; when: string; status: Status }[] = [
  { who: "Aarav Mehta", what: "forced a content deployment manifest.", when: "3:42 PM IST", status: "online" },
  { who: "Aarav Mehta", what: "issued a player reboot signal.", when: "3:18 PM IST", status: "online" },
  { who: "Sneha Iyer", what: "adjusted the PIR automation bounds.", when: "2:56 PM IST", status: "unknown" },
];

const DOT_TONE: Record<Status, string> = {
  online: "bg-app-accent-text",
  warning: "bg-app-warning",
  error: "bg-app-danger",
  unknown: "bg-app-muted",
};

export default function ScreensDetailDrawer({ screen, onClose }: ScreensDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabId>("Overview");
  const storagePct = parseInt(screen.storage, 10) || 0;

  return (
    <div className="w-108 bg-app-surface border-l border-app-border flex flex-col h-full font-sans shadow-2xl shrink-0 overflow-hidden relative">
      {/* Header */}
      <div className="p-5 border-b border-app-border flex justify-between items-start gap-3 shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="p-2 bg-app-accent-surface text-app-accent-text rounded-lg shrink-0 mt-0.5">
            <Wifi className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-heading text-h5 font-semibold tracking-headline text-app-text truncate">
              {screen.name}
            </h2>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <StatusDot status={DEVICE_STATUS[screen.status]} label={screen.status} />
              <span className="text-caption text-app-muted font-semibold truncate">{screen.group}</span>
            </div>
          </div>
        </div>
        <IconButton icon={X} onClick={onClose} aria-label="Close details" size="sm" />
      </div>

      {/* Tab Navigation */}
      <div className="shrink-0">
        <Tabs value={activeTab} onChange={setActiveTab} tabs={tabs} />
      </div>

      {/* Action shortcuts panel */}
      <div className="px-5 py-3 border-b border-app-border flex flex-wrap gap-2 shrink-0">
        <Button size="sm" variant="secondary" icon={RefreshCw}>Sync Now</Button>
        <Button size="sm" variant="secondary" icon={Power}>Reboot</Button>
        <Button size="sm" variant="secondary" icon={MapPin}>Edit Location</Button>
        <Button size="sm" variant="secondary" icon={Ticket}>Support Ticket</Button>
      </div>

      {/* Tab Contents Viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {activeTab === "Overview" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Card size="row" padded>
                <DataField label="Serial Number" value={`BS-${screen.model}-${screen.id}124`} />
              </Card>
              <Card size="row" padded>
                <DataField label="BrightSign Model" value={`${screen.model} Series`} />
              </Card>
            </div>

            <Card size="row" padded className="space-y-2">
              <div className="flex justify-between items-center gap-2">
                <span className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-headline text-app-muted">
                  <HardDrive className="w-3.5 h-3.5" />
                  Storage Partition (eMMC)
                </span>
                <span className="text-body font-semibold text-app-text">{screen.storage} / 32 GB</span>
              </div>
              <ProgressBar value={storagePct} tone={storagePct >= 90 ? "warning" : "accent"} />
            </Card>

            <Card size="row" padded className="space-y-3">
              <h4 className="text-body font-semibold text-app-text border-b border-app-border pb-2">
                Network &amp; Diagnostics
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-3">
                <DataField label="IP Address" value={`192.168.1.1${screen.id}`} />
                <DataField label="Connection Type" value="Ethernet (PoE+)" />
                <DataField label="Firmware version" value={`v${screen.firmware}`} />
                <div className="min-w-0">
                  <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
                    Uptime Ratio
                  </span>
                  <span className="block text-body font-semibold text-app-accent-text mt-0.5">
                    99.2% (30d)
                  </span>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === "Playback" && (
          <>
            <Card size="row" padded className="space-y-3">
              <div>
                <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
                  Active Content Loop
                </span>
                <span className="block text-body font-semibold text-app-accent-text mt-0.5 truncate">
                  {screen.content}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2 bg-app-surface-alt p-2 border border-app-border rounded-md">
                <span className="text-caption text-app-muted">Manifest File:</span>
                <span className="text-caption font-semibold text-app-text">mf_8f21c_ccd</span>
              </div>
            </Card>

            <div className="space-y-2">
              <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
                Playlist Content Items (55s loop)
              </span>
              {playlistItems.map((item) => (
                <Card key={item.name} size="row" padded className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-body font-semibold text-app-text truncate">{item.name}</span>
                    <span className="block text-caption text-app-muted mt-0.5">{item.meta}</span>
                  </div>
                  <Badge tone="accent">Downloaded</Badge>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "Schedule" && (
          <>
            <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
              Active Rotation Calendar (Today)
            </span>
            <div className="space-y-2">
              {schedule.map((s) => (
                <Card
                  key={s.name}
                  size="row"
                  padded
                  selected={s.active}
                  className={s.active ? "pl-5" : undefined}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="block text-caption font-semibold text-app-muted">{s.time}</span>
                      <h4 className="text-body font-semibold text-app-text mt-0.5">{s.name}</h4>
                    </div>
                    {s.active && (
                      <Badge tone="accent" variant="filled" uppercase>
                        Playing now
                      </Badge>
                    )}
                  </div>
                  <span className="block text-caption text-app-muted mt-1.5">{s.meta}</span>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "Sensors" && (
          <>
            <div className="flex items-center justify-between gap-2 border-b border-app-border pb-2">
              <span className="text-caption font-semibold uppercase tracking-headline text-app-muted">
                Connected Edge Sensors
              </span>
              <Badge tone="neutral" uppercase>Edge Execution</Badge>
            </div>
            <div className="space-y-2">
              {sensors.map((s) => (
                <Card key={s.name} size="row" padded className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-body font-semibold text-app-text truncate">{s.name}</span>
                    <span className="block text-caption text-app-muted mt-0.5">{s.rule}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-body font-semibold text-app-text">{s.value}</span>
                    <span className="block text-caption text-app-muted mt-0.5">{s.note}</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "Alerts" && (
          <>
            <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
              Incident History
            </span>

            {screen.alertsCount > 0 ? (
              <div className="p-3 bg-app-danger-surface border border-app-danger/30 rounded-lg flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-app-danger-text shrink-0 mt-0.5" />
                <div>
                  <span className="block text-body font-semibold text-app-danger-text">
                    Offline Warning Triggered
                  </span>
                  <span className="block text-caption text-app-muted mt-0.5">
                    Last heartbeat exceeded 90s interval. Diagnostic check requested.
                  </span>
                  <Button size="sm" variant="danger" className="mt-3">
                    Acknowledge Alert
                  </Button>
                </div>
              </div>
            ) : (
              <Card size="row">
                <EmptyState
                  icon={Wifi}
                  title="All clear"
                  description="No active device warnings or alerts."
                />
              </Card>
            )}

            <Card size="row" padded className="space-y-2">
              <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
                Device Command Log
              </span>
              <div className="space-y-1.5">
                {commandLog.map((row) => (
                  <div key={row.cmd} className="flex justify-between gap-2 text-caption">
                    <span className="text-app-muted truncate">{row.cmd}</span>
                    <span
                      className={`font-semibold shrink-0 ${
                        row.tone === "danger" ? "text-app-danger-text" : "text-app-accent-text"
                      }`}
                    >
                      {row.result}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === "Activity" && (
          <>
            <span className="block text-caption font-semibold uppercase tracking-headline text-app-muted">
              Operator Activity Feed
            </span>
            <div className="relative border-l border-app-border ml-2 pl-4 py-2 space-y-4">
              {activity.map((a) => (
                <div key={`${a.who}-${a.when}`} className="relative">
                  <span
                    className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full ${DOT_TONE[a.status]}`}
                  />
                  <p className="text-body">
                    <span className="font-semibold text-app-text">{a.who}</span>{" "}
                    <span className="text-app-muted">{a.what}</span>
                  </p>
                  <span className="block text-caption text-app-muted mt-0.5">{a.when}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
