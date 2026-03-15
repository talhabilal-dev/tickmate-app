# TickMate

TickMate is a full-stack support ticket management platform built for teams that need more than a basic helpdesk. It combines structured ticket workflows with AI-powered analysis — automatically summarizing incoming tickets, suggesting priority levels, surfacing related resolved tickets, and identifying the skills needed to handle each one. The goal is to cut down the time it takes to triage, assign, and resolve support requests.

---

## Why TickMate Exists

Most helpdesk tools treat tickets as plain text with a status field. TickMate treats every ticket as structured data that can be reasoned about. When a user submits a ticket, the system:

- Uses an AI model to analyze the content and generate a concise summary, a suggested priority, relevant skills, and helpful notes for the assignee.
- Runs a vector similarity search against previously resolved tickets to surface potentially duplicate or related issues — so agents can close faster with context.
- Routes email notifications asynchronously so the API stays fast regardless of email delivery.

This is built for teams where ticket volume is high enough that manual triage becomes a bottleneck, and where institutional knowledge locked inside old tickets should be reused, not forgotten.

---

## Screenshots

### Light Mode

#### Home Page
![Home Page - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220375/Screenshot_2026-03-11_at_13-51-51_TickMate_j9unsc.png)

#### Authentication
![Role selection - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220373/Screenshot_2026-03-11_at_13-52-10_TickMate_d6w66r.png)
![Sign in - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220366/Screenshot_2026-03-11_at_13-52-38_TickMate_iz88kh.png)
![Sign up - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220365/Screenshot_2026-03-11_at_13-52-45_Sign_Up_vogyts.png)
![Password reset - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220363/Screenshot_2026-03-11_at_13-53-00_Forgot_Password_wnzp5t.png)

#### User Dashboard
![User Dashboard - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220213/Screenshot_2026-03-11_at_13-53-49_TickMate_vdavtt.png)
![Ticket details - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220211/Screenshot_2026-03-11_at_13-54-04_TickMate_vc9igk.png)
![Public ticket page - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220211/Screenshot_2026-03-11_at_13-54-47_TickMate_qyg4sd.png)
![Profile page - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220211/Screenshot_2026-03-11_at_13-54-52_TickMate_qskne8.png)

#### Admin Dashboard
![Admin Dashboard - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220157/Screenshot_2026-03-11_at_13-55-26_TickMate_zzyzls.png)
![AI usage analytics - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220157/Screenshot_2026-03-11_at_13-55-32_TickMate_mzmdla.png)
![Logs page - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220155/Screenshot_2026-03-11_at_13-55-50_TickMate_hoatp5.png)
![Ticket management - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220155/Screenshot_2026-03-11_at_13-55-57_TickMate_qn4nyw.png)
![User management - Light Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220155/Screenshot_2026-03-11_at_13-56-10_TickMate_k17lji.png)

### Dark Mode

#### Home Page
![Home Page - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220375/Screenshot_2026-03-11_at_13-52-02_TickMate_fudjrw.png)

#### Authentication
![Role selection - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220372/Screenshot_2026-03-11_at_13-52-27_TickMate_ilhet8.png)
![Sign in - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220372/Screenshot_2026-03-11_at_13-52-33_TickMate_xe0s1i.png)
![Sign up - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220366/Screenshot_2026-03-11_at_13-52-49_Sign_Up_jbeo65.png)
![Password reset - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220365/Screenshot_2026-03-11_at_13-52-56_Forgot_Password_qmurzd.png)

#### User Dashboard
![User Dashboard - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220213/Screenshot_2026-03-11_at_13-53-53_TickMate_mzo6o0.png)
![My Tickets - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220211/Screenshot_2026-03-11_at_13-54-35_TickMate_epddmc.png)
![Ticket details - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220212/Screenshot_2026-03-11_at_13-54-00_TickMate_m52rlu.png)
![Public ticket page - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220210/Screenshot_2026-03-11_at_13-54-41_TickMate_sisl7y.png)
![Profile page - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220157/Screenshot_2026-03-11_at_13-54-56_TickMate_np9ib1.png)

#### Admin Dashboard
![Admin Dashboard - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220157/Screenshot_2026-03-11_at_13-55-22_TickMate_isczh1.png)
![AI usage analytics - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220157/Screenshot_2026-03-11_at_13-55-36_TickMate_qcbbqh.png)
![Logs page - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220156/Screenshot_2026-03-11_at_13-55-44_TickMate_nd1ahq.png)
![Ticket management - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220155/Screenshot_2026-03-11_at_13-56-01_TickMate_pzpgun.png)
![User management - Dark Mode](https://res.cloudinary.com/dvdktrhsz/image/upload/v1773220155/Screenshot_2026-03-11_at_13-56-07_TickMate_wdadiy.png)

---

## For Users

### What you can do as a regular user

- **Sign up and verify your email** — accounts are not activated until email verification is complete.
- **Submit tickets** — provide a title, description, category, priority, deadline, related skills, and optional notes. The AI will analyze your ticket and suggest a priority automatically.
- **Track your tickets** — view status updates, admin/moderator replies, and a 7-day activity summary from your dashboard.
- **Find similar resolved tickets** — before or after submitting, you can search for tickets that others have already had resolved on the same topic.
- **Browse public completed tickets** — filter by category or skill to find answers to common problems.
- **Manage your profile** — update your name, username, skills list, and password. You can also delete your account.
- **Password recovery** — use the forgot password flow to receive a magic link by email and set a new password.

### What admins can do additionally

- **Full ticket management** — view, assign, reply to, change status, or delete any ticket.
- **User management** — create, update, or delete user accounts.
- **AI usage analytics** — see how many AI analysis calls have been made, broken down by user.
- **Audit logs** — a full activity log of authentication, user, and ticket events.
- **Dashboard stats** — high-level metrics across tickets and users.

### How ticket lifecycle works

```
User creates ticket
       ↓
AI analyzes ticket (summary, priority, skills, notes)  ← async
       ↓
Ticket appears in user dashboard (open)
       ↓
Admin assigns to moderator → moderator replies
       ↓
User or admin marks as completed
       ↓
Ticket is indexed into vector DB for future similarity search
```

Deletion is always a soft-delete — tickets are hidden from the UI but not permanently removed from the database.

---

## For Developers

### Monorepo Structure

```
tickmate-backend/     Express API (TypeScript, ESM)
tickmate-frontend/    Next.js frontend (TypeScript, App Router)
```

Both packages use **pnpm** as the package manager.

### Tech Stack

**Backend:**

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle-000000?style=for-the-badge&logo=drizzle&logoColor=white" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/LangChain-000000?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain" />
  <img src="https://img.shields.io/badge/Qdrant-FF6F00?style=for-the-badge&logo=qdrant&logoColor=white" alt="Qdrant" />
  <img src="https://img.shields.io/badge/Inngest-000000?style=for-the-badge&logo=inngest&logoColor=white" alt="Inngest" />
</p>

- **Express 5** (ESM modules) as the HTTP framework
- **Drizzle ORM** over PostgreSQL — schema-first with migrations
- **Zod** for runtime request validation on all routes
- **JWT** stored in HttpOnly cookies (no localStorage token exposure)
- **Argon2** for password hashing
- **Inngest** for reliable async background jobs (email workflows)
- **Resend** for transactional email delivery
- **OpenAI `gpt-4.1-mini`** via LangChain for ticket analysis (structured output via Zod schema)
- **OpenAI `text-embedding-3-small`** for generating ticket embeddings
- **Qdrant** as the vector database for similarity search

**Frontend:**

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Radix%20UI-000000?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI" />
</p>

- **Next.js 16** with the App Router
- **Tailwind CSS v4** + **shadcn/ui** components built on Radix UI
- **React Hook Form** + Zod for client-side form validation
- **Axios** for API calls (credentialed, with HttpOnly cookie support)
- **Recharts** for analytics charts
- **next-themes** for light/dark mode
- **Biome** for linting and formatting

---

### Project Structure

```
tickmate-backend/
  src/
    config/
      db.config.ts          PostgreSQL connection via Drizzle
      env.config.ts         Typed env var loader with sanitization
      vector.config.ts      Qdrant client setup
    controllers/
      user.controller.ts    Auth and profile endpoints
      admin.controller.ts   Admin-only endpoints
      ticket.controller.ts  Ticket lifecycle endpoints
    middlewares/
      auth.middleware.ts    JWT cookie verification
      admin.middleware.ts   Admin role check
    routes/
      user.routes.ts
      admin.routes.ts
      ticket.routes.ts
    schemas/
      user.schema.ts        Zod schemas for user requests
      ticket.schema.ts      Zod schemas for ticket requests
      user-response.schema.ts
    utils/
      agent.utils.ts        OpenAI/LangChain ticket analysis
      audit-log.utils.ts    Audit event recording
      cookie.utils.ts       Secure cookie helpers
      magic-link.utils.ts   Token generation for email flows
      mailer.utils.ts       Resend integration
      response.utils.ts     Standardized API response helpers
      vector-db.utils.ts    Qdrant upsert/search/delete
    inngest/
      client.ts             Inngest client initialization
      functions/
        on-signup.ts        Email verification on registration
        on-forgot-password.ts   Password reset email
        on-ticket-create.ts     AI analysis + vector indexing on ticket create
  public/
    emails/                 HTML email templates
  requests/
    user-routes.http        REST client test file
    ticket-routes.http
    admin-routes.http
  drizzle/                  Generated migration files
  drizzle.config.ts

tickmate-frontend/
  src/
    app/
      page.tsx              Landing / home page
      layout.tsx            Root layout with theme provider
      auth/
        signin/             Role selection → user or admin sign in
        signup/             Registration form
        forgot-password/    Request reset link
        reset-password/     Set new password via token
        verify-email/       Email verification handler
      dashboard/
        user/
          page.tsx          User home dashboard (summary + recent tickets)
          tickets/          Full ticket list + create ticket
          public-tickets/   Browse resolved public tickets + similarity search
          profile/          Profile settings
        admin/
          page.tsx          Admin stats dashboard
          tickets/          All tickets management
          users/            User management
          ai-usage/         AI token usage analytics
          logs/             Audit log viewer
    components/             Shared UI components (cards, forms, dialogs, etc.)
    lib/
      api.ts                Axios client + all typed API call functions
      schemas.ts            Shared Zod schemas and TypeScript types
      utils.ts              Utility helpers
    hooks/                  Custom React hooks
    styles/                 Global CSS
```

---

### Environment Variables

#### Backend (`tickmate-backend/.env`)

**Required:**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing auth tokens (use a long random string) |
| `OPENAI_API_KEY` | OpenAI API key for ticket analysis and embeddings |
| `QDRANT_URL` | Qdrant instance URL |
| `QDRANT_API_KEY` | Qdrant API key |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Sender address for outgoing emails (e.g. `noreply@yourdomain.com`) |
| `INNGEST_EVENT_KEY` | Inngest event key from your Inngest dashboard |
| `INNGEST_SIGNING_KEY` | Inngest signing key from your Inngest dashboard |

**Optional:**

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the Express server listens on |
| `NODE_ENV` | — | Set to `production` in deployed environments |
| `APP_URL` | — | Public URL of the frontend app (used in magic link emails and CORS allowlist) |
| `CORS_ORIGINS` | — | Comma-separated extra origins allowed for credentialed requests |
| `COOKIE_DOMAIN` | — | Domain for the auth cookie (set for cross-subdomain use) |
| `GEMINI_API_KEY` | — | Defined in config but currently unused (analysis uses OpenAI) |
| `SIMILAR_TICKET_MIN_SCORE` | `0.75` | Cosine similarity threshold for related ticket results |

#### Frontend (`tickmate-frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:3000/api`) |

---

### Local Setup

#### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A PostgreSQL database
- A Qdrant instance (cloud or self-hosted)
- An Inngest account (dev server or cloud)
- An OpenAI account
- A Resend account

#### 1. Clone and install

```bash
# Install backend dependencies
cd tickmate-backend
pnpm install

# Install frontend dependencies
cd ../tickmate-frontend
pnpm install
```

#### 2. Configure environment variables

Create `tickmate-backend/.env` with the variables listed above.

Create `tickmate-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### 3. Set up the database

```bash
cd tickmate-backend
pnpm drizzle:generate   # Generate migration files from schema
pnpm drizzle:migrate    # Run migrations against DATABASE_URL
```

#### 4. Run both services

In one terminal:

```bash
cd tickmate-backend
pnpm dev   # Starts on http://localhost:3000
```

In another terminal:

```bash
cd tickmate-frontend
pnpm dev   # Starts on http://localhost:5000
```

---

### Key Architectural Decisions

**Why HttpOnly cookies instead of localStorage for tokens?**
JWTs stored in localStorage are accessible to any JavaScript on the page, making them vulnerable to XSS. HttpOnly cookies are invisible to JavaScript and only sent on same-origin (or explicitly CORS-allowed) requests.

**Why Inngest for email?**
Email delivery is inherently unreliable. Inngest provides durable async execution with automatic retries, so a failed email send doesn't fail the HTTP response, and transient provider outages don't cause permanent delivery failures.

**Why Qdrant for similarity search?**
PostgreSQL full-text search is good for keyword matching but poor for semantic similarity. Qdrant stores OpenAI embedding vectors and performs approximate nearest-neighbor search, so queries like "find tickets similar to this description" return semantically related results even when the wording is completely different.

**Why LangChain for AI integration?**
LangChain's structured output tooling makes it straightforward to get a guaranteed JSON shape back from the model (validated against a Zod schema), rather than parsing freeform text. It also handles retries and model abstraction cleanly.

**Why soft-delete for tickets?**
Permanently deleting a ticket would also destroy its vector embedding and audit history. Soft-delete keeps the data for audit purposes while hiding it from end users. The vector entry is still removed from Qdrant on delete so it stops appearing in similarity results.

---

### API Reference

All API routes are prefixed with `/api`. Authentication is via HttpOnly cookie set on login.

#### Auth Routes (`/api/auth`)

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register new user. Body: `name`, `username`, `email`, `password`, `skills?` |
| `POST` | `/verify` | No | Verify email with token from email link. Body: `token` |
| `POST` | `/login` | No | Log in. Body: `identifier` (email or username), `password` |
| `POST` | `/logout` | Yes | Clear auth cookie |
| `POST` | `/forgot-password` | No | Send password reset email. Body: `email` |
| `POST` | `/reset-password` | No | Set new password via magic link token. Body: `token`, `newPassword` |
| `GET` | `/check-username/:username` | No | Check if a username is available |
| `POST` | `/resend-verification-email` | No | Resend verification email. Body: `email` |
| `GET` | `/profile` | Yes | Get current user's profile |
| `PATCH` | `/profile` | Yes | Update profile fields. Body: `name?`, `username?`, `skills?` |
| `PUT` | `/update-password` | Yes | Change password. Body: `oldPassword`, `newPassword` |
| `DELETE` | `/profile` | Yes | Delete own account |

#### Ticket Routes (`/api/tickets`)

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `GET` | `/` | Yes | Get current user's tickets |
| `POST` | `/` | Yes | Create a ticket (triggers AI analysis async) |
| `GET` | `/public-completed` | Yes | Browse resolved public tickets. Query: `category?`, `skills?` |
| `POST` | `/similar` | Yes | Find semantically similar resolved tickets. Body: `title`, `description`, `category?`, `limit?` |
| `GET` | `/get-assigned` | Yes | Tickets assigned to the current user (moderators) |
| `GET` | `/tickets-summary` | Yes | 7-day ticket activity summary |
| `PUT` | `/status/:id` | Yes | Mark a ticket as completed |
| `PUT` | `/ticket-reply` | Yes (moderator/admin) | Add a reply to a ticket |
| `PUT` | `/edit-ticket` | Yes | Edit a ticket's fields (blocked if completed) |
| `DELETE` | `/delete-ticket` | Yes | Soft-delete a ticket |

#### Admin Routes (`/api/admin`)

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `POST` | `/login` | No | Admin login |
| `POST` | `/logout` | Admin | Clear admin session |
| `GET` | `/dashboard` | Admin | Platform-wide stats |
| `GET` | `/users` | Admin | List all users |
| `POST` | `/create-user` | Admin | Create a new user account |
| `PUT` | `/update-user` | Admin | Update any user |
| `DELETE` | `/delete-user` | Admin | Delete a user |
| `GET` | `/tickets` | Admin | List all tickets |
| `POST` | `/create-ticket` | Admin | Create a ticket and assign to a moderator |
| `PUT` | `/tickets/toggle-status` | Admin | Change any ticket's status |
| `DELETE` | `/tickets/delete-ticket` | Admin | Delete any ticket |
| `GET` | `/ai-usage` | Admin | AI token usage stats. Query: `userId?`, `limit?` |
| `GET` | `/audit-logs` | Admin | Paginated audit log. Query: `page?`, `pageSize?` |

---

### Business Rules

- Unverified users cannot log in.
- Password reset and email verification use short-lived JWT tokens delivered by email.
- Ticket replies can only be made by moderators or admins.
- Tickets cannot be edited once marked as completed.
- Ticket deletion is always a soft-delete. The vector embedding is removed from Qdrant but the DB record is retained.
- Vector sync failures are logged but do not cause the API response to fail — ticket operations always complete from the user's perspective.
- Audit events are recorded for all key auth, user, and ticket actions.

---

### REST Client Test Files

The `tickmate-backend/requests/` directory contains `.http` files you can use with the VS Code REST Client extension or any compatible tool:

- `user-routes.http` — auth and profile flows
- `ticket-routes.http` — ticket CRUD and search
- `admin-routes.http` — admin management flows

---

### Deployment

**Backend:** A `Dockerfile` is included. Deploy as any containerized Node.js service. Ensure all required environment variables are set in your deployment environment.

**Frontend:** A `netlify.toml` is included for Netlify deployment. Also compatible with Vercel. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.

On **Replit**, both services are run as separate workflows:
- `Start application` — Next.js frontend on port 5000
- `Backend API` — Express backend on port 3000

---
