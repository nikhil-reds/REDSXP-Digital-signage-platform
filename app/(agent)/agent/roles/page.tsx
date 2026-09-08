import { Metadata } from "next";
import { TenantRoleManager } from "@/components/agent/roles/tenant-role-manager";

export const metadata: Metadata = {
  title: "Workspace Roles & Permissions | REDSXP Signage",
  description: "Manage custom roles and access permissions for team members in your workspace.",
};

export default function AgentRolesPage() {
  return <TenantRoleManager />;
}
