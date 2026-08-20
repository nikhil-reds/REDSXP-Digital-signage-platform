import { NextRequest, NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { requireAgent } from "@/lib/agent-auth";
import { runAssistant, type ChatMessage } from "@/lib/bedrock";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY = 12;

function parseHistory(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value)) return null;
  const history: ChatMessage[] = [];
  for (const entry of value.slice(-MAX_HISTORY)) {
    if (
      !entry ||
      typeof entry !== "object" ||
      (entry as { role?: unknown }).role !== "user" && (entry as { role?: unknown }).role !== "assistant" ||
      typeof (entry as { text?: unknown }).text !== "string"
    ) {
      return null;
    }
    const text = (entry as { text: string }).text.trim();
    if (!text || text.length > MAX_MESSAGE_LENGTH) return null;
    history.push({ role: (entry as { role: "user" | "assistant" }).role, text });
  }
  return history;
}

export async function POST(request: NextRequest) {
  const auth = await requireAgent(request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const history = parseHistory(body?.messages);
  if (!history || history.length === 0 || history[history.length - 1].role !== "user") {
    return apiError("Send a non-empty conversation ending with a user message.", 422);
  }

  try {
    const result = await runAssistant(history, auth.agent.tenantId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("CMS Assistant error", error);
    return apiError("The assistant is unavailable right now. Please try again.", 502);
  }
}
