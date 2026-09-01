"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Layers, List, Grid, Plus } from "lucide-react";
import GroupsGrid, { ScreenGroup } from "@/components/agent/screen-groups/groups-grid";
import GroupsTable from "@/components/agent/screen-groups/groups-table";
import GroupEditModal from "@/components/agent/screen-groups/group-edit-modal";
import { fetchScreenGroups } from "@/components/agent/screen-groups/api";
import {
  Button,
  Card,
  EmptyState,
  PageShell,
  SearchInput,
  SegmentedControl,
  SkeletonCardGrid,
  SkeletonTable,
} from "@/components/ui";

export default function AgentScreenGroupsPage() {
  const [groups, setGroups] = useState<ScreenGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<ScreenGroup | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  // Plan §2: skeleton on first load only — a refetch keeps the current content
  // on screen rather than replacing it with grey bars.
  const isFirstLoad = isLoading && groups.length === 0;


  const loadGroups = useCallback(() => {
    return fetchScreenGroups()
      .then(setGroups)
      .catch((err) => console.error("Failed to load screen groups:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Search filter
  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.playlist.toLowerCase().includes(search.toLowerCase()) ||
      g.schedule.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaved = () => {
    setSelectedGroup(null);
    setIsCreatingGroup(false);
    loadGroups();
  };

  return (
    <PageShell>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5 shrink-0">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Screen Groups
          </h1>
          <p className="text-body text-app-muted mt-1">
            Organize screens into functional categories to deploy and schedule content loops in bulk.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SegmentedControl
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: "grid", label: "Grid view", icon: Grid },
              { value: "table", label: "Table list view", icon: List },
            ]}
          />

          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreatingGroup(true)}>
            Create Group
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <Card size="widget" padded>
        <SearchInput
          placeholder="Search group name, assigned playlists, schedules…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md"
        />
      </Card>

      {/* Render Area */}
      <div className="flex-1">
        {isFirstLoad ? (
          viewMode === "grid" ? (
            <SkeletonCardGrid count={6} columns={3} label="Loading screen groups…" />
          ) : (
            <Card size="panel" className="overflow-hidden">
              <SkeletonTable rows={6} cols={9} label="Loading screen groups…" />
            </Card>
          )
        ) : groups.length === 0 ? (
          <Card size="panel" className="min-h-[300px] flex items-center justify-center">
            <EmptyState
              icon={Layers}
              title="No screen groups yet"
              description="Create a group to organize screens and bulk-deploy content."
              action={
                <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCreatingGroup(true)}>
                  Create Group
                </Button>
              }
            />
          </Card>
        ) : viewMode === "grid" ? (
          <GroupsGrid groups={filteredGroups} onEditGroup={(g) => setSelectedGroup(g)} />
        ) : (
          <GroupsTable groups={filteredGroups} onEditGroup={(g) => setSelectedGroup(g)} />
        )}
      </div>

      {/* Render Modal */}
      {(selectedGroup || isCreatingGroup) && (
        <GroupEditModal
          group={selectedGroup}
          onClose={() => {
            setSelectedGroup(null);
            setIsCreatingGroup(false);
          }}
          onSaved={handleSaved}
        />
      )}
    </PageShell>
  );
}
