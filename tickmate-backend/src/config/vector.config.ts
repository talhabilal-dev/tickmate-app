import { QdrantClient } from "@qdrant/js-client-rest";
import { ENV } from "./env.config.js";

if (!ENV.QDRANT_URL) {
    throw new Error("QDRANT_URL is not configured in environment variables");
}

if (!ENV.QDRANT_API_KEY) {
    throw new Error("QDRANT_API_KEY is not configured in environment variables");
}

export const client = new QdrantClient({
    url: ENV.QDRANT_URL,
    apiKey: ENV.QDRANT_API_KEY,
});
