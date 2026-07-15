"use client";

import React, { useState } from "react";
import {
  X,
  RefreshCw,
  Power,
  Layers,
  MapPin,
  Calendar,
  AlertTriangle,
  History,
  HardDrive,
  Activity,
  User,
  ExternalLink,
  Wifi,
  Sliders,
  Sparkles,
  Zap,
  Ticket
} from "lucide-react";
import { ScreenDevice } from "./screens-table";

interface ScreensDetailDrawerProps {
  screen: ScreenDevice;
  onClose: () => void;
}

export default function ScreensDetailDrawer({ screen, onClose }: ScreensDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { id: "Overview", name: "Overview", icon: Activity },
    { id: "Playback", name: "Playback", icon: Sparkles },
    { id: "Schedule", name: "Schedule", icon: Calendar },
    { id: "Sensors", name: "Sensors", icon: Zap },
    { id: "Alerts", name: "Alerts & Logs", icon: AlertTriangle },
    { id: "Activity", name: "Activity", icon: History }
  ];

  return (
    <div className="w-108 bg-white dark:bg-[#111722] border-l border-[#E2E6EC] dark:border-[#283243] flex flex-col h-full font-sans shadow-2xl shrink-0 overflow-hidden relative">
      
      {/* Header */}
      <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-start bg-[#F6F7F9]/50 dark:bg-[#171F2C]/30">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-[#2859D9] dark:text-[#6F96FF] rounded-lg shrink-0 mt-0.5">
            <Wifi className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#18202B] dark:text-[#F2F5F8] leading-tight truncate">
              {screen.name}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${
                  screen.status === "Online"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100/50"
                    : screen.status === "Delayed"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100/50"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100/50"
                }`}
              >
                {screen.status}
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold truncate">
                {screen.group}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#171F2C]/50 px-2 py-1 overflow-x-auto select-none scrollbar-none shrink-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-[10px] font-bold rounded-md flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white dark:bg-[#111722] text-[#2859D9] dark:text-[#6F96FF] shadow-xs border border-[#E2E6EC] dark:border-[#283243]"
                  : "text-zinc-500 hover:text-[#18202B] dark:text-[#9AA7B7] dark:hover:text-[#F2F5F8]"
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Action shortcuts panel */}
      <div className="px-5 py-3 border-b border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-wrap gap-2 shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs">
          <RefreshCw className="w-3 h-3 text-[#2859D9]" />
          Sync Now
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs">
          <Power className="w-3 h-3 text-red-500" />
          Reboot
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs">
          <MapPin className="w-3 h-3 text-amber-500" />
          Edit Location
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-[#F6F7F9] dark:hover:bg-zinc-800 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs">
          <Ticket className="w-3 h-3 text-purple-500" />
          Support Ticket
        </button>
      </div>

      {/* Tab Contents Viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-zinc-600 dark:text-zinc-300">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "Overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl">
                <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Serial Number</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-1 block font-mono">BS-{screen.model}-{screen.id}124</span>
              </div>
              <div className="p-3 border border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl">
                <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">BrightSign Model</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-1 block font-mono">{screen.model} Series</span>
              </div>
            </div>

            <div className="p-3.5 border border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#657080]" />
                  Storage Partition (eMMC)
                </span>
                <span className="font-mono text-zinc-800 dark:text-zinc-100">{screen.storage} / 32 GB</span>
              </div>
              <div className="w-full bg-[#E2E6EC] dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#2859D9] dark:bg-[#6F96FF] h-full rounded-full" style={{ width: screen.storage }} />
              </div>
            </div>

            <div className="p-4 border border-[#E2E6EC] dark:border-[#283243] rounded-xl space-y-3.5 bg-zinc-50/10 dark:bg-[#171F2C]/10">
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs border-b border-[#E2E6EC] dark:border-[#283243] pb-2">
                Network & Diagnostics
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2.5">
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold uppercase">IP Address</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5 block">192.168.1.1{screen.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold uppercase">Connection Type</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block">Ethernet (PoE+)</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold uppercase">Firmware version</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 block font-mono">v{screen.firmware}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold uppercase">Uptime Ratio</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-500 mt-0.5 block">99.2% (30d)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLAYBACK */}
        {activeTab === "Playback" && (
          <div className="space-y-4">
            <div className="p-4 border border-[#E2E6EC] dark:border-[#283243] rounded-xl bg-zinc-50/10 dark:bg-[#171F2C]/10 space-y-3">
              <div>
                <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Active Content Loop</span>
                <span className="font-bold text-[#2859D9] dark:text-[#6F96FF] text-sm mt-0.5 block truncate">{screen.content}</span>
              </div>
              
              <div className="flex justify-between items-center text-[10px] bg-white dark:bg-[#111722] p-2 border border-[#E2E6EC] dark:border-[#283243] rounded-md text-zinc-500">
                <span>Manifest File:</span>
                <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">mf_8f21c_ccd</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">
                Playlist Content Items (55s loop)
              </span>
              
              <div className="space-y-2">
                <div className="p-3 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="block font-bold text-zinc-800 dark:text-zinc-200">Breakfast_Combo_Landscape.jpg</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Image · 8s · Fade transition</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 px-2 py-0.5 rounded-sm shrink-0">Downloaded</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="block font-bold text-zinc-800 dark:text-zinc-200">Monsoon_Cold_Coffee_15s.mp4</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Video (H.264) · 15s · Crossfade</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 px-2 py-0.5 rounded-sm shrink-0">Downloaded</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="block font-bold text-zinc-800 dark:text-zinc-200">Rewards_QR_July.html</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">HTML5 widget · 20s · Cut</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 px-2 py-0.5 rounded-sm shrink-0">Downloaded</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE */}
        {activeTab === "Schedule" && (
          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">
              Active Rotation Calendar (Today)
            </span>
            <div className="space-y-3">
              <div className="p-3 border-l-3 border-[#2859D9] bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] border-l-0 rounded-lg">
                <span className="text-[10px] text-zinc-400 font-semibold">06:00 AM - 11:00 AM Daily</span>
                <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 mt-0.5">Breakfast Menu Promo</h4>
                <span className="text-[9px] text-zinc-500 mt-1 block">Priority 30 · Fallback playlist linked</span>
              </div>
              <div className="p-3 border-l-3 border-[#2859D9] bg-[#F6F7F9] dark:bg-[#171F2C] border border-[#E2E6EC] dark:border-[#283243] border-l-0 rounded-lg">
                <span className="text-[10px] text-zinc-400 font-semibold">11:00 AM - 04:00 PM Daily</span>
                <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 mt-0.5">Lunch Combos Campaign</h4>
                <span className="text-[9px] text-zinc-500 mt-1 block">Priority 30 · Fallback playlist linked</span>
              </div>
              <div className="p-3 border-l-3 border-emerald-500 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] border-l-0 rounded-lg ring-1 ring-emerald-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wide">04:00 PM - 09:30 PM Daily</span>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-white mt-0.5">Monsoon Café Promotions</h4>
                  </div>
                  <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-xs uppercase">Playing Now</span>
                </div>
                <span className="text-[9px] text-zinc-500 mt-1.5 block">Priority 40 · 21 active targets</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SENSORS */}
        {activeTab === "Sensors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E6EC] dark:border-[#283243] pb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Connected Edge Sensors</span>
              <span className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                Edge Execution
              </span>
            </div>
            
            <div className="space-y-3">
              {/* Motion Sensor */}
              <div className="p-3 border border-[#E2E6EC] dark:border-[#283243] rounded-xl bg-white dark:bg-[#111722] flex items-center justify-between">
                <div className="min-w-0">
                  <span className="block font-bold text-zinc-800 dark:text-zinc-200">PIR Motion Detector (USB-1)</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">IF motion detected THEN trigger "Walk-in Offer"</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-500 block">Motion: Yes</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Runs locally</span>
                </div>
              </div>
              
              {/* Temperature Sensor */}
              <div className="p-3 border border-[#E2E6EC] dark:border-[#283243] rounded-xl bg-white dark:bg-[#111722] flex items-center justify-between">
                <div className="min-w-0">
                  <span className="block font-bold text-zinc-800 dark:text-zinc-200">I2C Temperature Probe</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">IF temp &lt; 18°C THEN show "Hot Coffee Favourites"</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block font-mono">17.6 °C</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Triggered</span>
                </div>
              </div>

              {/* Ambient Light Sensor */}
              <div className="p-3 border border-[#E2E6EC] dark:border-[#283243] rounded-xl bg-white dark:bg-[#111722] flex items-center justify-between">
                <div className="min-w-0">
                  <span className="block font-bold text-zinc-800 dark:text-zinc-200">Light Intensity Sensor</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">IF light &lt; 80 lux THEN dim backlight to 45%</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block font-mono">68 Lux</span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Dimmed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ALERTS & LOGS */}
        {activeTab === "Alerts" && (
          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Incident History</span>
            
            <div className="space-y-2.5">
              {screen.alertsCount > 0 ? (
                <div className="p-3 bg-rose-50/70 border border-rose-100/50 dark:bg-rose-950/15 dark:border-rose-900/30 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-rose-800 dark:text-rose-400">Offline Warning Triggered</span>
                    <span className="block text-[10px] text-rose-600 dark:text-rose-400/90 mt-0.5">
                      Last heartbeat exceeded 90s interval. Diagnostic check requested.
                    </span>
                    <div className="mt-3 flex gap-2">
                      <button className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[9px] cursor-pointer">
                        Acknowledge Alert
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-xl text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs">No active device warnings or alerts.</p>
                </div>
              )}

              <div className="p-4 border border-[#E2E6EC] dark:border-[#283243] rounded-xl bg-zinc-50/10 dark:bg-[#171F2C]/10 space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Device Command Log</span>
                <div className="font-mono text-[9px] space-y-1.5 text-zinc-500">
                  <div className="flex justify-between">
                    <span>[16:18:42] CMD: RESTART_DEVICE</span>
                    <span className="text-red-500">TIMEOUT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>[16:04:12] CMD: SYNC_MANIFEST</span>
                    <span className="text-emerald-500">SUCCESS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>[15:42:01] CMD: FORCE_HEARTBEAT</span>
                    <span className="text-emerald-500">SUCCESS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY */}
        {activeTab === "Activity" && (
          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Operator Activity Feed</span>
            <div className="relative border-l border-[#E2E6EC] dark:border-[#283243] ml-2 pl-4 py-2 space-y-4">
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-[#2859D9] dark:bg-[#6F96FF]" />
                <div className="text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Aarav Mehta</span>
                  <span className="text-zinc-500"> forced a content deployment manifest.</span>
                  <span className="block text-[9px] text-zinc-400 mt-0.5">3:42 PM IST</span>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-emerald-500" />
                <div className="text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Aarav Mehta</span>
                  <span className="text-zinc-500"> issued a player reboot signal.</span>
                  <span className="block text-[9px] text-zinc-400 mt-0.5">3:18 PM IST</span>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Sneha Iyer</span>
                  <span className="text-zinc-500"> adjusted the PIR automation bounds.</span>
                  <span className="block text-[9px] text-zinc-400 mt-0.5">2:56 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
