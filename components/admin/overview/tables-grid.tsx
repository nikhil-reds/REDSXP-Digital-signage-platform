"use client";

import React from "react";
import { Building2, CreditCard } from "lucide-react";
import { Badge, TableCard, Td, Th, Tr } from "@/components/ui";

const signups = [
  { name: "Third Wave Coffee", plan: "Enterprise", joined: "29 Jun", mrr: "₹48,000", status: "Active" },
  { name: "The Beer Café", plan: "Professional", joined: "27 Jun", mrr: "₹24,000", status: "Active" },
  { name: "Blue Tokai", plan: "Business", joined: "25 Jun", mrr: "₹18,000", status: "Trial" },
];
const failedPayments = [
  { name: "Urban Ladder", invoice: "INV-2026-06192", amount: "₹42,490", retry: "Suspended" },
  { name: "Fabindia", invoice: "INV-2026-06187", amount: "₹18,990", retry: "5 Jul" },
  { name: "Chai Point", invoice: "INV-2026-06172", amount: "₹14,990", retry: "5 Jul" },
];

export default function TablesGrid() {
  return <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <TableCard title="Recent tenant signups" icon={Building2}><table className="w-full min-w-[560px] border-collapse text-left"><thead className="bg-app-surface-alt"><tr><Th>Tenant</Th><Th>Plan</Th><Th>Joined</Th><Th className="text-right">MRR</Th><Th>Status</Th></tr></thead><tbody>{signups.map((item) => <Tr key={item.name}><Td className="font-semibold">{item.name}</Td><Td className="text-app-muted">{item.plan}</Td><Td className="text-app-muted">{item.joined}</Td><Td className="text-right font-semibold">{item.mrr}</Td><Td><Badge tone={item.status === "Active" ? "accent" : "warning"}>{item.status}</Badge></Td></Tr>)}</tbody></table></TableCard>
    <TableCard title="Failed payments" description="7 tenants require attention" icon={CreditCard}><table className="w-full min-w-[480px] border-collapse text-left"><thead className="bg-app-surface-alt"><tr><Th>Tenant</Th><Th>Invoice</Th><Th className="text-right">Amount</Th><Th>Retry</Th></tr></thead><tbody>{failedPayments.map((item) => <Tr key={item.invoice}><Td className="font-semibold">{item.name}</Td><Td className="text-app-muted">{item.invoice}</Td><Td className="text-right font-semibold text-app-danger-text">{item.amount}</Td><Td><Badge tone={item.retry === "Suspended" ? "neutral" : "danger"}>{item.retry}</Badge></Td></Tr>)}</tbody></table></TableCard>
  </div>;
}
