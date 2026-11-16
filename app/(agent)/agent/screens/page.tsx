"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  RefreshCw,
} from "lucide-react";
import { useSession } from "@/components/providers/session-provider";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import ScreensTable, { ScreenDevice } from "@/components/agent/screens/screens-table";
import ScreensMap from "@/components/agent/screens/screens-map";
import ScreensDetailDrawer from "@/components/agent/screens/screens-detail-drawer";
import ScreenCreateModal from "@/components/agent/screens/screen-create-modal";
import {
  claimPlayerRegistration,
  createPlayerDownload,
  createScreen,
  fetchScreens,
  updateScreen,
  deleteScreen,
  releasePlayer,
  ApiRequestError,
  PlayerDownload,
} from "@/components/agent/screens/api";
import {
  Button,
  Card,
  AccessDeniedCard,
  CollectionPagination,
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

const PLAYER_OPTIONS = [
  {
    key: "linux-x64",
    platform: "LINUX" as const,
    arch: "x64" as const,
    name: "Linux Player",
    desc: "For Intel/AMD 64-bit Linux devices.",
  },
  {
    key: "linux-arm64",
    platform: "LINUX" as const,
    arch: "arm64" as const,
    name: "Linux Player (ARM64)",
    desc: "For aarch64 / ARM64 Linux devices, including Raspberry Pi 64-bit.",
  },
  {
    key: "windows-x64",
    platform: "WINDOWS" as const,
    arch: "x64" as const,
    name: "Windows Player",
    desc: "For 64-bit Windows devices.",
  },
] as const;

type PlayerOptionKey = (typeof PLAYER_OPTIONS)[number]["key"];

export default function AgentScreensPage() {
  const { user, permissions, loading: isSessionLoading } = useSession();
  const [screens, setScreens] = useState<ScreenDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<ApiRequestError | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "map">("table");
  const [selectedScreen, setSelectedScreen] = useState<ScreenDevice | null>(null);
  const [renameScreen, setRenameScreen] = useState<ScreenDevice | null>(null);
  const [screenName, setScreenName] = useState("");
  const [renameError, setRenameError] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState<ScreenDevice | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingScreen, setIsDeletingScreen] = useState(false);
  const [screenToRelease, setScreenToRelease] = useState<ScreenDevice | null>(null);
  const [releaseError, setReleaseError] = useState("");
  const [isReleasingPlayer, setIsReleasingPlayer] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Plan §2: skeleton on first load only — a refetch keeps the current content
  // on screen rather than replacing it with grey bars.
  const isFirstLoad = isLoading && screens.length === 0;

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [preparedDownloads, setPreparedDownloads] = useState<Partial<Record<PlayerOptionKey, PlayerDownload>>>({});
  const [isPreparingDownloads, setIsPreparingDownloads] = useState(false);

  // Filters State
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [modelFilter, setModelFilter] = useState("All");
  const [alertsFilter, setAlertsFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const canReadScreens = hasPermission(permissions, PERMISSIONS.DEVICE_READ);
  const canCreateScreens = hasPermission(permissions, PERMISSIONS.DEVICE_CREATE);
  const canDeleteScreens = hasPermission(permissions, PERMISSIONS.DEVICE_DELETE);

  async function confirmDeleteScreen() {
    if (!canDeleteScreens || !screenToDelete || isDeletingScreen) return;

    const { id } = screenToDelete;
    setIsDeletingScreen(true);
    setDeleteError("");
    try {
      await deleteScreen(id);
      setScreens((current) => current.filter((screen) => screen.id !== id));
      setSelectedScreen((current) => current?.id === id ? null : current);
      setScreenToDelete(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Unable to delete screen.");
    } finally {
      setIsDeletingScreen(false);
    }
  }

  async function confirmReleasePlayer() {
    if (!canDeleteScreens || !screenToRelease || isReleasingPlayer) return;
    const { id } = screenToRelease;
    setIsReleasingPlayer(true);
    setReleaseError("");
    try {
      await releasePlayer(id);
      setScreens((current) => current.map((screen) =>
        screen.id === id
          ? { ...screen, status: "Offline", installId: null, playerRegistrationId: null }
          : screen,
      ));
      setSelectedScreen((current) => current?.id === id ? null : current);
      setScreenToRelease(null);
    } catch (error) {
      setReleaseError(error instanceof Error ? error.message : "Unable to release player.");
    } finally {
      setIsReleasingPlayer(false);
    }
  }

  function openRenameScreen(screen: ScreenDevice) {
    setScreenName(screen.name);
    setRenameError("");
    setRenameScreen(screen);
  }

  async function saveScreenName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = screenName.trim();
    if (!renameScreen || !name || name === renameScreen.name || isSavingName) return;

    const { id } = renameScreen;
    setIsSavingName(true);
    setRenameError("");
    try {
      const updated = await updateScreen(id, { name });
      setScreens((current) => current.map((screen) =>
        screen.id === id ? { ...screen, name: updated.name } : screen,
      ));
      setSelectedScreen((current) =>
        current?.id === id ? { ...current, name: updated.name } : current,
      );
      setRenameScreen(null);
    } catch (error) {
      setRenameError(error instanceof Error ? error.message : "Unable to rename screen.");
    } finally {
      setIsSavingName(false);
    }
  }

  const loadScreens = useCallback(async () => {
    setLoadError(null);
    setIsLoading(true);
    try {
      setScreens(await fetchScreens());
    } catch (error) {
      setLoadError(
        error instanceof ApiRequestError
          ? error
          : new ApiRequestError("Unable to load screens. Please try again.", 0),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSessionLoading || !canReadScreens) return;
    fetchScreens()
      .then((loadedScreens) => {
        setScreens(loadedScreens);
        setLoadError(null);
      })
      .catch((error) => {
        setLoadError(
          error instanceof ApiRequestError
            ? error
            : new ApiRequestError("Unable to load screens. Please try again.", 0),
        );
      })
      .finally(() => setIsLoading(false));
  }, [canReadScreens, isSessionLoading]);

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

  const openDownloadModal = async () => {
    setDownloadError(null);
    setPreparedDownloads({});
    setIsPreparingDownloads(true);
    setIsDownloadModalOpen(true);

    try {
      const results = await Promise.allSettled(
        PLAYER_OPTIONS.map((option) => createPlayerDownload(option.platform, option.arch)),
      );
      const prepared: Partial<Record<PlayerOptionKey, PlayerDownload>> = {};
      const failures: string[] = [];

      results.forEach((result, index) => {
        const option = PLAYER_OPTIONS[index];
        if (result.status === "fulfilled") prepared[option.key] = result.value;
        else failures.push(option.name);
      });

      setPreparedDownloads(prepared);
      if (failures.length) {
        setDownloadError(`Could not prepare: ${failures.join(", ")}. Close this window and try again.`);
      }
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Failed to prepare player downloads");
    } finally {
      setIsPreparingDownloads(false);
    }
  };

  const handleDownloadPlayer = (key: PlayerOptionKey) => {
    const download = preparedDownloads[key];
    if (!download) return;
    window.location.assign(download.downloadUrl);
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
    setDownloadError(null);
    setPreparedDownloads({});
    setIsPreparingDownloads(false);
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
  const activeFilterCount = [statusFilter, groupFilter, locationFilter, modelFilter, alertsFilter].filter((value) => value !== "All").length;
  const totalPages = Math.max(1, Math.ceil(filteredScreens.length / pageSize));
  const visibleScreens = filteredScreens.slice((Math.min(page, totalPages) - 1) * pageSize, Math.min(page, totalPages) * pageSize);
  const resetToFirstPage = () => setPage(1);

  if (!isSessionLoading && (!canReadScreens || loadError?.status === 403)) {
    return (
      <div className="flex h-full overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-3 py-4 sm:px-6 lg:px-8 pb-24">
          <AccessDeniedCard resource="Screens & Device Players" roleName={user?.role.name} />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-3 py-4 sm:px-6 lg:px-8 pb-24">
          <Card size="panel" className="flex min-h-[400px] items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <ShieldAlert className="mx-auto h-8 w-8 text-app-danger-text" aria-hidden="true" />
              <h2 className="mt-4 font-heading text-h5 font-semibold tracking-headline text-app-text">
                Unable to load screens
              </h2>
              <p className="mt-2 text-body text-app-muted">{loadError.message}</p>
              <Button variant="secondary" size="sm" icon={RefreshCw} className="mt-5" onClick={loadScreens}>
                Try again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="screens-page flex h-full min-h-0 overflow-hidden relative">
      <div className="screens-content flex-1 flex flex-col min-w-0 min-h-0 gap-4 overflow-y-auto px-3 py-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-app-border pb-5 shrink-0">
          <div>
            <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
              Screens &amp; Device Players
            </h1>
            <p className="text-body text-app-muted mt-1">
              Monitor hardware heartbeats, active playlists, rules automations, and errors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              onClick={openDownloadModal}
            >
              Player
            </Button>

            {canCreateScreens && (
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
                Add Screen
              </Button>
            )}
          </div>
        </div>

        {downloadError && (
          <div className="rounded-lg border border-app-danger/30 bg-app-danger-surface px-3 py-2 text-body font-semibold text-app-danger-text">
            {downloadError}
          </div>
        )}

        {/* Advanced Filters Panel */}
        <Card size="widget" padded className="space-y-3 shrink-0">
          <div className="screens-search-row">
            <SearchInput
              aria-label="Search screens"
              placeholder="Search screen, location, model…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetToFirstPage(); }}
            />

            <Button variant="secondary" className="screens-filter-toggle" aria-expanded={filtersOpen} aria-controls="screen-filters" onClick={() => setFiltersOpen(!filtersOpen)}>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={() => {
                setStatusFilter("All"); setGroupFilter("All"); setLocationFilter("All");
                setModelFilter("All"); setAlertsFilter("All"); resetToFirstPage();
              }}>Clear filters</Button>
            )}
          </div>
          <div id="screen-filters" className={`screens-filters ${filtersOpen ? "is-open" : ""}`}>
            <Select
              icon={Activity}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); resetToFirstPage(); }}
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
              onChange={(e) => { setGroupFilter(e.target.value); resetToFirstPage(); }}
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
              onChange={(e) => { setLocationFilter(e.target.value); resetToFirstPage(); }}
              aria-label="Filter by location"
            >
              <option value="All">All Locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
            <Select
              icon={Cpu}
              value={modelFilter}
              onChange={(e) => { setModelFilter(e.target.value); resetToFirstPage(); }}
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
              onChange={(e) => { setAlertsFilter(e.target.value); resetToFirstPage(); }}
              aria-label="Filter by alert state"
            >
              <option value="All">All Alerts</option>
              <option value="Alerts Only">With active alerts</option>
              <option value="Clear Only">No active alerts</option>
            </Select>
          </div>
        </Card>

        {/* Main Render Area */}
        <div className="screens-results flex flex-col shrink-0">
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
                action={canCreateScreens ? (
                  <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
                    Add Screen
                  </Button>
                ) : undefined}
              />
            </Card>
          ) : filteredScreens.length === 0 ? (
            <Card size="panel" className="p-6"><EmptyState icon={Monitor} title="No matching screens" description="Try a different search or clear your filters." /></Card>
          ) : viewMode === "table" ? (
            <ScreensTable
              screens={visibleScreens}
              onRenameScreen={openRenameScreen}
              onDeleteScreen={canDeleteScreens ? (screen) => {
                setDeleteError("");
                setScreenToDelete(screen);
              } : undefined}
              onReleasePlayer={canDeleteScreens ? (screen) => {
                setReleaseError("");
                setScreenToRelease(screen);
              } : undefined}
              onSelectScreen={(screen) => setSelectedScreen(screen)}
              selectedScreenId={selectedScreen?.id || null}
            />
          ) : (
            <ScreensMap
              screens={visibleScreens}
              onSelectScreen={(screen) => setSelectedScreen(screen)}
              selectedScreenId={selectedScreen?.id || null}
            />
          )}
        </div>
        {!isFirstLoad && screens.length > 0 && (
          <CollectionPagination
            page={page}
            pageSize={pageSize}
            total={filteredScreens.length}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => { setPageSize(nextPageSize); setPage(1); }}
          />
        )}
      </div>

      {/* Sliding detail drawer panel */}
      {selectedScreen && (
        <ScreensDetailDrawer screen={selectedScreen} onClose={() => setSelectedScreen(null)} />
      )}

      <Modal
        open={renameScreen !== null}
        onClose={() => { if (!isSavingName) setRenameScreen(null); }}
        title="Rename screen"
      >
        <form onSubmit={saveScreenName} className="space-y-4">
          <label className="block text-body font-semibold">
            Screen name
            <input
              autoFocus
              required
              value={screenName}
              onChange={(event) => setScreenName(event.target.value)}
              disabled={isSavingName}
              className="mt-2 block w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2"
            />
          </label>
          {renameError && <p role="alert" className="text-body">{renameError}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" disabled={isSavingName} onClick={() => setRenameScreen(null)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSavingName || !screenName.trim() || screenName.trim() === renameScreen?.name}>
              {isSavingName ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={screenToDelete !== null}
        onClose={() => { if (!isDeletingScreen) setScreenToDelete(null); }}
        title="Delete screen"
        footer={
          <>
            <Button variant="secondary" disabled={isDeletingScreen} onClick={() => setScreenToDelete(null)}>Cancel</Button>
            <Button variant="danger" disabled={isDeletingScreen} onClick={confirmDeleteScreen}>
              {isDeletingScreen ? "Deleting…" : "Delete screen"}
            </Button>
          </>
        }
      >
        <p>Delete <strong>{screenToDelete?.name}</strong>? This action cannot be undone.</p>
        {deleteError && <p role="alert" className="mt-2 text-body">{deleteError}</p>}
      </Modal>

      <Modal
        open={screenToRelease !== null}
        onClose={() => { if (!isReleasingPlayer) setScreenToRelease(null); }}
        title="Release player"
        footer={
          <>
            <Button variant="secondary" disabled={isReleasingPlayer} onClick={() => setScreenToRelease(null)}>Cancel</Button>
            <Button variant="danger" disabled={isReleasingPlayer} onClick={confirmReleasePlayer}>
              {isReleasingPlayer ? "Releasing…" : "Release player"}
            </Button>
          </>
        }
      >
        <p>
          Release the player from <strong>{screenToRelease?.name}</strong>? Its current credentials will stop working,
          and the physical player can then be paired with another account.
        </p>
        {releaseError && <p role="alert" className="mt-2 text-body">{releaseError}</p>}
      </Modal>

      {isCreateModalOpen && (
        <ScreenCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateScreen}
          onClaimPlayer={handleClaimPlayer}
        />
      )}

      <Modal
        open={isDownloadModalOpen}
        onClose={closeDownloadModal}
        title="Download Player"
        description="Bootstrap packages for the on-device player."
        size="md"
      >
        <div className="space-y-3">
          {PLAYER_OPTIONS.map((opt) => {
            const download = preparedDownloads[opt.key];
            return (
            <Card
              key={opt.key}
              as="button"
              size="row"
              padded
              interactive
              disabled={!download}
              onClick={() => handleDownloadPlayer(opt.key)}
              className="w-full flex items-center justify-between gap-3 text-left"
            >
              <span className="min-w-0">
                <span className="block text-body font-semibold text-app-text">{opt.name}</span>
                <span className="block text-caption text-app-muted">{opt.desc}</span>
                <span className="mt-2 block text-caption text-app-muted">Pairing code</span>
                <span className="block font-mono text-lg font-bold tracking-widest text-app-accent-text">
                  {download?.pairingCode || (isPreparingDownloads ? "Generating…" : "Unavailable")}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-caption font-semibold text-app-accent-text">
                {download ? "Download" : "Preparing"}
                <Download className="w-4 h-4" />
              </span>
            </Card>
            );
          })}

          {downloadError && (
            <p className="text-body font-semibold text-app-danger-text">{downloadError}</p>
          )}

          <p className="text-caption text-app-muted">
            Click the dedicated player above to download it. Use this CMS address in the player: {typeof window !== "undefined" ? window.location.origin : ""}
          </p>
        </div>
      </Modal>
    </div>
  );
}
