import { Metadata } from "next";
import { AdminRoleManager } from "@/components/admin/roles/admin-role-manager";

export const metadata: Metadata = {
  title: "Platform Roles & Permissions | REDSXP Admin",
  description: "Manage platform super administrator roles and system access controls.",
};

export default function AdminRolesPage() {
  return <AdminRoleManager />;
}
