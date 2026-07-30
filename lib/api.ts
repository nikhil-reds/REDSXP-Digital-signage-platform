import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";

export function apiError(message: string, status = 400, errors?: string[]) {
  return NextResponse.json(
    { success: false, message, ...(errors ? { errors } : {}) },
    { status },
  );
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function databaseError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1001") {
    return apiError("Database is unreachable. Check the database connection and try again.", 503);
  }

  console.error(error);
  return apiError("Something went wrong. Please try again.", 500);
}
