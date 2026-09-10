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
    if (request.headers.get("accept")?.includes("application/x-ndjson")) {
      const encoder = new TextEncoder();
      const send = (controller: ReadableStreamDefaultController<Uint8Array>, event: unknown) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };
      const chunks = result.reply.match(/\S+\s*/g) ?? [result.reply];
      let index = 0;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          send(controller, { type: "status" });
          const emitNext = () => {
            if (index < chunks.length) {
              send(controller, { type: "delta", text: chunks[index++] });
              timer = setTimeout(emitNext, 12);
              return;
            }
            if (result.cards.length) send(controller, { type: "cards", cards: result.cards });
            send(controller, { type: "complete" });
            controller.close();
          };
          emitNext();
        },
        cancel() {
          if (timer) clearTimeout(timer);
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(
      "CMS Assistant error:",
      error instanceof Error ? error.message : error,
      error instanceof Error && error.cause ? { cause: error.cause } : "",
    );
    return apiError("The assistant is unavailable right now. Please try again.", 502);
  }
}
