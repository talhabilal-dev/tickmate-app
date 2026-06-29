# Semantic Search Implementation Analysis

## Summary
The semantic search functionality is **partially implemented** but has several **critical bugs** that prevent it from working correctly.

---

## Architecture Overview

### Flow:
1. **Ticket Creation** → Inngest async job (`on-ticket-create.ts`)
2. **AI Analysis** → OpenAI GPT-4.1-mini analyzes ticket (NOT creating embeddings here)
3. **Ticket Completion** → When marked as "completed", embedding created and stored in Qdrant
4. **Similarity Search** → User queries, embedding created, Qdrant searches for similar vectors

### Components:
- **AI Analysis**: `src/utils/agent.utils.ts` - Uses OpenAI to analyze ticket content
- **Vector Operations**: `src/utils/vector-db.utils.ts` - Qdrant embedding & search
- **Inngest Job**: `src/inngest/functions/on-ticket-create.ts` - Async ticket processing
- **Controller**: `src/controllers/ticket.controller.ts` - API endpoints

---

## Critical Issues

### ❌ Issue #1: **Embeddings Never Created on Ticket Creation**

**Location**: `src/inngest/functions/on-ticket-create.ts`

**Problem**: The Inngest job that runs when a ticket is created does NOT call any vector embedding function. It only calls `analyzeTicket()` which uses GPT-4.1-mini for analysis, NOT for creating embeddings.

**Current Flow**:
```typescript
// on-ticket-create.ts
const aiResponse = await analyzeTicket({...}); // ❌ Only does AI analysis, NO embeddings
```

**Expected Flow**:
```typescript
// Should also create embedding when ticket is completed
if (ticket.status === 'completed' && ticket.isPublic) {
  await upsertResolvedPublicTicketVector(ticket);
}
```

**Impact**: 🔴 **CRITICAL** - Tickets created and immediately completed won't have embeddings until they're manually updated.

---

### ❌ Issue #2: **Schema Mismatch in `searchSimilarResolvedPublicTickets`**

**Location**: `src/controllers/ticket.controller.ts:41-59`

**Problem**: The controller builds a `searchInput` object with `title` and `category` fields, but the actual function signature in `vector-db.utils.ts` only accepts `description`, `limit`, and `minScore`.

**Controller Code**:
```typescript
const searchInput: {
  title: string;           // ❌ NOT used by searchSimilarResolvedPublicTickets
  description: string;
  category?: string;       // ❌ NOT used by searchSimilarResolvedPublicTickets
  limit?: number;
} = {
  title,
  description,
};

if (typeof category !== "undefined") {
  searchInput.category = category;  // ❌ This field is ignored
}
```

**Function Signature**:
```typescript
// vector-db.utils.ts:189-191
export const searchSimilarResolvedPublicTickets = async (
  input: SimilarTicketSearchInput,  // { description, limit?, minScore? }
): Promise<SimilarTicketResult[]>
```

**Impact**: 🟡 **MEDIUM** - Title and category are sent but ignored. Search only uses description.

---

### ❌ Issue #3: **Embedding Text Excludes Title in Search**

**Location**: `src/utils/vector-db.utils.ts:198-200`

**Problem**: When creating the query embedding for search, only the description is used. However, when upserting tickets, the full context (title, category, description, notes, skills) is used via `buildTicketEmbeddingText()`.

**Search Query Text** (line 198):
```typescript
const queryText = [`Description: ${input.description}`]  // ❌ Only description
  .filter(Boolean)
  .join("\n");
```

**Upsert Embedding Text** (line 138):
```typescript
const embeddingText = buildTicketEmbeddingText(ticket);  // ✅ Includes title, category, notes, skills
```

**Impact**: 🟡 **MEDIUM** - Search is less accurate because it doesn't match against the full ticket context that was indexed.

---

### ✅ Issue #4: **Qdrant API Key Not Needed for Local Setup**

**Location**: `src/config/vector.config.ts:8-10`

**Problem**: Local Qdrant doesn't require an API key, but the config throws an error if `QDRANT_API_KEY` is not set.

**Current Code**:
```typescript
if (!ENV.QDRANT_API_KEY) {
    throw new Error("QDRANT_API_KEY is not configured in environment variables");
}
```

**Impact**: 🟠 **LOW** - Blocks local development. Can be worked around by setting a dummy value.

---

### ⚠️ Issue #5: **Missing Qdrant API Key in .env**

**Location**: `/tickmate-backend/.env:4`

**Problem**: `QDRANT_API_KEY` is missing from the `.env` file.

**Current .env**:
```env
QDRANT_URL=http://localhost:6333
# QDRANT_API_KEY missing
```

**Impact**: 🔴 **CRITICAL** - Application will crash on startup due to Issue #4.

---

## What Works

✅ **Embedding Creation on Ticket Completion**: When a ticket is marked as "completed", `upsertResolvedPublicTicketVector()` is correctly called (line 393).

✅ **Embedding Deletion on Soft-Delete**: When a ticket is deleted, `deleteTicketVector()` is correctly called (line 777).

✅ **Filter for Completed + Public Tickets**: Qdrant search correctly filters for only completed and public tickets (lines 212-216).

✅ **Cosine Similarity Scoring**: Qdrant is configured to use cosine distance (line 92).

✅ **Minimum Score Threshold**: Search respects `SIMILAR_TICKET_MIN_SCORE` env var (default 0.75).

✅ **OpenAI Embeddings**: Uses `text-embedding-3-small` model (1536 dimensions).

---

## Recommended Fixes

### Fix #1: Add Embedding Creation When Ticket is Completed

**File**: `src/inngest/functions/on-ticket-create.ts`

Add this after line 91 (after assigning skills):

```typescript
// After AI processing, if ticket is already completed and public, create embedding
if (ticket.status === 'completed' && ticket.isPublic) {
  await step.run("create-vector-embedding", async () => {
    try {
      await upsertResolvedPublicTicketVector({
        ...ticket,
        relatedSkills: skills,
        priority: aiResponse?.priority ?? ticket.priority,
        helpfulNotes: aiResponse?.helpfulNotes ?? ticket.helpfulNotes,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to create vector embedding:", error);
      // Don't throw - allow ticket creation to succeed
    }
  });
}
```

### Fix #2: Update Schema to Include Title in Search

**File**: `src/utils/vector-db.utils.ts:23-27`

Update `SimilarTicketSearchInput`:

```typescript
type SimilarTicketSearchInput = {
  title?: string;      // ADD THIS
  description: string;
  category?: string;   // ADD THIS
  limit?: number;
  minScore?: number;
};
```

### Fix #3: Update Search Query to Include Title

**File**: `src/utils/vector-db.utils.ts:198-200`

Replace query text building:

```typescript
const queryText = [
  input.title ? `Title: ${input.title}` : "",
  input.category ? `Category: ${input.category}` : "",
  `Description: ${input.description}`
]
  .filter(Boolean)
  .join("\n");
```

### Fix #4: Make QDRANT_API_KEY Optional for Local Development

**File**: `src/config/vector.config.ts:8-10`

```typescript
if (!ENV.QDRANT_API_KEY && ENV.NODE_ENV === 'production') {
    console.warn("QDRANT_API_KEY is not set - using local Qdrant without authentication");
}

export const client = new QdrantClient({
    url: ENV.QDRANT_URL,
    ...(ENV.QDRANT_API_KEY && { apiKey: ENV.QDRANT_API_KEY }),
});
```

### Fix #5: Add QDRANT_API_KEY to .env (for now, use empty or dummy)

**File**: `/tickmate-backend/.env`

Add line 5:

```env
QDRANT_API_KEY=
```

Or set a dummy value:

```env
QDRANT_API_KEY=local-dev-no-auth-needed
```

---

## Testing Checklist

After fixes:

1. ✅ Start Qdrant: `docker run -p 6333:6333 qdrant/qdrant`
2. ✅ Create a ticket as a user
3. ✅ Admin marks ticket as "completed"
4. ✅ Verify embedding created in Qdrant: `http://localhost:6333/dashboard`
5. ✅ Create a new ticket with similar description
6. ✅ Call `/api/tickets/similar` endpoint
7. ✅ Verify similar ticket is returned with score > 0.75

---

## Additional Observations

### Good Practices Found:
- Error handling in vector operations doesn't block ticket operations
- Structured output validation with Zod for AI responses
- Token usage tracking for AI calls
- Audit logging for all operations
- Soft-delete pattern for tickets

### Performance Considerations:
- OpenAI API calls are async via Inngest (non-blocking)
- Qdrant payload indexes created for `status` and `isPublic`
- Vector sync failures are logged but don't fail the request

---

## Conclusion

**Severity**: 🔴 **HIGH**

The semantic search feature is architected correctly but has implementation bugs that prevent it from working:

1. **Embeddings never created during normal flow** (only when manually marking completed)
2. **Search input schema mismatch** (title/category ignored)
3. **Inconsistent embedding text** (search uses less context than indexed data)
4. **Local Qdrant config issue** (requires API key when it shouldn't)

All issues are fixable with the changes outlined above.
