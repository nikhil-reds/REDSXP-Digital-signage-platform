"use client";

import React, { useState } from "react";
import SettingsNav from "@/components/admin/settings/settings-nav";
import IdentitySettings from "@/components/admin/settings/identity-settings";
import OnboardingSettings from "@/components/admin/settings/onboarding-settings";
import DefaultsSettings from "@/components/admin/settings/defaults-settings";
import MaintenanceSettings from "@/components/admin/settings/maintenance-settings";
import { Button, PageShell } from "@/components/ui";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  const handleSave = () => {
    alert("Saving all changes...");
  };

  const handleDiscard = () => {
    alert("Changes discarded.");
  };

  return (
    <PageShell className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="font-heading text-h5 font-semibold tracking-headline text-app-text">
            Platform Settings
          </h1>
          <p className="text-body text-app-muted mt-1">
            Global configuration for the Rubenius platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleDiscard}>
            Discard
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main settings grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left tabs menu */}
        <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right content panels stack */}
        <div className="flex-1 space-y-6 w-full lg:max-w-4xl">
          <IdentitySettings />
          <OnboardingSettings />
          <DefaultsSettings />
          <MaintenanceSettings />
        </div>
      </div>
    </PageShell>
  );
}
