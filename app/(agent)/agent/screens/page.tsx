"use client";

import React, { useEffect, useState } from "react";
import {
  Monitor,
  Map,
  Plus,
  Download,
  Activity,
  Layers,
  MapPin,
  Cpu,
  ShieldAlert,
} from "lucide-react";
import ScreensTable, { ScreenDevice } from "@/components/agent/screens/screens-table";
import ScreensMap from "@/components/agent/screens/screens-map";
import ScreensDetailDrawer from "@/components/agent/screens/screens-detail-drawer";
import ScreenCreateModal from "@/components/agent/screens/screen-create-modal";
import {
  claimPlayerRegistration,
  createPlayerDownload,
  createScreen,
  fetchScreens,
} from "@/components/agent/screens/api";
import {
  Button,
  Card,
  EmptyState,
  Modal,
  SearchInput,
  SegmentedControl,
  Select,
  Skeleton,
  SkeletonRegion,
  SkeletonTable,
} from "@/components/ui";

function uniqueSorted(values: (string | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort();
}

export default function AgentScreensPage() {
  const [screens, setScreens] = useState<ScreenDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [selectedScreen, setSelectedScreen] = useState<ScreenDevice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Plan §2: skeleton on first load only — a refetch keeps the current content
  // on screen rather than replacing it with grey bars.
  const isFirstLoad = isLoading && screens.length === 0;

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [modelFilter, setModelFilter] = useState("All");
  const [alertsFilter, setAlertsFilter] = useState("All");

  useEffect(() => {
    fetchScreens()
      .then(setScreens)
      .catch((err) => console.error("Failed to load screens:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const groupOptions = uniqueSorted(screens.map((s) => s.group));
  const locationOptions = uniqueSorted(screens.map((s) => s.location));
  const modelOptions = uniqueSorted(screens.map((s) => s.model));

  const handleCreateScreen: React.ComponentProps<typeof ScreenCreateModal>["onCreate"] = async (
    payload,
  ) => {
    const created = await createScreen(payload);
    setScreens((prev) => [created, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleClaimPlayer: React.ComponentProps<typeof ScreenCreateModal>["onClaimPlayer"] = async (
    registrationId,
    payload,
  ) => {
    const created = await claimPlayerRegistration(registrationId, payload);
    setScreens((prev) => [created, ...prev.filter((screen) => screen.id !== created.id)]);
    setIsCreateModalOpen(false);
  };

  const handleDownloadPlayer = async (platform: "LINUX" | "WINDOWS") => {
    setDownloadError(null);
    try {
      const download = await createPlayerDownload(platform);
      window.location.assign(download.downloadUrl);
      setIsDownloadModalOpen(false);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Failed to prepare player download");
    }
  };

  // Filter application
  const filteredScreens = screens.filter((screen) => {
    const matchesSearch =
      screen.name.toLowerCase().includes(search.toLowerCase()) ||
      screen.location.toLowerCase().includes(search.toLowerCase()) ||
      screen.model.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || screen.status === statusFilter;
    const matchesGroup = groupFilter === "All" || screen.group === groupFilter;
    const matchesLocation = locationFilter === "All" || screen.location === locationFilter;
    const matchesModel = modelFilter === "All" || screen.model === modelFilter;

    const matchesAlerts =
      alertsFilter === "All" ||
      (alertsFilter === "Alerts Only" && screen.alertsCount > 0) ||
      (alertsFilter === "Clear Only" && screen.alertsCount === 0);

    return matchesSearch && matchesStatus && matchesGroup && matchesLocation && matchesModel && matchesAlerts;
  });

  return (
    <div className="flex h-full overflow-hidden relative">
      <div className="flex-1 flex flex-col min-w-0 py-6 px-8 space-y-6 overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
          <div>
            <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
              Screens &amp; Device Players
            </h1>
            <p className="text-body text-app-muted mt-1">
              Monitor hardware heartbeats, active playlists, rules automations, and errors.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SegmentedControl
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: "table", label: "Table list view", icon: Monitor },
                { value: "map", label: "Map cluster view", icon: Map },
              ]}
            />

            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={() => {
                setDownloadError(null);
                setIsDownloadModalOpen(true);
              }}
            >
              Player
            </Button>

            <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              Add Screen
            </Button>
          </div>
        </div>

        {downloadError && (
          <div className="rounded-lg border border-app-danger/30 bg-app-danger-surface px-3 py-2 text-body font-semibold text-app-danger-text">
            {downloadError}
          </div>
        )}

        {/* Advanced Filters Panel */}
        <Card size="widget" padded className="space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SearchInput
              placeholder="Search screen, location, model…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              icon={Activity}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Delayed">Delayed</option>
              <option value="Offline">Offline</option>
            </Select>

            <Select
              icon={Layers}
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              aria-label="Filter by screen group"
            >
              <option value="All">All Screen Groups</option>
              {groupOptions.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>

            <Select
              icon={MapPin}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              aria-label="Filter by location"
            >
              <option value="All">All Locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            <Select
              icon={Cpu}
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              aria-label="Filter by hardware model"
            >
              <option value="All">All Hardware Models</option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </Select>

            <Select
              icon={ShieldAlert}
              value={alertsFilter}
              onChange={(e) => setAlertsFilter(e.target.value)}
              aria-label="Filter by alert state"
            >
              <option value="All">All Alerts</option>
              <option value="Alerts Only">With active alerts</option>
              <option value="Clear Only">No active alerts</option>
            </Select>
          </div>
        </Card>

        {/* Main Render Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {isFirstLoad ? (
            viewMode === "table" ? (
              <Card size="panel" className="overflow-hidden">
                <SkeletonTable rows={6} cols={12} label="Loading screens…" />
              </Card>
            ) : (
              <SkeletonRegion label="Loading screen map…" className="flex-1">
                <Skeleton className="h-full min-h-[400px] w-full rounded-xl" />
              </SkeletonRegion>
            )
          ) : screens.length === 0 ? (
            <Card size="panel" className="flex-1 min-h-[400px] flex items-center justify-center">
              <EmptyState
                icon={Monitor}
                title="No screens yet"
                description="Add your first screen to get started."
                action={
                  <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
                    Add Screen
                  </Button>
                }
              />
            </Card>
          ) : viewMode === "table" ? (
            <ScreensTable
              screens={filteredScreens}
              onSelectScreen={(screen) => setSelectedScreen(screen)}
              selectedScreenId={selectedScreen?.id || null}
            />
          ) : (
            <ScreensMap
              screens={filteredScreens}
              onSelectScreen={(screen) => setSelectedScreen(screen)}
              selectedScreenId={selectedScreen?.id || null}
            />
          )}
        </div>
      </div>

      {/* Sliding detail drawer panel */}
      {selectedScreen && (
        <ScreensDetailDrawer screen={selectedScreen} onClose={() => setSelectedScreen(null)} />
      )}

      {isCreateModalOpen && (
        <ScreenCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateScreen}
          onClaimPlayer={handleClaimPlayer}
        />
      )}

      <Modal
        open={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Download Player"
        description="Bootstrap packages for the on-device player."
        size="md"
      >
        <div className="space-y-3">
          {(
            [
              {
                platform: "LINUX" as const,
                name: "Linux Player",
                desc: "Download shell bootstrap from public player package.",
              },
              {
                platform: "WINDOWS" as const,
                name: "Windows Player",
                desc: "Download Windows bootstrap config from public player package.",
              },
            ]
          ).map((opt) => (
            <Card
              key={opt.platform}
              as="button"
              size="row"
              padded
              interactive
              onClick={() => handleDownloadPlayer(opt.platform)}
              className="w-full flex items-center justify-between gap-3 text-left"
            >
              <span>
                <span className="block text-body font-semibold text-app-text">{opt.name}</span>
                <span className="block text-caption text-app-muted">{opt.desc}</span>
              </span>
              <Download className="w-4 h-4 text-app-accent-text shrink-0" />
            </Card>
          ))}

          {downloadError && (
            <p className="text-body font-semibold text-app-danger-text">{downloadError}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
