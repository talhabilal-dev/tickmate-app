# TickMate Backend

A TypeScript + Express backend for a ticketing/support platform with role-based auth, admin operations, async email workflows, and semantic ticket similarity search.

## What This Backend Does

TickMate backend provides:
- User authentication and profile management
- Admin-only dashboard and management APIs
- Ticket lifecycle management (create, assign, reply, update, complete, delete)
- Email workflows for account verification and password reset (via Inngest + Resend)
- Semantic search over resolved public tickets using OpenAI embeddings + Qdrant

The goal is to reduce duplicate tickets and help users find existing solutions before creating a new ticket.

## Core Features

### Authentication & User Management
- Register with `name`, `username`, `email`, `password`
- Email verification with magic-link token
- Login with `identifier` (email or username)
- Dedicated admin login/logout flow
- Forgot/reset password flow using magic links
- Username availability check endpoint
- Profile update + password change endpoints

### Admin Features
- Create user directly as admin (`isActive = true`)
- Create ticket manually as admin and assign it to a **moderator only**
- View users (excluding admins)
- View all tickets
- Dashboard stats
- Update or delete users

### Ticket Features
- Create and fetch user tickets
- Fetch assigned tickets
- Reply to assigned ticket (moderator/admin constraints)
- Ticket summary endpoint
- Edit and delete endpoints
- Mark ticket as completed
- Rule enforced: **completed tickets cannot be edited**

### Semantic Similar Ticket Search
- Endpoint: `POST /api/tickets/similar`
- Uses OpenAI embedding model: `text-embedding-3-small`
- Qdrant collection: `tickmate_db`
- Cosine similarity
- Only returns tickets that are:
  - `status = completed`
  - `isPublic = true`
- Minimum score threshold configurable via `SIMILAR_TICKET_MIN_SCORE` (default `0.75`)

### Async Workflows (Inngest)
- User signup verification email
- Forgot-password reset email
- Ticket-created async function wiring is present

## Tech Stack

- Node.js + Express 5
- TypeScript
- PostgreSQL
- Drizzle ORM + Drizzle Kit
- Zod validation
- JWT + cookie auth
- Inngest
- Resend
- OpenAI embeddings (`@langchain/openai`)
- Qdrant (`@qdrant/js-client-rest`)

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
    vector-db.utils.ts
    magic-link.utils.ts
    mailer.utils.ts
  inngest/
    client.ts
    functions/
```

## Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment

Create `.env` in `tickmate-backend` (or copy from `.env.example`) and set values.

Required/important variables:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `APP_URL`
- `NODE_ENV`
- `COOKIE_DOMAIN`
- `OPENAI_API_KEY`
- `QDRANT_URL`
- `QDRANT_API_KEY` (required if your Qdrant instance is secured)
- `SIMILAR_TICKET_MIN_SCORE` (optional, default: `0.75`)

### 3) Database migration

```bash
pnpm drizzle:generate
pnpm drizzle:migrate
```

### 4) Run in development

```bash
pnpm dev
```

Server starts at `http://localhost:3000` by default.

## Scripts

- `pnpm dev` - run dev server with watch mode
- `pnpm build` - compile TypeScript
- `pnpm start` - run compiled server
- `pnpm drizzle:generate` - generate SQL from schema changes
- `pnpm drizzle:migrate` - apply migrations
- `pnpm drizzle:push` - push schema directly

## API Base Paths

- Auth routes: `/api/auth`
- Ticket routes: `/api/tickets`
- Admin routes: `/api/admin`
- Inngest endpoint: `/api/inngest`

## Route Summary

### Auth (`/api/auth`)
- `POST /register`
- `POST /verify`
- `POST /login`
- `POST /logout`
- `POST /forgot-password`
- `POST /reset-password`
- `GET /check-username`
- `GET /profile`
- `PATCH /profile`
- `PUT /update-password`

### Tickets (`/api/tickets`)
- `GET /`
- `POST /similar`
- `POST /`
- `PUT /status/:id`
- `GET /get-assigned`
- `PUT /ticket-reply`
- `GET /tickets-summary`
- `DELETE /delete-ticket`
- `PUT /edit-ticket`

### Admin (`/api/admin`)
- `POST /login`
- `POST /logout`
- `POST /create-user`
- `POST /create-ticket`
- `GET /users`
- `GET /tickets`
- `GET /dashboard`
- `PUT /update-user`
- `DELETE /delete-user`

## Recommended Frontend Flow for Ticket Creation

1. Call `POST /api/tickets/similar` with title/description while user types.
2. Show relevant resolved public tickets.
3. If user gets help, stop there (do not call create-ticket).
4. If user still needs support, call `POST /api/tickets/`.

This helps reduce duplicates and unnecessary processing.

## Test Request Files

Use the provided REST Client files in `requests/`:
- `requests/user-routes.http`
- `requests/ticket-routes.http`
- `requests/admin-routes.http`

These are ready for VS Code REST Client extension.

## Notes

- Admin routes are protected with dedicated `verifyAdminToken` middleware.
- Semantic search indexes in Qdrant are managed by backend utility code.
- Ticket vectors are stored/updated only when ticket is completed and public.
