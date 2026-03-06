import { OpenAIEmbeddings } from "@langchain/openai";
import { ENV } from "../config/env.config.js";

const COLLECTION_NAME = "tickmate_db";
const EMBEDDING_MODEL = "text-embedding-3-small";

type TicketVectorSource = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "completed";
  helpfulNotes: string | null;
  relatedSkills: string[];
  isPublic: boolean;
  createdBy: number | null;
  assignedTo: number | null;
  createdAt: Date;
  updatedAt: Date;
};

type SimilarTicketSearchInput = {
  title: string;
  description: string;
  category?: string;
  limit?: number;
  minScore?: number;
};

type SimilarTicketResult = {
  score: number;
  ticket: {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    helpfulNotes: string | null;
    relatedSkills: string[];
    createdBy: number | null;
    assignedTo: number | null;
    createdAt: string;
    updatedAt: string;
  };
};

let embeddings: OpenAIEmbeddings | null = null;

const getEmbeddings = () => {
  if (!ENV.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (!embeddings) {
    embeddings = new OpenAIEmbeddings({
      apiKey: ENV.OPENAI_API_KEY,
      model: EMBEDDING_MODEL,
    });
  }

  return embeddings;
};

const getQdrantUrl = () => {
  if (!ENV.QDRANT_URL) {
    throw new Error("QDRANT_URL is not configured");
  }

  return ENV.QDRANT_URL.replace(/\/+$/, "");
};

const qdrantHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (ENV.QDRANT_API_KEY) {
    headers["api-key"] = ENV.QDRANT_API_KEY;
  }

  return headers;
};

const qdrantRequest = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${getQdrantUrl()}${path}`, {
    ...init,
    headers: {
      ...qdrantHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  return response;
};

const buildTicketEmbeddingText = (ticket: {
  title: string;
  description: string;
  category: string;
  helpfulNotes: string | null;
  relatedSkills: string[];
}) => {
  return [
    `Title: ${ticket.title}`,
    `Category: ${ticket.category}`,
    `Description: ${ticket.description}`,
    ticket.helpfulNotes ? `Helpful Notes: ${ticket.helpfulNotes}` : "",
    ticket.relatedSkills.length
      ? `Related Skills: ${ticket.relatedSkills.join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
};

const ensureCollection = async (vectorSize: number) => {
  const checkResponse = await qdrantRequest(`/collections/${COLLECTION_NAME}`, {
    method: "GET",
  });

  if (checkResponse.ok) {
    return;
  }

  if (checkResponse.status !== 404) {
    const errorText = await checkResponse.text();
    throw new Error(`Failed to read Qdrant collection: ${errorText}`);
  }

  const createResponse = await qdrantRequest(`/collections/${COLLECTION_NAME}`, {
    method: "PUT",
    body: JSON.stringify({
      vectors: {
        size: vectorSize,
        distance: "Cosine",
      },
    }),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Failed to create Qdrant collection: ${errorText}`);
  }
};

const ensurePayloadIndex = async (
  fieldName: string,
  fieldSchema: "keyword" | "bool"
) => {
  const response = await qdrantRequest(`/collections/${COLLECTION_NAME}/index`, {
    method: "PUT",
    body: JSON.stringify({
      field_name: fieldName,
      field_schema: fieldSchema,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    // Qdrant may return an error when index already exists; treat that as success.
    if (errorText.toLowerCase().includes("already exists")) {
      return;
    }

    throw new Error(`Failed to create Qdrant index for ${fieldName}: ${errorText}`);
  }
};

const ensureCollectionIndexes = async () => {
  await ensurePayloadIndex("status", "keyword");
  await ensurePayloadIndex("isPublic", "bool");
};

export const upsertResolvedPublicTicketVector = async (
  ticket: TicketVectorSource
) => {
  if (ticket.status !== "completed" || !ticket.isPublic) {
    return;
  }

  const embeddingText = buildTicketEmbeddingText(ticket);
  const vector = await getEmbeddings().embedQuery(embeddingText);

  await ensureCollection(vector.length);
  await ensureCollectionIndexes();

  const response = await qdrantRequest(
    `/collections/${COLLECTION_NAME}/points?wait=true`,
    {
      method: "PUT",
      body: JSON.stringify({
        points: [
          {
            id: ticket.id,
            vector,
            payload: {
              ticketId: ticket.id,
              title: ticket.title,
              description: ticket.description,
              category: ticket.category,
              status: ticket.status,
              helpfulNotes: ticket.helpfulNotes,
              relatedSkills: ticket.relatedSkills,
              isPublic: ticket.isPublic,
              createdBy: ticket.createdBy,
              assignedTo: ticket.assignedTo,
              createdAt: ticket.createdAt.toISOString(),
              updatedAt: ticket.updatedAt.toISOString(),
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upsert vector: ${errorText}`);
  }
};

export const deleteTicketVector = async (ticketId: number) => {
  const response = await qdrantRequest(
    `/collections/${COLLECTION_NAME}/points/delete?wait=true`,
    {
      method: "POST",
      body: JSON.stringify({
        points: [ticketId],
      }),
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Failed to delete vector: ${errorText}`);
  }
};

export const searchSimilarResolvedPublicTickets = async (
  input: SimilarTicketSearchInput
): Promise<SimilarTicketResult[]> => {
  const configuredMinScore = Number(ENV.SIMILAR_TICKET_MIN_SCORE ?? "0.75");
  const minScore = Number.isFinite(configuredMinScore)
    ? configuredMinScore
    : 0.75;

  const vector = await getEmbeddings().embedQuery(
    [
      `Title: ${input.title}`,
      input.category ? `Category: ${input.category}` : "",
      `Description: ${input.description}`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  await ensureCollection(vector.length);
  await ensureCollectionIndexes();

  const response = await qdrantRequest(
    `/collections/${COLLECTION_NAME}/points/search`,
    {
      method: "POST",
      body: JSON.stringify({
        vector,
        limit: input.limit ?? 5,
        with_payload: true,
        filter: {
          must: [
            { key: "status", match: { value: "completed" } },
            { key: "isPublic", match: { value: true } },
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to search vectors: ${errorText}`);
  }

  const data = (await response.json()) as {
    result?: Array<{ score: number; payload?: Record<string, unknown> }>;
  };

  const result = data.result ?? [];

  return result
    .filter((item) => item.score >= (input.minScore ?? minScore))
    .map((item) => {
      const payload = item.payload;

      if (!payload) {
        return null;
      }

      return {
        score: item.score,
        ticket: {
          id: Number(payload.ticketId),
          title: String(payload.title ?? ""),
          description: String(payload.description ?? ""),
          category: String(payload.category ?? ""),
          status: String(payload.status ?? ""),
          helpfulNotes:
            payload.helpfulNotes === null || typeof payload.helpfulNotes === "undefined"
              ? null
              : String(payload.helpfulNotes),
          relatedSkills: Array.isArray(payload.relatedSkills)
            ? payload.relatedSkills.map((skill) => String(skill))
            : [],
          createdBy:
            payload.createdBy === null || typeof payload.createdBy === "undefined"
              ? null
              : Number(payload.createdBy),
          assignedTo:
            payload.assignedTo === null || typeof payload.assignedTo === "undefined"
              ? null
              : Number(payload.assignedTo),
          createdAt: String(payload.createdAt ?? ""),
          updatedAt: String(payload.updatedAt ?? ""),
        },
      };
    })
    .filter((item): item is SimilarTicketResult => Boolean(item));
};
