"use client";

import React, { useEffect, useState } from "react";
import { Cpu, Monitor, X } from "lucide-react";
import { fetchScreenGroups } from "@/components/agent/screen-groups/api";
import { ScreenGroup } from "@/components/agent/screen-groups/groups-grid";
import { CreateScreenPayload, PlayerRegistration, fetchInstalledPlayers } from "./api";

interface ScreenCreateModalProps {
  onClose: () => void;
  onCreate: (payload: CreateScreenPayload) => Promise<void>;
  onClaimPlayer: (registrationId: string, payload: { name: string; location?: string; groupId?: string }) => Promise<void>;
}

export default function ScreenCreateModal({ onClose, onCreate, onClaimPlayer }: ScreenCreateModalProps) {
  const [mode, setMode] = useState<"manual" | "registered">("registered");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState<ScreenGroup[]>([]);
  const [players, setPlayers] = useState<PlayerRegistration[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScreenGroups()
      .then(setGroups)
      .catch(() => setGroups([]));
    fetchInstalledPlayers()
      .then((installedPlayers) => {
        setPlayers(installedPlayers);
        setSelectedPlayerId(installedPlayers[0]?.id ?? "");
        if (installedPlayers.length === 0) setMode("manual");
      })
      .catch(() => setPlayers([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (mode === "registered") {
        if (!selectedPlayerId) throw new Error("Choose an installed player.");
        await onClaimPlayer(selectedPlayerId, {
          name,
          location: location || undefined,
          groupId: groupId || undefined,
        });
      } else {
        await onCreate({
          name,
          model,
          location: location || undefined,
          groupId: groupId || undefined,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create screen");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/55 dark:bg-black/80 flex items-center justify-center z-50 animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#111722] border border-[#E2E6EC] dark:border-[#283243] rounded-xl w-[440px] max-w-full shadow-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#E2E6EC] dark:border-[#283243] flex justify-between items-center bg-[#F6F7F9]/50 dark:bg-[#171F2C]/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/20 text-[#2859D9] dark:text-[#6F96FF] rounded-lg">
              <Monitor className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#18202B] dark:text-[#F2F5F8]">Add Screen</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#F6F7F9] dark:bg-[#171F2C]/50 p-1">
            <button
              type="button"
              onClick={() => setMode("registered")}
              disabled={players.length === 0}
              className={`px-3 py-2 rounded-md text-[11px] font-bold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                mode === "registered"
                  ? "bg-white dark:bg-[#111722] text-[#2859D9] dark:text-[#6F96FF] shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              Registered Player
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`px-3 py-2 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                mode === "manual"
                  ? "bg-white dark:bg-[#111722] text-[#2859D9] dark:text-[#6F96FF] shadow-xs"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              Manual Screen
            </button>
          </div>

          {mode === "registered" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Installed Player
              </label>
              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
                required
              >
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.hostname || "Unnamed device"} · {player.platform === "LINUX" ? "Linux" : "Windows"} ·{" "}
                    {player.installId?.slice(0, 12) || "No install ID"}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                <Cpu className="w-3 h-3" />
                <span>{players.length} installed player{players.length === 1 ? "" : "s"} ready to add.</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Screen Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Koramangala Entrance"
              className="w-full px-3.5 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Device Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={mode === "registered" ? "From installed player" : "e.g. XD1035"}
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] focus:outline-none"
                required={mode === "manual"}
                disabled={mode === "registered"}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. MG Road"
                className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-[#18202B] dark:text-[#F2F5F8] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Screen Group
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F7F9] dark:bg-[#171F2C]/50 border border-[#E2E6EC] dark:border-[#283243] rounded-lg text-xs text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="">Unassigned</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-[11px] font-semibold text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2E6EC] dark:border-[#283243] text-xs font-bold rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#2859D9] dark:bg-[#6F96FF] text-white dark:text-[#111722] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : mode === "registered" ? "Add Player" : "Add Screen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
