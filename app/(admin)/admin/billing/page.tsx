import React from "react";
import { Download } from "lucide-react";
import BillingStatsGrid from "@/components/admin/billing/stats-grid";
import BillingChartsSection from "@/components/admin/billing/charts-section";
import InvoicesTable from "@/components/admin/billing/invoices-table";
import CreditPanel from "@/components/admin/billing/credit-panel";
import SubscriptionMovementPanel from "@/components/admin/billing/movement-panel";
import { Button, PageShell } from "@/components/ui";

export default function BillingRevenuePage() {
  return (
    <PageShell className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-page-title font-bold tracking-tight text-app-text">
            Billing & Revenue
          </h1>
          <p className="text-caption text-app-muted">
            Cross-tenant revenue, subscriptions and invoicing · As of 2 Jul 2026, 4:30 PM IST
          </p>
        </div>
        <Button className="self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" />
          <span>Export report</span>
        </Button>
      </div>

      {/* 1. Stats Counter Grid */}
      <BillingStatsGrid />

      {/* 2. Line & Stacked Area Graphs */}
      <BillingChartsSection />

      {/* 3. Invoices List & Credits adjustments side panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoices Table list */}
        <div className="lg:col-span-2">
          <InvoicesTable />
        </div>

        {/* Action Form & Subscriptions Grid */}
        <div className="space-y-6">
          <CreditPanel />
          <SubscriptionMovementPanel />
        </div>
      </div>
    </PageShell>
  );
}
