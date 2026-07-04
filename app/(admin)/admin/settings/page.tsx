"use client";

import React, { useState } from "react";
import SettingsNav from "@/components/admin/settings/settings-nav";
import IdentitySettings from "@/components/admin/settings/identity-settings";
import OnboardingSettings from "@/components/admin/settings/onboarding-settings";
import DefaultsSettings from "@/components/admin/settings/defaults-settings";
import MaintenanceSettings from "@/components/admin/settings/maintenance-settings";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  const handleSave = () => {
    alert("Saving all changes...");
  };

  const handleDiscard = () => {
    alert("Changes discarded.");
  };

  return (
    <div className="py-6 px-15 space-y-6 mx-auto font-sans ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Platform Settings
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Global configuration for the Rubenius platform
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleDiscard}
            className="px-3.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-semibold text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-blue-600 dark:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            Save Changes
          </button>
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
    </div>
  );
}
