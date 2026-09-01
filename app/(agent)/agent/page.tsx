import React from "react";
import { RefreshCw, Send, Calendar } from "lucide-react";
import AgentStatsGrid from "@/components/agent/overview/stats-grid";
import HealthMapSection from "@/components/agent/overview/health-map-section";
import SchedulesPlayingSection from "@/components/agent/overview/schedules-playing-section";
import TrendsActivitySection from "@/components/agent/overview/trends-activity-section";
import { Button, IconButton, PageShell } from "@/components/ui";

export default function AgentPage() {
  return (
    <PageShell>
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border pb-5">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Good afternoon, Aarav
          </h1>
          <p className="text-body text-app-muted mt-1">
            Bengaluru Region · 19 locations · Updated just now (4 July 2026, 4:30 PM IST)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <IconButton
            icon={RefreshCw}
            variant="secondary"
            aria-label="Refresh live feeds"
            title="Refresh live feeds"
          />
          <Button variant="secondary" size="sm" icon={Calendar}>
            Today, 4 July 2026
          </Button>
          <Button variant="primary" size="sm" icon={Send}>
            Deploy content
          </Button>
        </div>
      </div>

      {/* 2. KPIs Stats Row */}
      <AgentStatsGrid />

      {/* 3. Screen Health Summary, Map & Needs Attention list */}
      <HealthMapSection />

      {/* 4. Active playlists, schedules timeline, quick actions */}
      <SchedulesPlayingSection />

      {/* 5. Charts and activity logs */}
      <TrendsActivitySection />
    </PageShell>
  );
}
