"use client";

import React, { useEffect, useRef, useState } from "react";
import { Clock as ClockIcon } from "lucide-react";

interface TimePickerProps {
  value: string; // "HH:mm" 24h
  onChange: (value: string) => void;
  label?: string;
}

function to12Hour(h24: number): { hour: number; period: "AM" | "PM" } {
  const period = h24 >= 12 ? "PM" : "AM";
  let hour = h24 % 12;
  if (hour === 0) hour = 12;
  return { hour, period };
}

function to24Hour(hour12: number, period: "AM" | "PM"): number {
  let h = hour12 % 12;
  if (period === "PM") h += 12;
  return h;
}

const CENTER = 90;
const RADIUS = 72;

export default function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [hh, mm] = value.split(":").map(Number);
  const { hour: hour12, period } = to12Hour(hh || 0);
  const minute = mm || 0;

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setMode("hour");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const commit = (h24: number, m: number) => {
    onChange(`${h24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  const setHour = (hour: number) => {
    commit(to24Hour(hour, period), minute);
    setMode("minute");
  };

  const setMinute = (m: number) => {
    commit(hh, m);
  };

  const setPeriod = (p: "AM" | "PM") => {
    commit(to24Hour(hour12, p), minute);
  };

  const marks =
    mode === "hour"
      ? Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i))
      : Array.from({ length: 12 }, (_, i) => i * 5);

  const nearestMinuteMark = Math.round(minute / 5) * 5 % 60;

  const activeAngle =
    mode === "hour"
      ? ((hour12 % 12) / 12) * 2 * Math.PI - Math.PI / 2
      : (minute / 60) * 2 * Math.PI - Math.PI / 2;

  const handRotationDeg = (activeAngle * 180) / Math.PI + 90;
  const handLength = RADIUS - 6;

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3.5 py-1.5 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer font-mono font-bold hover:border-[#2859D9]/40 transition-colors"
      >
        <ClockIcon className="w-3.5 h-3.5 text-[#2859D9] dark:text-[#6F96FF] shrink-0" />
        {hour12.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")} {period}
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-2 left-0 bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-2xl shadow-2xl p-4 w-[228px] animate-fadeIn">
          {/* Digital readout + AM/PM toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1 font-mono font-bold text-xl text-zinc-900 dark:text-white">
              <button
                type="button"
                onClick={() => setMode("hour")}
                className={`px-1.5 py-0.5 rounded-md transition-colors ${mode === "hour" ? "bg-[#2859D9]/10 text-[#2859D9] dark:text-[#6F96FF]" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
              >
                {hour12.toString().padStart(2, "0")}
              </button>
              <span className="text-zinc-300 dark:text-zinc-600">:</span>
              <button
                type="button"
                onClick={() => setMode("minute")}
                className={`px-1.5 py-0.5 rounded-md transition-colors ${mode === "minute" ? "bg-[#2859D9]/10 text-[#2859D9] dark:text-[#6F96FF]" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
              >
                {minute.toString().padStart(2, "0")}
              </button>
            </div>
            <div className="flex flex-col gap-0.5 border border-[#E2E6EC] dark:border-[#283243] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setPeriod("AM")}
                className={`px-2 py-0.5 text-[9px] font-bold transition-colors cursor-pointer ${period === "AM" ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722]" : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setPeriod("PM")}
                className={`px-2 py-0.5 text-[9px] font-bold transition-colors cursor-pointer ${period === "PM" ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722]" : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Analog clock face */}
          <div
            className="relative mx-auto rounded-full bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] shadow-inner"
            style={{ width: CENTER * 2, height: CENTER * 2 }}
          >
            {/* Hand */}
            <div
              className="absolute bg-[#2859D9] dark:bg-[#6F96FF] rounded-full pointer-events-none"
              style={{
                width: 2,
                height: handLength,
                left: CENTER - 1,
                top: CENTER - handLength,
                transformOrigin: `1px ${handLength}px`,
                transform: `rotate(${handRotationDeg}deg)`,
              }}
            />
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-[#2859D9] dark:bg-[#6F96FF] pointer-events-none"
              style={{ left: CENTER - 5, top: CENTER - 5 }}
            />

            {marks.map((markValue, i) => {
              const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
              const x = CENTER + RADIUS * Math.cos(angle);
              const y = CENTER + RADIUS * Math.sin(angle);
              const isSelected = mode === "hour" ? markValue === hour12 : markValue === nearestMinuteMark;
              return (
                <button
                  key={markValue}
                  type="button"
                  onClick={() => (mode === "hour" ? setHour(markValue) : setMinute(markValue))}
                  className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] shadow-sm"
                      : "text-zinc-600 dark:text-zinc-300 hover:bg-[#2859D9]/10"
                  }`}
                  style={{ left: x, top: y }}
                >
                  {markValue.toString().padStart(2, "0")}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-3 py-1.5 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-[10px] font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
