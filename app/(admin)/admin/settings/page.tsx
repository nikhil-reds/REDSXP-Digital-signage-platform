"use client";

import React, { useState } from "react";
import SettingsNav, { SETTINGS_SECTION_BY_TAB } from "@/components/admin/settings/settings-nav";
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const sectionId = SETTINGS_SECTION_BY_TAB[tab];
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <SettingsNav activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Right content panels stack */}
        <div className="flex-1 space-y-6 w-full lg:max-w-4xl">
          <section id="platform-identity" className="scroll-mt-6" aria-label="General, branding, and authentication settings">
            <IdentitySettings />
          </section>
          <section id="trial-onboarding" className="scroll-mt-6" aria-label="Billing and email settings">
            <OnboardingSettings />
          </section>
          <section id="tenant-defaults" className="scroll-mt-6" aria-label="Storage and API settings">
            <DefaultsSettings />
          </section>
          <section id="maintenance-mode" className="scroll-mt-6" aria-label="Security and maintenance settings">
            <MaintenanceSettings />
          </section>
        </div>
      </div>
    </PageShell>
  );
}
