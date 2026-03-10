# TickMate Backend

TypeScript + Express backend for ticket management, role-based authentication, async email workflows, AI-powered ticket analysis, and vector similarity search.

## Overview

This service provides:

- User auth and profile APIs
- Admin-only management APIs
- Ticket lifecycle APIs (create, assign, reply, update, complete, soft-delete)
- Email verification and password reset workflows via Inngest + Resend
- Similar-ticket search over resolved public tickets using OpenAI embeddings + Qdrant

## Tech Stack

- Node.js + Express 5
- TypeScript (ESM)
- PostgreSQL + Drizzle ORM
- Zod validation
- JWT auth with HttpOnly cookie
- Inngest for async jobs
- Resend for email
- OpenAI (`gpt-4.1-mini`) for ticket analysis
- OpenAI embeddings (`text-embedding-3-small`) + Qdrant for similarity search

## Project Structure

```text
src/
  config/
    db.config.ts
    env.config.ts
    vector.config.ts
  controllers/
    user.controller.ts
    admin.controller.ts
    ticket.controller.ts
  middlewares/
    auth.middleware.ts
    admin.middleware.ts
  routes/
    user.routes.ts
    admin.routes.ts
    ticket.routes.ts
  schemas/
    user.schema.ts
    ticket.schema.ts
    user-response.schema.ts
  utils/
    agent.utils.ts
    audit-log.utils.ts
    cookie.utils.ts
    magic-link.utils.ts
    mailer.utils.ts
    response.utils.ts
    vector-db.utils.ts
  inngest/
    client.ts
    functions/
public/
  emails/
requests/
  user-routes.http
  ticket-routes.http
  admin-routes.http
```

## Setup

### 1) Install

```bash
pnpm install
```

### 2) Configure `.env`

Variables used by code:

Required in normal usage:

- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`

Optional:

- `PORT` (default: `3000`)
- `NODE_ENV`
- `APP_URL` (used for magic links and CORS allowlist)
- `CORS_ORIGINS` (comma-separated extra origins for credentialed CORS, e.g. `https://app.example.com,https://www.example.com`)
- `COOKIE_DOMAIN` (normalized to host-only)
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `GEMINI_API_KEY` (currently defined in config; analysis uses OpenAI model)
- `SIMILAR_TICKET_MIN_SCORE` (default: `0.75`)

### 3) Database

```bash
pnpm drizzle:generate
pnpm drizzle:migrate
```

### 4) Run

```bash
pnpm dev
```

Default URL: `http://localhost:3000`

## Scripts

- `pnpm dev` - run with tsx watch
- `pnpm build` - compile TypeScript
- `pnpm start` - run compiled server
- `pnpm drizzle:generate` - generate migrations
- `pnpm drizzle:migrate` - run migrations
- `pnpm drizzle:push` - push schema changes directly

## Runtime Notes

### CORS

Allowed origins include:

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3001`
- `APP_URL` if provided (normalized to origin)
- Any origins in `CORS_ORIGINS` (comma-separated; each normalized to origin)

Credentials are enabled and preflight is handled.

### Production CORS Example

```env
NODE_ENV=production
APP_URL=https://tickmate.yourdomain.com
CORS_ORIGINS=https://tickmate.yourdomain.com,https://www.tickmate.yourdomain.com
COOKIE_DOMAIN=.yourdomain.com
```

For frontend requests, set `NEXT_PUBLIC_API_URL` to your backend API base, for example:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Auth and Cookies

- JWT is accepted from `token` cookie or `Authorization: Bearer <token>`.
- Cookie is `httpOnly`, `path=/`, and:
- `secure: true` + `sameSite: none` in production
- `secure: false` + `sameSite: lax` in non-production
- User login token expiry: `1d`
- Admin login token expiry: `12h`

## Inngest Functions

Served at `/api/inngest` with these registered functions:

- `on-user-signup` (event: `user/signup`, retries: 3)
- `on-user-forgot-password` (event: `user/forgot-password`, retries: 3)
- `on-ticket-created` (event: `ticket/created`, retries: 2)

### Magic Link Paths

- Verification link path: `/auth/verify-email?token=...`
- Password reset link path: `/auth/reset-password?token=...`

## API Base Paths

- Auth: `/api/auth`
- Tickets: `/api/tickets`
- Admin: `/api/admin`

## API Reference

### Auth Routes (`/api/auth`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| `POST` | `/register` | No | Body: `name`, `username`, `email`, `password`, `skills?` |
| `POST` | `/verify` | No | Body: `token` |
| `POST` | `/login` | No | Body: `identifier` (email or username), `password` |
| `POST` | `/logout` | Yes | Clears auth cookie |
| `POST` | `/forgot-password` | No | Body: `email`; always returns generic success message |
| `POST` | `/reset-password` | No | Body: `token`, `newPassword` |
| `GET` | `/check-username/:username` | No | Username availability |
| `POST` | `/resend-verification-email` | No | Body: `email`; generic success response |
| `GET` | `/profile` | Yes | Current user profile |
| `PATCH` | `/profile` | Yes | Body: `name?`, `username?`, `skills?`; email change blocked |
| `PUT` | `/update-password` | Yes | Body: `oldPassword` (or `currentPassword`), `newPassword` |
| `DELETE` | `/profile` | Yes | Delete own account |

### Ticket Routes (`/api/tickets`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/` | Yes | Get current user's tickets (excluding soft-deleted) |
| `GET` | `/public-completed` | Yes | Query: `category?`, `skills?` (comma-separated) |
| `POST` | `/similar` | Yes | Body: `title`, `description`, `category?`, `limit?` |
| `POST` | `/` | Yes | Create ticket and trigger async analysis/assignment |
| `PUT` | `/status/:id` | Yes | Mark as completed (creator only) |
| `GET` | `/get-assigned` | Yes | Tickets assigned to current user |
| `PUT` | `/ticket-reply` | Yes | Moderator/admin only; body: `ticketId`, `message` |
| `GET` | `/tickets-summary` | Yes | Current + previous 7-day summary |
| `DELETE` | `/delete-ticket` | Yes | Body: `ticketId`; soft-delete |
| `PUT` | `/edit-ticket` | Yes | Update fields; completed tickets cannot be edited |

### Admin Routes (`/api/admin`)

All routes except `/login` require admin auth.

| Method | Path | Auth | Notes |
|---|---|---|---|
| `POST` | `/login` | No | Identifier must match admin email |
| `POST` | `/logout` | Admin | Clear admin session |
| `POST` | `/create-user` | Admin | Create active user directly |
| `POST` | `/create-ticket` | Admin | Assign to moderator only |
| `GET` | `/users` | Admin | Lists non-admin users |
| `GET` | `/tickets` | Admin | Lists non-deleted tickets |
| `GET` | `/ai-usage` | Admin | Query: `limit?`, `userId?` |
| `GET` | `/audit-logs` | Admin | Query: `page?`, `pageSize?` |
| `GET` | `/dashboard` | Admin | Aggregate admin stats |
| `PUT` | `/update-user` | Admin | Update role/active/profile fields |
| `DELETE` | `/delete-user` | Admin | Body includes user id |
| `PUT` | `/tickets/toggle-status` | Admin | Change ticket status |
| `DELETE` | `/tickets/delete-ticket` | Admin | Admin ticket delete |

## Ticket Similarity and Vector Indexing

- Qdrant collection: `tickmate_db`
- Distance: cosine
- Embedding model: `text-embedding-3-small`
- Only completed + public tickets are indexed/searched
- Minimum score controlled by `SIMILAR_TICKET_MIN_SCORE` (default `0.75`)

## Behavioral Rules

- Unverified users cannot log in.
- Username availability is path-param based: `/check-username/:username`.
- Password reset requires magic-link token and does not require old password.
- Change password (`/update-password`) requires authenticated user.
- Ticket replies are restricted to moderator/admin, and ticket must not be completed.
- Ticket edits are blocked when status is `completed`.
- Ticket deletion is soft-delete using `deletedAt`.

## Quick API Examples

Verify email:

```http
POST /api/auth/verify
Content-Type: application/json

{
  "token": "<jwt-token>"
}
```

Reset password:

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "<jwt-token>",
  "newPassword": "NewPass123"
}
```

Change password (logged in):

```http
PUT /api/auth/update-password
Content-Type: application/json

{
  "oldPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

## Request Collections

Use REST client files under `requests/`:

- `requests/user-routes.http`
- `requests/ticket-routes.http`
- `requests/admin-routes.http`

## Notes

- Vector sync failures are logged and do not block ticket completion/delete responses.
- Audit logs are recorded for key auth, user, and ticket actions.
- Backend currently uses OpenAI in `agent.utils.ts` for ticket analysis.
