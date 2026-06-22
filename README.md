# 📚 ScholarAI

> An AI-powered SaaS platform for academic and research writing — chat with your papers, generate outlines and abstracts, improve your prose, and get grounded, cited answers from your own document library.

ScholarAI is a full-stack, three-service application built around a **Retrieval-Augmented Generation (RAG)** pipeline. Researchers upload their papers (PDF, DOCX, TXT, MD), the system embeds and indexes them in a vector database, and an AI assistant answers questions **grounded in the user's own documents** — with inline citations and no hallucinated references.

---

## ✨ Features

- **🔐 Authentication** — Email/password (BCrypt) and Google OAuth2 login, with JWT access tokens + rotating refresh tokens stored in HTTP-only cookies, and CSRF protection.
- **📁 Projects** — Organize research into projects; each project has its own documents and chat sessions.
- **📄 Document ingestion** — Upload PDF/DOCX/TXT/MD files. They are parsed, chunked, embedded, and stored asynchronously. Status is tracked (`UPLOADED → PROCESSING → READY / FAILED`) with reprocess support.
- **💬 RAG chat** — Ask questions about your documents and get answers grounded only in retrieved context, complete with **citations** (document name, page number, quote, similarity score). The model refuses to answer when evidence is weak.
- **✍️ AI writing tools** — Generate outlines, abstracts, summaries; improve text; extract paper insights; and format citations — each tunable by **tone** (Academic/Simple/Formal/Concise) and **target length** (Short/Medium/Long).
- **📊 Usage tracking** — Every AI call records model + input/output token usage per user.

---

## 🏗️ Architecture

ScholarAI uses a **gateway pattern**. The browser talks **only** to the Spring backend. The Python AI service is internal and never exposed publicly — Spring reaches it over a private network using a shared `X-Internal-Service-Token`.

```
┌──────────────┐      HTTPS / cookies      ┌────────────────────┐
│              │  ───────────────────────► │                    │
│   Frontend   │                           │   Spring Backend   │
│  (Next.js)   │  ◄─────────────────────── │   (API Gateway)    │
│              │      JSON responses       │                    │
└──────────────┘                           └─────────┬──────────┘
                                                     │
                       X-Internal-Service-Token      │  (internal only)
                                                     ▼
                                          ┌────────────────────┐
                                          │     AI Service     │
                                          │  (FastAPI / Python)│
                                          │  RAG · embeddings  │
                                          │   writing tools    │
                                          └─────────┬──────────┘
                                                     │  OpenAI API
                          ┌──────────────────────────┴───────────────────┐
                          ▼                                               ▼
                 ┌──────────────────┐                          ┌──────────────────┐
                 │   PostgreSQL     │                          │      Redis       │
                 │  + pgvector      │                          │   (sessions/     │
                 │ (data + vectors) │                          │     cache)       │
                 └──────────────────┘                          └──────────────────┘
```

### Service responsibilities

| Service | Tech | Role |
|---|---|---|
| **frontend** | Next.js 16 (App Router), React 19, TypeScript, TanStack Query, Tailwind CSS 4, react-hook-form + Zod, sonner, lucide-react | User interface. Calls only the Spring API (cookies + CSRF). |
| **backend-spring** | Spring Boot 3.5, Java 25, Spring Security, JPA/Hibernate, Flyway, OAuth2 | Public API gateway: auth, projects, documents, chat, writing. Owns the database schema and orchestrates the AI service. |
| **ai-service** | FastAPI, Python, OpenAI SDK, pgvector, psycopg, tiktoken, pypdf/python-docx | Internal RAG engine: document parsing, chunking, embeddings, vector retrieval, answer generation, and writing tools. |
| **PostgreSQL** | `pgvector/pgvector:pg16` | Relational data **and** vector embeddings (`vector(1536)`, IVFFlat cosine index). |
| **Redis** | `redis:7.4` | Caching / session support. |

### Request flow examples

**Document upload & ingestion**
1. Browser `POST /api/projects/{id}/documents` (multipart) → Spring stores the file and creates a `documents` row (`UPLOADED`).
2. Spring kicks off async ingestion → calls AI service `POST /internal/ingest`.
3. AI service parses → chunks → embeds (OpenAI `text-embedding-3-small`, 1536-dim) → inserts `document_chunks` with vectors → returns page/chunk counts.
4. Spring updates the document to `READY` (or `FAILED` with a reason).

**RAG chat**
1. Browser `POST /api/projects/{id}/chat-sessions/{sessionId}/messages`.
2. Spring → AI service `POST /internal/rag/query`.
3. AI service embeds the question → cosine-similarity search over the project's chunks → builds context → calls the chat model with a strict grounding prompt → returns answer + citations + token usage.
4. Spring persists the message and citations and returns them to the browser.

---

## 🗂️ Repository layout

```
scholar-ai/
├── frontend/            # Next.js 16 app (App Router, TypeScript)
│   └── src/
│       ├── app/         # routes: login, register, dashboard,
│       │                #   projects/[projectId]/{overview,chat,documents,writing},
│       │                #   auth/oauth/success, providers
│       ├── components/  # auth, chat, documents, projects, writing, layout, ui
│       └── lib/         # api clients (auth/projects/documents/chat/writing),
│                        #   client (fetch + CSRF), hooks, types, utils
├── backend-spring/      # Spring Boot API gateway
│   └── src/main/java/com/scholarai/
│       ├── auth/        # register, login, refresh, logout, me
│       ├── security/    # JWT, OAuth2, CSRF, cookies, SecurityConfig
│       ├── project/     # projects CRUD
│       ├── document/    # upload, storage, async ingestion
│       ├── chat/        # chat sessions + RAG messages
│       ├── writing/     # AI writing tools
│       ├── ai/          # AiClient (calls the Python service)
│       ├── token/       # refresh tokens
│       ├── exception/   # global error handling
│       └── config/      # app properties, CORS, async
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/V1__init.sql   # Flyway schema
├── ai-service/          # FastAPI internal AI service
│   └── app/
│       ├── routers/     # health, ingest, rag, writing
│       ├── services/    # parser, chunker, embeddings, retrieval, rag, writing
│       ├── config.py    # pydantic settings
│       ├── db.py        # psycopg connection pool
│       └── security.py  # internal token guard
├── contracts/           # OpenAPI specs (public + internal AI)
├── infra/
│   ├── docker-compose.yml          # Postgres (pgvector) + Redis
│   └── postgres-init/              # enables pgvector extension
└── storage/             # uploaded files (gitignored)
```

---

## 🛠️ Tech stack

**Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · TanStack Query · Tailwind CSS 4 · react-hook-form · Zod · sonner (toasts) · lucide-react · clsx + tailwind-merge

**Backend:** Java 25 · Spring Boot 3.5 · Spring Security · Spring Data JPA · Flyway · OAuth2 Client · JJWT · Lombok · Maven

**AI service:** Python · FastAPI · Uvicorn · OpenAI SDK · pgvector · psycopg · SQLAlchemy · tiktoken · tenacity · pypdf · python-docx · structlog

**Data:** PostgreSQL 16 + pgvector · Redis 7.4

**AI models (configurable):** `gpt-4.1-mini` (chat) · `text-embedding-3-small` @ 1536 dims (embeddings)

---

## 🚀 Local development

### Prerequisites

- **Docker** & Docker Compose (for Postgres + Redis)
- **JDK 25** (the Spring backend targets Java 25)
- **Node.js 20+** and a package manager (npm/pnpm) for the frontend
- **Python 3.11+** for the AI service
- An **OpenAI API key**
- *(Optional)* Google OAuth client credentials for social login

### 1. Start infrastructure (Postgres + Redis)

```bash
docker compose -f infra/docker-compose.yml up -d
```

This starts PostgreSQL with pgvector (`localhost:5432`, db/user/password `scholarai`/`scholarai`/`scholarai_password`) and Redis (`localhost:6379`). The pgvector extension is enabled automatically on first boot.

### 2. Run the AI service (FastAPI)

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env                # then edit values (see below)
uvicorn app.main:app --reload --port 8000
```

Edit `ai-service/.env`:

```ini
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=scholarai
POSTGRES_USER=scholarai
POSTGRES_PASSWORD=scholarai_password

OPENAI_API_KEY=sk-...your-key...
OPENAI_CHAT_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536

AI_SERVICE_TOKEN=pick-a-long-random-shared-secret

REDIS_HOST=localhost
REDIS_PORT=6379
```

Health check: <http://localhost:8000/health> → `{"status":"ok"}`.

> ⚠️ The `EMBEDDING_DIMENSIONS` (1536) must match the `vector(1536)` column in the schema. If you change the embedding model/dimensions, update `V1__init.sql` accordingly.

### 3. Run the Spring backend

The backend reads configuration from environment variables. Set them (a `.env`/run-config or your shell):

```ini
SPRING_PORT=8080
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_TOKEN=pick-a-long-random-shared-secret   # MUST match the AI service

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=scholarai
POSTGRES_USER=scholarai
POSTGRES_PASSWORD=scholarai_password

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=a-very-long-random-secret-at-least-256-bits
ACCESS_TOKEN_MINUTES=15
REFRESH_TOKEN_DAYS=30

# Optional Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

UPLOAD_DIR=../storage/uploads
```

Then run:

```bash
cd backend-spring
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
```

Flyway runs `V1__init.sql` on startup to create the schema. The API is available at <http://localhost:8080>; health at `/actuator/health`.

> **Google OAuth redirect URI:** `http://localhost:8080/login/oauth2/code/google`

### 4. Run the frontend (Next.js)

Create `frontend/.env.local` pointing at the Spring backend:

```ini
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Then install and run:

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm start` (serve the build), `npm run lint` (ESLint).

The API client (`src/lib/api/client.ts`) sends all requests with `credentials: "include"` (HTTP-only auth cookies) and automatically attaches the CSRF token: it reads the `XSRF-TOKEN` cookie and sends it back as the `X-XSRF-TOKEN` header on mutating requests, priming it via `/api/auth/me` when absent.

---

## 🔌 API overview

All public endpoints are served by the Spring backend under `/api`. Full specs live in [`contracts/`](contracts/).

### Auth — `/api/auth`
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create an account |
| POST | `/login` | Email/password login |
| POST | `/refresh` | Rotate refresh token → new access token |
| POST | `/logout` | Revoke refresh token |
| GET | `/me` | Current user |

### Projects — `/api/projects`
`POST /` · `GET /?page=&size=` · `GET /{id}` · `PUT /{id}` · `DELETE /{id}`

### Documents — `/api/projects/{projectId}/documents`
`POST /` (multipart upload) · `GET /` · `GET /{id}` · `DELETE /{id}` · `POST /{id}/reprocess`

### Chat — `/api/projects/{projectId}/chat-sessions`
`POST /` · `GET /` · `GET /{sessionId}` · `POST /{sessionId}/messages` (RAG query)

### Writing — `/api/ai/writing`
`POST /outline` · `/abstract` · `/improve` · `/summarize` · `/extract-paper-insights` · `/citation-format`

### Internal AI service — `/internal` *(not public; requires `X-Internal-Service-Token`)*
`POST /internal/ingest` · `POST /internal/rag/query` · `POST /internal/writing/*` · `GET /health`

---

## 🗄️ Data model

Core tables (see `backend-spring/src/main/resources/db/migration/V1__init.sql`):

- **users** — accounts (local + OAuth), roles, provider info
- **refresh_tokens** — hashed, revocable refresh tokens
- **projects** — research workspaces owned by a user
- **documents** — uploaded files with ingestion status & page count
- **document_chunks** — text chunks + `vector(1536)` embeddings (IVFFlat cosine index)
- **chat_sessions** / **chat_messages** — conversations and messages (citations stored as JSONB)
- **ai_usage_events** — per-user model + token usage accounting

---

## 🔒 Security model

- The **Python AI service is never exposed to the internet** — only the Spring backend calls it, authenticated with a shared `X-Internal-Service-Token`.
- JWT access tokens are short-lived; refresh tokens are long-lived, **hashed at rest**, rotated, and revocable.
- Auth cookies are HTTP-only; CSRF protection is enabled via a CSRF cookie filter.
- CORS is restricted to the configured frontend origin.
- File uploads are restricted by extension and content type (PDF, DOCX, TXT, MD) and stored with sanitized, namespaced paths.
- **Never commit secrets.** `.env` files are gitignored; only `.env.example` is tracked.

---

## ☁️ Deployment

For a step-by-step guide to deploying ScholarAI on the **AWS Free Tier** (for testing/showcase), see **[DEPLOY_AWS.md](DEPLOY_AWS.md)**.

---

## 🤝 Contributing

This is a personal/showcase project. Issues and suggestions are welcome. When contributing:
- Keep the frontend → Spring → AI service boundary intact (the browser must never call the AI service directly).
- Add a Flyway migration for any schema change.
- Don't commit secrets or `.env` files.

---

## 📄 License

No license file is currently included. Add one (e.g. MIT) before sharing or reuse.
