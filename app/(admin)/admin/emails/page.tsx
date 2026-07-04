"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import TemplatesList from "@/components/admin/emails/templates-list";
import TemplatePreview from "@/components/admin/emails/template-preview";

interface TemplateDetails {
  id: string;
  name: string;
  category: "Transactional" | "Marketing";
  date: string;
  subject: string;
  fromName: string;
  variables: string[];
  body: string;
}

const initialTemplates: TemplateDetails[] = [
  {
    id: "1",
    name: "Welcome Email",
    category: "Transactional",
    date: "1 Jun 2026",
    subject: "Welcome to Rubenius Platform!",
    fromName: "Rubenius Team",
    variables: ["{{tenant_name}}", "{{login_url}}", "{{setup_guide_url}}"],
    body: "Welcome to Rubenius!\n\nYour account has been successfully configured. Click below to access your workspace portal."
  },
  {
    id: "2",
    name: "Trial Expiry Reminder",
    category: "Transactional",
    date: "28 Jun 2026",
    subject: "Your Rubenius trial expires in {{days}} days",
    fromName: "Rubenius Platform",
    variables: ["{{tenant_name}}", "{{days}}", "{{expiry_date}}", "{{upgrade_url}}"],
    body: "Your trial is ending soon. You have {{days}} days left before your workspace is paused.\n\nUpgrade now to keep your screens, analytics, and automations running without interruption."
  },
  {
    id: "3",
    name: "Payment Failed – Attempt 1",
    category: "Transactional",
    date: "15 Jun 2026",
    subject: "[Urgent] Payment Failed for invoice {{invoice_id}}",
    fromName: "Rubenius Billing",
    variables: ["{{tenant_name}}", "{{invoice_id}}", "{{payment_amount}}", "{{billing_link}}"],
    body: "We were unable to process your transaction. Please update your card details using the portal link."
  },
  {
    id: "4",
    name: "Payment Failed – Attempt 3 / Suspension Warning",
    category: "Transactional",
    date: "15 Jun 2026",
    subject: "[Action Required] Final suspension warning",
    fromName: "Rubenius Support",
    variables: ["{{tenant_name}}", "{{days_remaining}}", "{{billing_link}}"],
    body: "Your subscription is currently overdue. Your screens will be deactivated within {{days_remaining}} days unless payment is processed."
  },
  {
    id: "5",
    name: "Invoice Generated",
    category: "Transactional",
    date: "1 Jun 2026",
    subject: "Invoice {{invoice_id}} has been generated",
    fromName: "Rubenius Billing",
    variables: ["{{tenant_name}}", "{{invoice_id}}", "{{amount}}", "{{download_link}}"],
    body: "Your invoice for this month is ready. You can download the invoice from the link below."
  },
  {
    id: "6",
    name: "Subscription Upgraded",
    category: "Transactional",
    date: "20 Jun 2026",
    subject: "Your plan upgrade is successful!",
    fromName: "Rubenius Platform",
    variables: ["{{tenant_name}}", "{{plan_name}}", "{{screens_quota}}"],
    body: "Your workspace has been successfully upgraded to the {{plan_name}} plan. Your active screen limit is now updated."
  },
  {
    id: "7",
    name: "Subscription Downgraded",
    category: "Transactional",
    date: "20 Jun 2026",
    subject: "Your plan downgrade confirmation",
    fromName: "Rubenius Platform",
    variables: ["{{tenant_name}}", "{{plan_name}}"],
    body: "This is to confirm that your plan has been updated to {{plan_name}}."
  },
  {
    id: "8",
    name: "Account Suspended",
    category: "Transactional",
    date: "10 Jun 2026",
    subject: "Workspace access suspended",
    fromName: "Rubenius Security",
    variables: ["{{tenant_name}}", "{{reason}}", "{{support_email}}"],
    body: "Your workspace has been temporarily suspended due to billing delinquency. Please contact support."
  },
  {
    id: "9",
    name: "Monthly Usage Summary",
    category: "Marketing",
    date: "25 Jun 2026",
    subject: "Your usage snapshot for last month",
    fromName: "Rubenius Analytics",
    variables: ["{{tenant_name}}", "{{impressions}}", "{{uptime_percentage}}"],
    body: "Here is your monthly screens summary report. Your total impressions reached {{impressions}} last month."
  },
  {
    id: "10",
    name: "Platform Feature Announcement",
    category: "Marketing",
    date: "2 Jul 2026",
    subject: "Introducing new advanced analytics dashboards!",
    fromName: "Rubenius Product team",
    variables: ["{{tenant_name}}", "{{dashboard_link}}"],
    body: "We have rolled out high-fidelity dashboard views for tracking screen impressions. Try it now."
  }
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateDetails[]>(initialTemplates);
  const [selectedId, setSelectedId] = useState("2"); // Trial Expiry Reminder is selected by default as in the screenshot

  const activeTemplate = templates.find((t) => t.id === selectedId) || templates[1];

  const handleSaveTemplate = (id: string, updatedSubject: string, updatedFromName: string, updatedBody: string) => {
    setTemplates(
      templates.map((t) =>
        t.id === id ? { ...t, subject: updatedSubject, fromName: updatedFromName, body: updatedBody } : t
      )
    );
    alert("Template saved successfully!");
  };

  const handleAddNewTemplate = () => {
    const newId = String(templates.length + 1);
    const added: TemplateDetails = {
      id: newId,
      name: "New Custom Template",
      category: "Transactional",
      date: "3 Jul 2026",
      subject: "Template Subject line",
      fromName: "Rubenius Platform",
      variables: ["{{tenant_name}}"],
      body: "Write your email message here."
    };

    setTemplates([...templates, added]);
    setSelectedId(newId);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Left side templates catalogue */}
      <div className="w-80 flex flex-col p-6 overflow-hidden shrink-0 pr-3">
        {/* Header */}
        <div className="flex flex-col gap-0.5 mb-5 select-none shrink-0">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Email Templates
          </h1>
          <p className="text-xs text-zinc-550 dark:text-zinc-400">
            Manage transactional and marketing email templates sent via AWS SES
          </p>
        </div>

        {/* Templates catalogue list */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <TemplatesList
            templates={templates}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id)}
          />
        </div>
      </div>

      {/* Main editor and preview canvas */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden pl-3">
        {/* New Template button row */}
        <div className="flex justify-end mb-5 select-none shrink-0">
          <button
            onClick={handleAddNewTemplate}
            className="flex items-center gap-1.5 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-955 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Template</span>
          </button>
        </div>

        {/* Live editor component */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <TemplatePreview
            template={activeTemplate}
            onSave={handleSaveTemplate}
          />
        </div>
      </div>
    </div>
  );
}
