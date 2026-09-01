import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { assertQuota } from "@/lib/features";
import { PERMISSIONS } from "@/lib/rbac";
import { requirePermission } from "@/lib/session";
import { getPresignedUploadUrl } from "@/lib/s3";

const BYTES_PER_GB = 1024 ** 3;

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, PERMISSIONS.MEDIA_CREATE);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const { filename, contentType, sizeBytes } = body;

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Filename and contentType are required" }, { status: 400 });
    }

    // Storage is checked here, before the URL is handed out — not after the
    // bytes land. Checking on completion lets every tenant exceed its cap by
    // exactly one large file, every time.
    const declared = Number(sizeBytes);
    const addingGb = Number.isFinite(declared) && declared > 0 ? declared / BYTES_PER_GB : 0;
    const overQuota = await assertQuota(auth.user.tenantId, "storageGb", addingGb);
    if (overQuota) return overQuota;

    // Namespaced per tenant so one workspace's objects are never reachable by
    // guessing another's key.
    const timestamp = Date.now();
    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const s3Key = `uploads/${auth.user.tenantId}/${timestamp}-${safeName}`;

    const presignedUrl = await getPresignedUploadUrl(s3Key, contentType);
    const cdnUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return NextResponse.json({ presignedUrl, s3Key, cdnUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return apiError("Failed to generate upload URL.", 500);
  }
}
