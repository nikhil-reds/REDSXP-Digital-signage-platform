import { NextRequest } from "next/server";
import { updateAdminStatus } from "@/lib/admin-user-status";

export async function POST(request: NextRequest, context: RouteContext<"/api/admin/users/[userId]/activate">) {
  const { userId } = await context.params;
  return updateAdminStatus(request, userId, true);
}
