<div align="center">

#  TickMate

**AI-powered support ticket management that triages, summarizes, and resolves faster.**

Every incoming ticket is analyzed by an AI agent — summarized, prioritized, skill-tagged, and matched against previously resolved issues — so your team spends less time reading and more time fixing.

[![Live Demo](https://img.shields.io/badge/Live_Demo-10B981?style=for-the-badge&logo=vercel&logoColor=white)](#)
[![GitHub Repo](https://img.shields.io/badge/Source_Code-181717?style=for-the-badge&logo=github&logoColor=white)](#)
[![Demo Video](https://img.shields.io/badge/Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](#)

</div>

---

## TL;DR

- **AI triage on every ticket** — GPT-4.1-mini generates summaries, priority suggestions, required skills, and agent notes automatically.
- **Semantic duplicate detection** — Vector similarity search (OpenAI embeddings + Qdrant) surfaces related resolved tickets, even when the wording differs completely.
- **Async-first architecture** — Email workflows and AI analysis run via Inngest background jobs; the API never blocks on third-party I/O.
- **Role-based access** — Users submit and track; admins manage tickets, users, AI usage analytics, and audit logs.
- **Production-grade auth** — Argon2 hashing, HttpOnly JWT cookies, email verification, and magic-link password resets.

---

## Why TickMate Exists

Most helpdesk tools treat tickets as plain text with a status field. TickMate treats every ticket as **structured data that can be reasoned about**.

When a user submits a ticket, the system:

1. **Analyzes** the content via an AI model → generates a concise summary, suggested priority, relevant skills, and notes for the assignee.
2. **Searches** a vector database of previously resolved tickets → surfaces semantically similar issues so agents can resolve with context, not guesswork.
3. **Notifies** via asynchronous email workflows → the API stays fast regardless of email delivery latency or provider outages.

This is built for teams where ticket volume is high enough that manual triage becomes a bottleneck, and where institutional knowledge locked inside old tickets should be **reused, not forgotten**.

---

## Impact & Value

| Metric | Without TickMate | With TickMate |
|---|---|---|
| **Triage time per ticket** | 3–5 min (read, categorize, assign) | ~30 sec (AI pre-fills summary, priority, skills) |
| **Duplicate ticket detection** | Manual search, keyword-dependent | Automatic semantic matching across all resolved tickets |
| **Knowledge reuse** | Locked in closed tickets no one reads | Surfaced proactively on every new submission |
| **Email delivery reliability** | Fire-and-forget, silent failures | Durable async execution with automatic retries (Inngest) |
| **Auth security surface** | Tokens in localStorage (XSS-vulnerable) | HttpOnly cookies, invisible to client-side JavaScript |

---

## Key Features

- 🤖 **AI Ticket Analysis** — Automatic summary, priority suggestion, skill tagging, and agent notes via GPT-4.1-mini (structured output validated against a Zod schema)
- 🔍 **Semantic Similar Ticket Search** — Find related resolved issues using OpenAI embeddings + Qdrant vector similarity, not just keywords
- 📬 **Async Email Workflows** — Signup verification, password resets, and notifications powered by Inngest + Resend with built-in retries
- 🛡️ **Secure Authentication** — Argon2 password hashing, JWT in HttpOnly cookies, email verification, magic-link password resets
- 📊 **Admin Analytics Dashboard** — Platform-wide stats, AI token usage tracking, and a full audit log of all system events
- 🌓 **Light & Dark Mode** — Full theme support across every screen
- 🧩 **Public Ticket Knowledge Base** — Browse completed tickets filtered by category or skill

---

## Use Cases

| Scenario | How TickMate Helps |
|---|---|
| **SaaS support team (5–50 agents)** | AI triage cuts manual categorization; similar-ticket search reduces duplicate effort across shifts |
| **Internal IT helpdesk** | New hires resolve faster by referencing semantically matched past tickets instead of asking senior staff |
| **Open-source project maintainers** | Public completed tickets become a searchable knowledge base for recurring issues |
| **Freelancers / agencies** | Structured ticket workflows with priority suggestions replace chaotic email threads |

---

## Screenshots

<details>
<summary><strong>Light Mode</strong></summary>

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

</details>

<details>
<summary><strong>Dark Mode</strong></summary>

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

</details>

---

## Architecture

### Monorepo Structure

```
tickmate-backend/     Express API (TypeScript, ESM)
tickmate-frontend/    Next.js frontend (TypeScript, App Router)
```

Both packages use **pnpm** as the package manager.

### Ticket Lifecycle

```
User creates ticket
       ↓
AI analyzes ticket (summary, priority, skills, notes)  ← async via Inngest
       ↓
Ticket appears in user dashboard (open)
       ↓
Admin assigns to moderator → moderator replies
       ↓
User or admin marks as completed
       ↓
Ticket is indexed into vector DB for future similarity search
```

Deletion is always a soft-delete — tickets are hidden from the UI but retained in the database for audit purposes. The vector embedding is removed from Qdrant so it stops appearing in similarity results.

---

## Tech Stack

### Backend

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

| Technology | Role |
|---|---|
| **Express 5** (ESM) | HTTP framework with async middleware |
| **Drizzle ORM** | Schema-first PostgreSQL access with generated migrations |
| **Zod** | Runtime request validation on every route |
| **JWT + HttpOnly cookies** | Auth tokens invisible to client-side JavaScript — no localStorage exposure |
| **Argon2** | Password hashing (memory-hard, resistant to GPU attacks) |
| **Inngest** | Durable async background jobs with automatic retries for email and AI workflows |
| **Resend** | Transactional email delivery (verification, password resets) |
| **OpenAI `gpt-4.1-mini`** | Ticket analysis via LangChain structured output (validated against Zod schema) |
| **OpenAI `text-embedding-3-small`** | Ticket embeddings for semantic similarity search |
| **Qdrant** | Vector database for approximate nearest-neighbor search across resolved tickets |

### Frontend

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Radix%20UI-000000?style=for-the-badge&logo=radixui&logoColor=white" alt="Radix UI" />
</p>

| Technology | Role |
|---|---|
| **Next.js 16** (App Router) | Server-side rendering and file-based routing |
| **Tailwind CSS v4 + shadcn/ui** | Utility-first styling with accessible Radix UI primitives |
| **React Hook Form + Zod** | Type-safe client-side form validation |
| **Axios** | Credentialed API calls with HttpOnly cookie support |
| **Recharts** | Analytics dashboard visualizations |
| **next-themes** | Light/dark mode toggle |
| **Biome** | Linting and formatting |

---

## Architectural Decisions

| Decision | Rationale |
|---|---|
| **HttpOnly cookies over localStorage** | JWTs in localStorage are accessible to any script on the page (XSS-vulnerable). HttpOnly cookies are invisible to JavaScript and only sent on same-origin or explicitly CORS-allowed requests. |
| **Inngest for email delivery** | Email is inherently unreliable. Inngest provides durable async execution with automatic retries — a failed send doesn't fail the HTTP response, and transient provider outages don't cause permanent delivery failures. |
| **Qdrant for similarity search** | PostgreSQL full-text search matches keywords. Qdrant stores embedding vectors and performs approximate nearest-neighbor search — queries return semantically related results even when wording differs completely. |
| **LangChain for AI integration** | Structured output tooling guarantees a JSON shape validated against a Zod schema, eliminating freeform text parsing. Also handles retries and model abstraction. |
| **Soft-delete for tickets** | Permanent deletion would destroy vector embeddings and audit history. Soft-delete retains data for auditing while hiding it from users. The Qdrant vector is still removed so deleted tickets don't appear in similarity results. |

---

## For Users

### Regular Users

- **Sign up and verify your email** — accounts are not activated until email verification is complete
- **Submit tickets** — provide title, description, category, priority, deadline, skills, and optional notes; the AI analyzes and suggests priority automatically
- **Track tickets** — view status updates, admin/moderator replies, and a 7-day activity summary from your dashboard
- **Find similar resolved tickets** — search for tickets that others have already resolved on the same topic
- **Browse public completed tickets** — filter by category or skill to find answers to common problems
- **Manage your profile** — update name, username, skills, and password; delete your account if needed
- **Password recovery** — magic link via email to set a new password

### Admins

- **Full ticket management** — view, assign, reply to, change status, or delete any ticket
- **User management** — create, update, or delete user accounts
- **AI usage analytics** — track AI analysis calls broken down by user
- **Audit logs** — full activity log of authentication, user, and ticket events
- **Dashboard stats** — high-level metrics across tickets and users

---

## Developer Guide

### Project Structure

<details>
<summary><strong>Backend</strong></summary>

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
```

</details>

<details>
<summary><strong>Frontend</strong></summary>

```
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

</details>

### Environment Variables

<details>
<summary><strong>Backend</strong> (<code>tickmate-backend/.env</code>)</summary>

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
| `APP_URL` | — | Public URL of the frontend (used in magic link emails and CORS allowlist) |
| `CORS_ORIGINS` | — | Comma-separated extra origins for credentialed requests |
| `COOKIE_DOMAIN` | — | Domain for the auth cookie (for cross-subdomain use) |
| `GEMINI_API_KEY` | — | Defined in config but currently unused (analysis uses OpenAI) |
| `SIMILAR_TICKET_MIN_SCORE` | `0.75` | Cosine similarity threshold for related ticket results |

</details>

<details>
<summary><strong>Frontend</strong> (<code>tickmate-frontend/.env.local</code>)</summary>

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:3000/api`) |

</details>

### Local Setup

#### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database
- Qdrant instance (cloud or self-hosted)
- Inngest account (dev server or cloud)
- OpenAI API key
- Resend account

#### 1. Clone and install

```bash
git clone https://github.com/your-username/tickmate.git
cd tickmate

cd tickmate-backend && pnpm install
cd ../tickmate-frontend && pnpm install
```

#### 2. Configure environment variables

Create `tickmate-backend/.env` with the required variables listed above.

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

```bash
# Terminal 1 — Backend
cd tickmate-backend
pnpm dev   # http://localhost:3000

# Terminal 2 — Frontend
cd tickmate-frontend
pnpm dev   # http://localhost:5000
```

---

## API Reference

All routes are prefixed with `/api`. Authentication is via HttpOnly cookie set on login.

<details>
<summary><strong>Auth Routes</strong> (<code>/api/auth</code>)</summary>

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register new user |
| `POST` | `/verify` | No | Verify email with token |
| `POST` | `/login` | No | Log in with email/username + password |
| `POST` | `/logout` | Yes | Clear auth cookie |
| `POST` | `/forgot-password` | No | Send password reset email |
| `POST` | `/reset-password` | No | Set new password via magic link token |
| `GET` | `/check-username/:username` | No | Check username availability |
| `POST` | `/resend-verification-email` | No | Resend verification email |
| `GET` | `/profile` | Yes | Get current user's profile |
| `PATCH` | `/profile` | Yes | Update profile fields |
| `PUT` | `/update-password` | Yes | Change password |
| `DELETE` | `/profile` | Yes | Delete own account |

</details>

<details>
<summary><strong>Ticket Routes</strong> (<code>/api/tickets</code>)</summary>

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Yes | Get current user's tickets |
| `POST` | `/` | Yes | Create ticket (triggers AI analysis async) |
| `GET` | `/public-completed` | Yes | Browse resolved public tickets |
| `POST` | `/similar` | Yes | Find semantically similar resolved tickets |
| `GET` | `/get-assigned` | Yes | Tickets assigned to current user |
| `GET` | `/tickets-summary` | Yes | 7-day ticket activity summary |
| `PUT` | `/status/:id` | Yes | Mark ticket as completed |
| `PUT` | `/ticket-reply` | Mod/Admin | Add a reply to a ticket |
| `PUT` | `/edit-ticket` | Yes | Edit ticket fields (blocked if completed) |
| `DELETE` | `/delete-ticket` | Yes | Soft-delete a ticket |

</details>

<details>
<summary><strong>Admin Routes</strong> (<code>/api/admin</code>)</summary>

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/login` | No | Admin login |
| `POST` | `/logout` | Admin | Clear admin session |
| `GET` | `/dashboard` | Admin | Platform-wide stats |
| `GET` | `/users` | Admin | List all users |
| `POST` | `/create-user` | Admin | Create a new user account |
| `PUT` | `/update-user` | Admin | Update any user |
| `DELETE` | `/delete-user` | Admin | Delete a user |
| `GET` | `/tickets` | Admin | List all tickets |
| `POST` | `/create-ticket` | Admin | Create ticket and assign to moderator |
| `PUT` | `/tickets/toggle-status` | Admin | Change any ticket's status |
| `DELETE` | `/tickets/delete-ticket` | Admin | Delete any ticket |
| `GET` | `/ai-usage` | Admin | AI token usage stats |
| `GET` | `/audit-logs` | Admin | Paginated audit log |

</details>

---

## Business Rules

- Unverified users cannot log in
- Password reset and email verification use short-lived JWT tokens delivered by email
- Ticket replies can only be made by moderators or admins
- Tickets cannot be edited once marked as completed
- Ticket deletion is always a soft-delete; the vector embedding is removed from Qdrant but the DB record is retained
- Vector sync failures are logged but do not cause API responses to fail — ticket operations always complete from the user's perspective
- Audit events are recorded for all key auth, user, and ticket actions

---

## Testing

The `tickmate-backend/requests/` directory contains `.http` files compatible with the VS Code REST Client extension:

- `user-routes.http` — auth and profile flows
- `ticket-routes.http` — ticket CRUD and search
- `admin-routes.http` — admin management flows

---

## Deployment

| Target | Details |
|---|---|
| **Backend** | Dockerfile included. Deploy as any containerized Node.js service. Set all required env vars. |
| **Frontend** | `netlify.toml` included for Netlify. Also compatible with Vercel. Set `NEXT_PUBLIC_API_URL` to your deployed backend. |
| **Replit** | Both services run as separate workflows: `Start application` (Next.js on port 5000) and `Backend API` (Express on port 3000). |

---

## Future Improvements

- **Webhook integrations** — Slack/Discord notifications on ticket status changes
- **SLA tracking** — Configurable response time targets with escalation alerts
- **Multi-language AI analysis** — Extend ticket analysis to support non-English submissions
- **Bulk ticket operations** — Admin batch assign, close, or re-prioritize
- **Agent performance metrics** — Resolution time, ticket volume, and satisfaction tracking per assignee
- **SSO / OAuth providers** — Google and GitHub login alongside email/password auth

---

<div align="center">

Built with conviction, not templates.

**[Live Demo](#) · [Source Code](#) · [Report an Issue](#)**

</div>
