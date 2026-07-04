"use client";

import React, { useState } from "react";
import TenantsTable from "@/components/admin/tenants/tenants-table";
import CreateTenantForm from "@/components/admin/tenants/create-tenant-form";

interface Tenant {
  id: string;
  name: string;
  status: "Active" | "Trial" | "Past Due" | "Suspended";
  plan: "Enterprise" | "Business" | "Growth";
  mrr: number;
  screensActive: number;
  screensTotal: number;
  storageUsed: number; // in GB
  storageTotal: number; // in GB
  customDomain: string;
}

const initialTenants: Tenant[] = [
  {
    id: "1",
    name: "Reliance Retail Media",
    status: "Active",
    plan: "Enterprise",
    mrr: 385000,
    screensActive: 806,
    screensTotal: 824,
    storageUsed: 8601.6, // 8.4 TB
    storageTotal: 12288, // 12 TB
    customDomain: "screens.reliancemedia.in"
  },
  {
    id: "2",
    name: "Café Coffee Day",
    status: "Active",
    plan: "Business",
    mrr: 129990,
    screensActive: 297,
    screensTotal: 312,
    storageUsed: 2150.4, // 2.1 TB
    storageTotal: 3072, // 3 TB
    customDomain: "signage.cafecoffeeday.com"
  },
  {
    id: "3",
    name: "Apollo Pharmacies",
    status: "Active",
    plan: "Enterprise",
    mrr: 248000,
    screensActive: 574,
    screensTotal: 601,
    storageUsed: 5939.2, // 5.8 TB
    storageTotal: 8192, // 8 TB
    customDomain: "display.apollopharmacies.in"
  },
  {
    id: "4",
    name: "Decathlon India",
    status: "Active",
    plan: "Business",
    mrr: 104500,
    screensActive: 183,
    screensTotal: 188,
    storageUsed: 1740.8, // 1.7 TB
    storageTotal: 2560, // 2.5 TB
    customDomain: "screens.decathlon.in"
  },
  {
    id: "5",
    name: "PVR INOX",
    status: "Active",
    plan: "Enterprise",
    mrr: 295000,
    screensActive: 449,
    screensTotal: 476,
    storageUsed: 7372.8, // 7.2 TB
    storageTotal: 10240, // 10 TB
    customDomain: "media.pvrinox.com"
  },
  {
    id: "6",
    name: "Blue Tokai Coffee",
    status: "Trial",
    plan: "Growth",
    mrr: 0,
    screensActive: 17,
    screensTotal: 18,
    storageUsed: 112, // 112 GB
    storageTotal: 250, // 250 GB
    customDomain: "demo.bluetokaicoffee.com"
  },
  {
    id: "7",
    name: "Metro Brands",
    status: "Past Due",
    plan: "Business",
    mrr: 89990,
    screensActive: 121,
    screensTotal: 143,
    storageUsed: 1331.2, // 1.3 TB
    storageTotal: 2048, // 2 TB
    customDomain: "signage.metrobrands.in"
  },
  {
    id: "8",
    name: "Urban Ladder",
    status: "Suspended",
    plan: "Growth",
    mrr: 49990,
    screensActive: 0,
    screensTotal: 62,
    storageUsed: 440, // 440 GB
    storageTotal: 500, // 500 GB
    customDomain: "screens.urbanladder.com"
  }
];

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSave = (newTenant: {
    name: string;
    slug: string;
    ownerName: string;
    ownerEmail: string;
    plan: "Enterprise" | "Business" | "Growth";
    trialEndDate: string;
    screenQuota: number;
    storageLimit: number;
    primaryColor: string;
    whiteLabelName: string;
    customDomain: string;
  }) => {
    const created: Tenant = {
      id: String(tenants.length + 1),
      name: newTenant.name,
      status: "Active",
      plan: newTenant.plan,
      mrr: newTenant.plan === "Enterprise" ? 250000 : newTenant.plan === "Business" ? 100000 : 50000,
      screensActive: 0,
      screensTotal: newTenant.screenQuota,
      storageUsed: 0,
      storageTotal: newTenant.storageLimit,
      customDomain: newTenant.customDomain || `${newTenant.slug}.rubenius.com`
    };
    setTenants([created, ...tenants]);
    setIsCreateOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Main Table Section */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-semibold mb-4 select-none">
          <span>Admin</span>
          <span>&gt;</span>
          <span className="text-zinc-700 dark:text-zinc-350">Tenants</span>
        </div>

        {/* Content View Container */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <TenantsTable
            tenants={tenants}
            onAddTenantClick={() => setIsCreateOpen(true)}
          />
        </div>
      </div>

      {/* Slide-out Create Form */}
      {isCreateOpen && (
        <CreateTenantForm
          onClose={() => setIsCreateOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
