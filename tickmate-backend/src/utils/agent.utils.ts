import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { ENV } from "../config/env.config.js";

const ticketAnalysisSchema = z.object({
  summary: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]),
  helpfulNotes: z.string().min(1),
  relatedSkills: z.array(z.string().min(1)),
});

type TicketAnalysis = z.infer<typeof ticketAnalysisSchema>;

type AnalyzeTicketInput = {
  title: string;
  description: string;
};

const openaiApiKey = ENV.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error("OPENAI_API_KEY is required to analyze tickets");
}

const model = new ChatOpenAI({
  model: "gpt-4.1-mini",
  temperature: 0.1,
});

const SYSTEM_PROMPT = `You are an expert AI assistant that processes technical support tickets.
Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.
IMPORTANT:
- Respond with only valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.`;

const extractJsonText = (raw: string): string => {
  const fencedMatch = raw.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return raw.slice(firstBrace, lastBrace + 1).trim();
  }

  return raw.trim();
};

const readModelContent = (
  content: string | Array<string | { text?: string }>
): string => {
  if (typeof content === "string") {
    return content;
  }

  return content
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }
      return typeof part.text === "string" ? part.text : "";
    })
    .join("\n");
};

const analyzeTicket = async (
  ticket: AnalyzeTicketInput
): Promise<TicketAnalysis | null> => {
  try {
    const response = await model.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(`Only return a strict JSON object with this exact shape:
{
  "summary": "Short summary of the ticket",
  "priority": "low|medium|high",
  "helpfulNotes": "Detailed technical notes and useful links",
  "relatedSkills": ["React", "PostgreSQL"]
}

Ticket information:
- Title: ${ticket.title}
- Description: ${ticket.description}`),
    ]);

    const raw = readModelContent(
      response.content as string | Array<string | { text?: string }>
    );
    const jsonText = extractJsonText(raw);
    const parsedJson: unknown = JSON.parse(jsonText);

    const parsed = ticketAnalysisSchema.safeParse(parsedJson);
    if (!parsed.success) {
      console.error("Failed to validate AI output", parsed.error.flatten());
      return null;
    }

    return parsed.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to analyze ticket", message);
    return null;
  }
};

export default analyzeTicket;
