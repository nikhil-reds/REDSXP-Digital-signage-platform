export interface SidebarUser {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: { name: string };
  tenant?: { name: string; slug: string } | null;
}

export function getSidebarProfile(user: SidebarUser) {
  const nameParts = [user.firstName, user.lastName].filter(
    (part): part is string => Boolean(part?.trim()),
  );
  const displayName = nameParts.join(" ") || user.email;
  const initials = nameParts.length
    ? nameParts.map((part) => part.charAt(0).toUpperCase()).join("").slice(0, 2)
    : user.email.charAt(0).toUpperCase();

  return {
    displayName,
    initials: initials || "U",
    roleName: user.role.name || "Member",
    tenantName: user.tenant?.name ?? null,
    tenantSlug: user.tenant?.slug?.toUpperCase() ?? null,
  };
}

export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
