# AI Email Manager

Full-stack AI-powered email management application built from `spec.md` (the SDD).

Current state: **Milestone 2 — Google OAuth + Gmail integration**. On top of the
Phase 1 foundation you can now sign in with Google, have the app store your Gmail
authorization encrypted on the server, and read your real Gmail: inbox list,
search, and full thread view, with activity logging. Email actions
(star/archive/trash/read state), compose/reply and the Gemini AI features arrive in
Milestones 3–4.

## Requirements

- Node.js 20+ (tested with v20.18.1)
- npm 10+
- MongoDB running locally (or a MongoDB Atlas connection string)
- A Google Cloud OAuth 2.0 **Web application** client with the Gmail API enabled

### MongoDB

Local install (Ubuntu/Debian) or Docker:

```bash
docker run -d --name mongo -p 27017:27017 mongo:7
```

Connection string used below: `mongodb://127.0.0.1:27017/ai_email_manager`.

### Google Cloud setup

1. Create/select a project at https://console.cloud.google.com.
2. Enable the **Gmail API** (APIs & Services → Library).
3. OAuth consent screen: External, add your own Google account under **Test users**.
4. Credentials → Create credentials → **OAuth client ID** → Web application.
   - Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy the client ID and client secret into `backend/.env`.

The scopes are requested by the app itself, so you do not need to add them manually:
`openid`, `userinfo.email`, `userinfo.profile`, `gmail.readonly`, `gmail.modify`,
`gmail.send`.

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

MONGODB_URI=mongodb://127.0.0.1:27017/ai_email_manager

GOOGLE_CLIENT_ID=<your client id>
GOOGLE_CLIENT_SECRET=<your client secret>
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

SESSION_SECRET=<random string, e.g. openssl rand -hex 32>
TOKEN_ENCRYPTION_KEY=<random string, e.g. openssl rand -hex 32>
```

The backend refuses to start if any of these are missing, and it connects to
MongoDB before listening.

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

## Try the flow

1. Open http://localhost:5173 → **Continue with Google** → `/login`.
2. Click **Continue with Google**; approve the Google consent screen with the
   account you added as a test user.
3. You land on `/dashboard`: unread/total counts, Gmail connection status, and
   your five most recent inbox messages.
4. `/inbox` lists your inbox; use the search bar (Anywhere / From / To / Subject)
   to run a real Gmail search.
5. Click a message to open `/email/:id` — the full thread is shown, HTML bodies are
   sanitized in the browser before rendering.
6. `/activity` lists what you have done in the app (e.g. emails opened).
7. `/settings` shows the connected Google account and lets you disconnect Gmail;
   the navbar **Sign out** clears the session cookie.

## API endpoints

```text
GET  /api/health
GET  /api/auth/google              redirect to Google consent (sets oauth_state cookie)
GET  /api/auth/google/callback     exchanges the code, sets the app_session cookie
GET  /api/auth/me                  current user (auth required)
GET  /api/auth/status              user + Gmail connection status (auth required)
POST /api/auth/logout              clears the session cookie
POST /api/auth/disconnect          disconnects Gmail and deletes stored tokens
GET  /api/emails                   inbox list
GET  /api/emails/search?q=&field=  Gmail search (field: from|to|subject)
GET  /api/emails/unread-count      inbox unread/total counts
GET  /api/emails/:id               single message
GET  /api/threads/:threadId        full thread
GET  /api/activity                 recent activity for the signed-in user
```

## Verify the API directly

```bash
curl http://localhost:5000/api/health
# {"success":true,"data":{"status":"ok", ...}}

curl http://localhost:5000/api/auth/me
# {"success":false,"error":{"code":"AUTH_REQUIRED","message":"You need to sign in to continue."}}

curl -i http://localhost:5000/api/auth/google | grep -i location
# 302 to accounts.google.com with the Gmail scopes

curl -i http://localhost:5000/api/does-not-exist
# HTTP/1.1 404 ... {"success":false,"error":{"code":"NOT_FOUND","message":"..."}}
```

## Checks

```bash
cd backend  && npm run lint && npm test    # ESLint + node:test (API + unit tests)
cd frontend && npm run lint && npm run build
```

## Security notes

- Your Gmail password is never requested or stored; access is via Google OAuth.
- Access and refresh tokens are encrypted with AES-256-GCM before being written to
  MongoDB, are excluded from queries by default, and are never sent to the frontend.
- The application session is a signed JWT in an HTTP-only cookie; OAuth callbacks
  are protected with a state cookie.
- Helmet, CORS with credentials, rate limiting and express-validator input
  validation are enabled on the API.
- `.env` files are gitignored; only `.env.example` files are committed.
