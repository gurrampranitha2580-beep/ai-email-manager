# AI Email Manager

Full-stack AI-powered email management application built from `spec.md` (the SDD).

Current state: **Phase 1 — Project Foundation**. The Express backend, the React/Vite
frontend, routing, base UI, environment configuration, centralized error handling
and the `/api/health` endpoint are in place. Gmail, Google OAuth, MongoDB and the
Gemini AI features are implemented in later milestones and are not part of this phase.

## Requirements

- Node.js 20+ (tested with v20.18.1)
- npm 10+

No database, Google account or API key is needed to run Phase 1.

## Project structure

```text
backend/    Express API (src/config, routes, controllers, services, middleware, models, utils)
frontend/   React + Vite + Tailwind app (src/components, pages, services, store, hooks)
```

## Run it locally

Open two terminals.

### 1. Backend (port 5000)

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values below
npm run dev               # or: npm start
```

`backend/.env` for local development:

```text
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

The Vite dev server proxies `/api` to `http://localhost:5000`, so no frontend
environment file is required locally. To point the frontend at a different API,
copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL`.

## What you should see

- Landing page at `/` with a **System status** panel showing "Backend connected"
  (this is the frontend calling `GET /api/health`). If the backend is stopped it
  shows an error state with a **Retry** button.
- App shell with sidebar navigation at `/dashboard`, `/inbox`, `/email/:id`,
  `/compose`, `/activity`, `/settings` — these render base UI plus empty states
  until the Gmail/AI milestones land.
- `/login` with a disabled "Continue with Google" button (OAuth arrives in
  Milestone 2).
- Any unknown route renders a 404 page.

## Verify the API directly

```bash
curl http://localhost:5000/api/health
# {"success":true,"data":{"status":"ok","service":"ai-email-manager-backend", ...}}

curl -i http://localhost:5000/api/does-not-exist
# HTTP/1.1 404 ... {"success":false,"error":{"code":"NOT_FOUND","message":"..."}}
```

## Checks

```bash
cd backend  && npm run lint && npm test    # ESLint + node:test API tests
cd frontend && npm run lint && npm run build
```

## Notes

- `.env` files are gitignored; only `.env.example` files are committed.
- Secrets (Google OAuth client secret, Gemini API key, MongoDB URI, token
  encryption key) will live on the backend only — never in the frontend.
