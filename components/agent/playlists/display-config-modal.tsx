"use client";

import React from "react";
import { Monitor, X } from "lucide-react";
import { DisplayConfigTab } from "./types";

interface PresetCardData {
  key: string;
  name: string;
  res: string;
  aspect: string;
  orient: string;
  iconW: number;
  iconH: number;
  active: boolean;
  onClick: () => void;
}

interface DeviceCardData {
  key: string;
  name: string;
  category: string;
  res: string;
  bitrate: string;
  formats: string;
  active: boolean;
  onClick: () => void;
}

interface ConfigTabData {
  id: DisplayConfigTab;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface DisplayConfigModalProps {
  open: boolean;
  onClose: () => void;
  configTab: DisplayConfigTab;
  configTabs: ConfigTabData[];
  presetCards: PresetCardData[];
  deviceCards: DeviceCardData[];
  customW: number;
  customH: number;
  customAspect: string;
  customPrevW: number;
  customPrevH: number;
  onCustomW: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomH: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyCustom: () => void;
  displayName: string;
  displayRes: string;
  displayAspect: string;
  deviceName: string;
}

export default function DisplayConfigModal({
  open,
  onClose,
  configTab,
  configTabs,
  presetCards,
  deviceCards,
  customW,
  customH,
  customAspect,
  customPrevW,
  customPrevH,
  onCustomW,
  onCustomH,
  onApplyCustom,
  displayName,
  displayRes,
  displayAspect,
  deviceName,
}: DisplayConfigModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/55 dark:bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-50 animate-fadeIn font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[860px] max-w-[92vw] max-h-[86vh] flex flex-col bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <div className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Display Configuration
            </div>
            <div className="text-[11.5px] text-zinc-450 mt-0.5">
              Choose the physical display this loop will be deployed to. Preview and asset validation update instantly.
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-md border border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722] text-zinc-450 hover:bg-[#F6F7F9] dark:hover:bg-[#18202E] hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-1 px-5 border-b border-[#E2E6EC] dark:border-[#283243]">
          {configTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className={`px-3.5 pt-2 pb-2.5 -mb-px border-b-2 text-xs cursor-pointer transition-colors ${
                tab.active
                  ? "border-[#2859D9] dark:border-[#6F96FF] text-[#2859D9] dark:text-[#6F96FF] font-bold"
                  : "border-transparent text-zinc-450 font-medium hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5">
          {configTab === "presets" && (
            <div className="grid grid-cols-4 gap-2.5">
              {presetCards.map((p) => (
                <button
                  key={p.key}
                  onClick={p.onClick}
                  className={`flex flex-col items-center gap-2 pt-3.5 pb-2.5 px-2 rounded-xl border-[1.5px] cursor-pointer transition-colors hover:border-[#2859D9] dark:hover:border-[#6F96FF] hover:shadow-md ${
                    p.active
                      ? "border-[#2859D9] dark:border-[#6F96FF] bg-[#2859D9]/10 dark:bg-[#6F96FF]/10"
                      : "border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722]"
                  }`}
                >
                  <span className="flex items-center justify-center h-[34px]">
                    <span
                      className={`inline-block border-2 rounded-[3px] ${
                        p.active
                          ? "border-[#2859D9] dark:border-[#6F96FF] bg-[#2859D9]/10 dark:bg-[#6F96FF]/10"
                          : "border-zinc-450 bg-transparent"
                      }`}
                      style={{ width: `${p.iconW}px`, height: `${p.iconH}px` }}
                    />
                  </span>
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="text-[11.5px] font-bold text-center text-zinc-900 dark:text-zinc-100">
                      {p.name}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-450">{p.res}</span>
                    <span className="text-[9.5px] font-semibold text-zinc-450">
                      {p.aspect} · {p.orient}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {configTab === "devices" && (
            <div className="flex flex-col gap-2">
              {deviceCards.map((d) => (
                <button
                  key={d.key}
                  onClick={d.onClick}
                  className={`grid grid-cols-[40px_1.4fr_1fr_1fr_1.2fr_auto] items-center gap-3 px-3.5 py-2.5 rounded-xl border-[1.5px] cursor-pointer text-left transition-colors hover:border-[#2859D9] dark:hover:border-[#6F96FF] ${
                    d.active
                      ? "border-[#2859D9] dark:border-[#6F96FF] bg-[#2859D9]/10 dark:bg-[#6F96FF]/10"
                      : "border-[#E2E6EC] dark:border-[#283243] bg-white dark:bg-[#111722]"
                  }`}
                >
                  <span className="flex items-center justify-center w-10 h-[30px] rounded-md bg-[#F6F7F9] dark:bg-[#18202E] text-zinc-450">
                    <Monitor className="w-3.5 h-3.5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{d.name}</span>
                    <span className="text-[10px] text-zinc-450">{d.category}</span>
                  </span>
                  <span className="font-mono text-[10.5px] text-zinc-450">{d.res}</span>
                  <span className="font-mono text-[10.5px] text-zinc-450">{d.bitrate}</span>
                  <span className="font-mono text-[10px] text-zinc-450">{d.formats}</span>
                  <span className="text-[10px] font-bold text-[#2859D9] dark:text-[#6F96FF]">
                    {d.active ? "✓ SELECTED" : ""}
                  </span>
                </button>
              ))}
            </div>
          )}

          {configTab === "custom" && (
            <div className="flex gap-6 items-start">
              <div className="flex flex-col gap-3 w-[260px]">
                <label className="flex flex-col gap-1 text-[11px] font-semibold text-zinc-450">
                  Width
                  <span className="relative block">
                    <input
                      type="number"
                      min={240}
                      max={15360}
                      value={customW}
                      onChange={onCustomW}
                      className="w-full box-border h-[34px] pl-2.5 pr-7 rounded-lg border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#0D1320] text-zinc-900 dark:text-zinc-100 font-mono text-[13px] font-bold focus:outline-none focus:border-[#2859D9] dark:focus:border-[#6F96FF]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10.5px] text-zinc-450">px</span>
                  </span>
                </label>
                <label className="flex flex-col gap-1 text-[11px] font-semibold text-zinc-450">
                  Height
                  <span className="relative block">
                    <input
                      type="number"
                      min={240}
                      max={15360}
                      value={customH}
                      onChange={onCustomH}
                      className="w-full box-border h-[34px] pl-2.5 pr-7 rounded-lg border border-[#E2E6EC] dark:border-[#283243] bg-[#F6F7F9] dark:bg-[#0D1320] text-zinc-900 dark:text-zinc-100 font-mono text-[13px] font-bold focus:outline-none focus:border-[#2859D9] dark:focus:border-[#6F96FF]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10.5px] text-zinc-450">px</span>
                  </span>
                </label>
                <div className="flex justify-between text-[11px] px-2.5 py-2 border border-[#E2E6EC] dark:border-[#283243] rounded-lg bg-[#F6F7F9] dark:bg-[#0D1320]">
                  <span className="text-zinc-450 font-semibold">Aspect Ratio</span>
                  <span className="font-mono font-semibold">{customAspect} (Auto)</span>
                </div>
                <button
                  onClick={onApplyCustom}
                  className="h-[34px] rounded-lg border-none bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-[12.5px] font-bold cursor-pointer hover:brightness-110 transition-[filter]"
                >
                  Apply Custom Resolution
                </button>
                <div className="text-[10.5px] text-zinc-450 leading-relaxed">
                  Common: 1366×768 · 1600×900 · 1920×1080 · 2560×1440 · 3840×2160 · 768×1366 · 1080×1920 · any LED matrix.
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center min-h-[220px] border border-dashed border-[#E2E6EC] dark:border-[#283243] rounded-xl bg-[#F6F7F9] dark:bg-[#0D1320]">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="border-2 border-[#2859D9] dark:border-[#6F96FF] rounded bg-[#2859D9]/10 dark:bg-[#6F96FF]/10 transition-all duration-200"
                    style={{ width: `${customPrevW}px`, height: `${customPrevH}px` }}
                  />
                  <span className="font-mono text-[11px] text-zinc-450">
                    {customW} × {customH}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E6EC] dark:border-[#283243] bg-zinc-50/40 dark:bg-[#18202E]">
          <span className="text-[11px] text-zinc-450">
            Current: <span className="font-bold text-zinc-900 dark:text-zinc-100">{displayName}</span> ·{" "}
            <span className="font-mono">{displayRes}</span> · {displayAspect} · Output: {deviceName}
          </span>
          <button
            onClick={onClose}
            className="h-[30px] px-4 rounded-md border-none bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold cursor-pointer hover:brightness-110 transition-[filter]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
