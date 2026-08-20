import {
  BedrockRuntimeClient,
  ConverseCommand,
  type ContentBlock,
  type Message,
} from "@aws-sdk/client-bedrock-runtime";
import { ASSISTANT_TOOLS, executeAssistantTool, type AssistantToolName } from "@/lib/assistant-tools";

const REGION = process.env.BEDROCK_REGION ?? process.env.AWS_REGION ?? "us-east-1";
const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-3-5-sonnet-20241022-v2:0";

let client: BedrockRuntimeClient | null = null;

function getClient() {
  if (!client) {
    const accessKeyId = process.env.BEDROCK_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
      throw new Error("Bedrock credentials are not configured (set BEDROCK_ACCESS_KEY_ID/BEDROCK_SECRET_ACCESS_KEY or AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY).");
    }
    client = new BedrockRuntimeClient({ region: REGION, credentials: { accessKeyId, secretAccessKey } });
  }
  return client;
}

const SYSTEM_PROMPT = `You are the CMS Assistant, a read-only helper inside a digital signage admin/agent panel.
You can look up screens, schedules, playlists, media, alerts, tickets, and dashboard summaries using the tools provided.
Rules:
- Only use the provided tools to look up data. Never invent screen names, statuses, or numbers.
- You cannot make any changes to the system — you are read-only. If asked to create, update, delete, or otherwise act on something, explain that you can only look things up right now.
- Keep answers short, concrete, and specific (names, statuses, counts, times). Use the tool results as the source of truth.
- When a tool returns no results, say so plainly instead of guessing.`;

export type ChatMessage = { role: "user" | "assistant"; text: string };

export type AssistantReply = {
  reply: string;
  cards: { title: string; subtitle?: string; badge?: string; href?: string }[];
};

const MAX_TOOL_ROUNDS = 4;

export async function runAssistant(history: ChatMessage[], tenantId: string): Promise<AssistantReply> {
  const messages: Message[] = history.map((m) => ({
    role: m.role,
    content: [{ text: m.text }],
  }));

  const allCards: AssistantReply["cards"] = [];
  const bedrock = getClient();

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await bedrock.send(
      new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: SYSTEM_PROMPT }],
        messages,
        toolConfig: { tools: ASSISTANT_TOOLS as never },
        inferenceConfig: { maxTokens: 1024, temperature: 0.2 },
      }),
    );

    const output = response.output?.message;
    if (!output) break;
    messages.push(output);

    if (response.stopReason !== "tool_use") {
      const text = (output.content ?? [])
        .map((block) => ("text" in block ? block.text : ""))
        .join("\n")
        .trim();
      return { reply: text || "I couldn't find an answer for that.", cards: allCards };
    }

    const toolResultContent: ContentBlock[] = [];
    for (const block of output.content ?? []) {
      if (!("toolUse" in block) || !block.toolUse) continue;
      const { toolUseId, name, input } = block.toolUse;
      try {
        const result = await executeAssistantTool(
          name as AssistantToolName,
          (input as Record<string, unknown>) ?? {},
          tenantId,
        );
        allCards.push(...result.cards);
        toolResultContent.push({
          toolResult: {
            toolUseId,
            content: [{ json: result.data as Record<string, unknown> }],
          },
        } as ContentBlock);
      } catch (error) {
        console.error(`Assistant tool "${name}" failed`, error);
        toolResultContent.push({
          toolResult: {
            toolUseId,
            content: [{ text: "This lookup failed. Let the agent know the data could not be retrieved." }],
            status: "error" as const,
          },
        } as ContentBlock);
      }
    }

    messages.push({ role: "user", content: toolResultContent });
  }

  return {
    reply: "I found some information but need a more specific question to summarize it well.",
    cards: allCards,
  };
}
