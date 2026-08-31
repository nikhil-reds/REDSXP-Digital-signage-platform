"use client";

import React, { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import { fetchScreenGroups } from "@/components/agent/screen-groups/api";
import { ScreenGroup } from "@/components/agent/screen-groups/groups-grid";
import { CreateScreenPayload, PlayerRegistration, fetchInstalledPlayers } from "./api";
import {
  Button,
  FieldLabel,
  Modal,
  SegmentedControl,
  Select,
  TextInput,
} from "@/components/ui";

interface ScreenCreateModalProps {
  onClose: () => void;
  onCreate: (payload: CreateScreenPayload) => Promise<void>;
  onClaimPlayer: (
    registrationId: string,
    payload: { name: string; location?: string; groupId?: string },
  ) => Promise<void>;
}

export default function ScreenCreateModal({
  onClose,
  onCreate,
  onClaimPlayer,
}: ScreenCreateModalProps) {
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
    <Modal
      open
      onClose={onClose}
      title="Add Screen"
      description="Claim an installed player, or register a screen manually."
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="screen-create-form" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Adding…" : mode === "registered" ? "Add Player" : "Add Screen"}
          </Button>
        </>
      }
    >
      <form id="screen-create-form" onSubmit={handleSubmit} className="space-y-4">
        <SegmentedControl
          value={mode}
          onChange={setMode}
          className="w-full [&>button]:flex-1"
          options={[
            { value: "registered", label: "Registered Player" },
            { value: "manual", label: "Manual Screen" },
          ]}
        />

        {mode === "registered" && (
          <div>
            <FieldLabel htmlFor="sc-player">Installed Player</FieldLabel>
            <Select
              id="sc-player"
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              required
            >
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.hostname || "Unnamed device"} ·{" "}
                  {player.platform === "LINUX" ? "Linux" : "Windows"} ·{" "}
                  {player.installId?.slice(0, 12) || "No install ID"}
                </option>
              ))}
            </Select>
            <p className="flex items-center gap-1.5 text-caption text-app-muted mt-1.5">
              <Cpu className="w-3 h-3" />
              {players.length} installed player{players.length === 1 ? "" : "s"} ready to add.
            </p>
          </div>
        )}

        <div>
          <FieldLabel htmlFor="sc-name">Screen Name</FieldLabel>
          <TextInput
            id="sc-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Koramangala Entrance"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="sc-model">Device Model</FieldLabel>
            <TextInput
              id="sc-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={mode === "registered" ? "From installed player" : "e.g. XD1035"}
              required={mode === "manual"}
              disabled={mode === "registered"}
            />
          </div>
          <div>
            <FieldLabel htmlFor="sc-location">Location</FieldLabel>
            <TextInput
              id="sc-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. MG Road"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="sc-group">Screen Group</FieldLabel>
          <Select id="sc-group" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">Unassigned</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

        {error && <p className="text-body font-semibold text-app-danger-text">{error}</p>}
      </form>
    </Modal>
  );
}
