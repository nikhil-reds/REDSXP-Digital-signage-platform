"use client";

import React, { useCallback, useEffect, useState } from "react";
import TenantsTable, {
  type PlanOption,
  type Tenant,
  type TenantsPagination,
  type TenantsSummary,
} from "@/components/admin/tenants/tenants-table";
import CreateTenantForm, {
  type CreateTenantPayload,
} from "@/components/admin/tenants/create-tenant-form";

type TenantsResponse = {
  tenants: Tenant[];
  pagination: TenantsPagination;
  summary: TenantsSummary;
  planOptions: PlanOption[];
};

const emptyData: TenantsResponse = {
  tenants: [],
  pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
  summary: { total: 0, active: 0, trial: 0, pastDue: 0, suspended: 0 },
  planOptions: [],
};

export default function TenantsPage() {
  const [data, setData] = useState<TenantsResponse>(emptyData);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [plan, setPlan] = useState("ALL");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), status, plan });
      if (search) params.set("search", search);
      const response = await fetch(`/api/admin/tenants?${params}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load tenants.");
      setData(result.data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load tenants.");
    } finally {
      setIsLoading(false);
    }
  }, [page, status, plan, search]);

  useEffect(() => {
    // Debounced so typing in the search box does not fire a request per keystroke.
    const timer = setTimeout(() => void loadTenants(), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadTenants, search]);

  const handleFilterChange = (next: { status?: string; plan?: string; search?: string }) => {
    if (next.status !== undefined) setStatus(next.status);
    if (next.plan !== undefined) setPlan(next.plan);
    if (next.search !== undefined) setSearch(next.search);
    setPage(1);
  };

  const handleSave = async (payload: CreateTenantPayload) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await fetch("/api/admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.errors?.[0] || result.message || "Unable to create tenant.");
      }
      setIsCreateOpen(false);
      setPage(1);
      await loadTenants();
    } catch (createError) {
      setSaveError(createError instanceof Error ? createError.message : "Unable to create tenant.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-app-canvas font-sans text-app-text">
      {/* Main Table Section */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden min-w-0">
        {/* Breadcrumb */}
        <div className="mb-4 flex select-none items-center gap-1.5 text-caption font-semibold text-app-muted">
          <span>Admin</span>
          <span>&gt;</span>
          <span className="text-app-text">Tenants</span>
        </div>

        {/* Content View Container */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <TenantsTable
            tenants={data.tenants}
            pagination={data.pagination}
            summary={data.summary}
            planOptions={data.planOptions}
            search={search}
            status={status}
            plan={plan}
            isLoading={isLoading}
            error={error}
            onFilterChange={handleFilterChange}
            onPageChange={setPage}
            onRefresh={loadTenants}
            onAddTenantClick={() => {
              setSaveError(null);
              setIsCreateOpen(true);
            }}
          />
        </div>
      </div>

      {/* Slide-out Create Form */}
      {isCreateOpen && (
        <CreateTenantForm
          planOptions={data.planOptions}
          isSaving={isSaving}
          error={saveError}
          onClose={() => setIsCreateOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
