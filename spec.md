# AI-Powered Email Management Application

## Software Design & Development Specification (SDD)

---

# 1. Project Overview

Build a full-stack **AI-Powered Email Management Application** that connects to a user's Gmail account through **Google OAuth 2.0** and the **Gmail API**.

The application allows users to:

* Authenticate securely with Google
* Connect and access their Gmail account
* View their inbox
* Search emails
* Open and read email threads
* Mark emails as read/unread
* Star/unstar emails
* Archive emails
* Move emails to trash
* Compose and send emails
* Reply to existing email threads
* Generate AI summaries of emails
* Generate AI-powered reply drafts
* Edit AI-generated replies before sending
* View application activity/history
* Manage their Gmail connection

The application must use real Gmail data and real Gmail API operations.

The application must **never request or store a user's Gmail password**.

---

# 2. Core User Workflow

The primary workflow is:

```text
User
  ↓
Google Login
  ↓
Google OAuth Consent
  ↓
Secure OAuth Token Handling
  ↓
Gmail API Connection
  ↓
Email Dashboard
  ↓
Open Email / Thread
  ↓
AI Summarization
  ↓
Generate Reply
  ↓
User Reviews and Edits Reply
  ↓
Send Through Gmail
```

---

# 3. Technology Stack

## Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Axios
* Zustand
* Lucide React

## Backend

* Node.js
* Express.js
* Mongoose
* Google APIs Node.js client (`googleapis`)
* Google OAuth 2.0
* Axios
* express-validator
* Helmet
* CORS
* express-rate-limit
* cookie-parser

## Database

* MongoDB
* MongoDB Atlas for hosted deployment
* Mongoose for schema definition and database access

## AI

* Google Gemini API
* Official Google GenAI SDK

The Gemini API must only be called from the backend.

## Architecture

```text
React + Vite
     ↓
Express REST API
     ↓
 ┌───┴───────────────┐
 ↓                   ↓
MongoDB          Gmail API
                     ↓
                Google OAuth

Express Backend
     ↓
Gemini API
```

---

# 4. Architecture Principles

The application must follow a clear separation of responsibilities.

```text
Frontend
   ↓
API Routes
   ↓
Controllers
   ↓
Services
   ↓
Database / Gmail API / Gemini API
```

### Frontend

Responsible for:

* UI rendering
* navigation
* user interaction
* form handling
* displaying API responses
* loading/error/empty states
* client-side application state

### Backend

Responsible for:

* authentication
* authorization
* OAuth flow
* session management
* Gmail API communication
* AI communication
* database operations
* validation
* security
* business logic
* error handling

### Controllers

Controllers must remain thin.

Controllers should:

1. Receive the HTTP request.
2. Validate/forward request data.
3. Call the appropriate service.
4. Return the HTTP response.

Controllers must not contain substantial business logic or direct database/Gmail/Gemini calls.

### Services

Business logic belongs in services.

Required services:

```text
authService
gmailService
emailService
aiService
activityService
```

---

# 5. Authentication

Authentication must use **Google OAuth 2.0**.

The application must not implement Gmail email/password authentication.

The application must never:

* request a Gmail password
* store a Gmail password
* send a Gmail password to the backend
* expose Google OAuth secrets to the frontend

## Authentication Flow

```text
User
 ↓
Login Page
 ↓
Continue with Google
 ↓
Backend OAuth Start
 ↓
Google Authorization Page
 ↓
User Grants Permission
 ↓
Google OAuth Callback
 ↓
Backend Exchanges Authorization Code
 ↓
Retrieve Google User Information
 ↓
Create / Update Application User
 ↓
Create Application Session
 ↓
Redirect to Application
```

## Authentication Endpoints

```http
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/me
GET  /api/auth/status
POST /api/auth/logout
POST /api/auth/disconnect
```

---

# 6. Session Management

The application must maintain its own authenticated session.

Use a secure HTTP-only cookie.

The browser must not receive or store:

* Google access tokens
* Google refresh tokens
* Gemini API keys
* encryption keys
* database credentials
* OAuth client secrets

Do not store authentication tokens in:

```text
localStorage
sessionStorage
Zustand
URL parameters
```

Production cookies must use secure configuration appropriate for HTTPS.

---

# 7. Google OAuth Requirements

The backend must:

1. Generate the Google OAuth authorization URL.
2. Request only the scopes required by the application.
3. Use an OAuth `state` value to protect the callback flow.
4. Handle user consent.
5. Handle denied permissions.
6. Exchange the authorization code server-side.
7. Retrieve Google account information.
8. Store required OAuth credentials securely.
9. Refresh expired access tokens when possible.
10. Handle revoked/expired credentials.
11. Support disconnecting the Gmail account.
12. Support reconnecting the Gmail account.

OAuth credentials must never be returned to the frontend.

---

# 8. Gmail Integration

All Gmail API communication must be handled by the backend.

The frontend must never directly call the Gmail API.

Create:

```text
services/gmailService.js
```

The Gmail service must handle:

* Gmail client creation
* authentication
* token refresh
* message retrieval
* thread retrieval
* search
* message modification
* email sending

---

# 9. Gmail Features

The application must support the following Gmail operations.

## Inbox

Users can view their Gmail inbox.

Each email item should display:

* sender
* subject
* snippet
* date/time
* read/unread state
* starred state
* attachment indicator when available

## Email Details

Users can open an email and view:

* sender
* recipient
* subject
* timestamp
* body
* attachments metadata where applicable

## Threads

The application must support Gmail conversation threads.

A thread should display its individual messages:

```text
Email Thread
 ├── Message 1
 ├── Message 2
 ├── Message 3
 └── Message 4
```

Messages should support expanded/collapsed display.

---

# 10. Email Search

Users must be able to search their Gmail account.

Endpoint:

```http
GET /api/emails/search
```

The backend must translate the search request into an appropriate Gmail API search query.

Support common searches such as:

```text
sender
subject
keyword
```

Gmail-compatible search syntax may also be supported.

Search UI must provide:

* search input
* loading state
* results
* no-results state
* error state
* clear search action

---

# 11. Email Management

The following operations must be implemented.

## Mark Read

```http
PATCH /api/emails/:id/read
```

## Mark Unread

```http
PATCH /api/emails/:id/unread
```

## Star

```http
PATCH /api/emails/:id/star
```

## Unstar

```http
PATCH /api/emails/:id/unstar
```

## Archive

```http
POST /api/emails/:id/archive
```

## Trash

```http
DELETE /api/emails/:id
```

Every operation must:

1. Verify authentication.
2. Verify Gmail connection.
3. Perform the Gmail API operation.
4. Return an appropriate response.
5. Update the frontend state.
6. Record activity where appropriate.

---

# 12. Email Composition

Users must be able to compose a new email.

The compose interface must contain:

```text
To
Cc
Bcc
Subject
Message
```

Endpoint:

```http
POST /api/emails/send
```

The backend must:

1. Authenticate the user.
2. Validate recipients.
3. Validate email content.
4. Verify Gmail connection.
5. Construct a valid Gmail API message.
6. Send the email through Gmail.
7. Record the activity.
8. Return the result.

---

# 13. Email Reply

Users must be able to reply to an existing Gmail thread.

Endpoint:

```http
POST /api/threads/:threadId/reply
```

The reply must remain associated with the original Gmail thread.

The backend must obtain the necessary Gmail message/thread metadata and construct the appropriate Gmail reply.

---

# 14. AI Email Summarization

The application must provide AI-powered email summarization.

Endpoint:

```http
POST /api/ai/summarize
```

## Workflow

```text
User opens email/thread
        ↓
User clicks "Summarize"
        ↓
Backend retrieves Gmail content
        ↓
Email content is cleaned
        ↓
Gemini API
        ↓
Structured summary
        ↓
Frontend
```

The backend must retrieve the email/thread itself instead of trusting arbitrary email content supplied by the browser.

## Summary Output

The AI should produce:

```json
{
  "summary": "Short overall summary",
  "keyPoints": [
    "Important point 1",
    "Important point 2"
  ],
  "actionItems": [
    "Required action"
  ],
  "deadline": null
}
```

The backend must validate the AI response before returning it.

The UI must provide:

* Generate Summary button
* loading state
* summary result
* error state
* retry option

---

# 15. AI Reply Generation

The application must generate contextual reply drafts using Gemini.

Endpoint:

```http
POST /api/ai/generate-reply
```

The AI must receive relevant context from the email/thread.

Users must be able to select a reply tone:

```text
Professional
Friendly
Concise
Detailed
```

Users may optionally provide additional instructions.

Example:

```text
"Tell them I can complete this by Friday."
```

## Workflow

```text
Email Thread
     +
Reply Tone
     +
Optional Instruction
     ↓
Backend
     ↓
Gemini
     ↓
Generated Draft
     ↓
Reply Editor
```

---

# 16. Human Review Before Sending

AI-generated replies must always be treated as drafts.

The AI must never automatically send an email.

Required workflow:

```text
Generate Reply
      ↓
Display Draft
      ↓
User Reviews
      ↓
User Edits
      ↓
User Clicks Send
      ↓
Backend
      ↓
Gmail API
```

The final send operation must always require an explicit user action.

---

# 17. AI Service

Create:

```text
services/aiService.js
```

The service is responsible for:

* Gemini client configuration
* summarization
* reply generation
* prompt construction
* response parsing
* response validation
* AI error handling

The Gemini API key must exist only on the backend.

The frontend must never contain:

```text
GEMINI_API_KEY
```

or any equivalent secret.

---

# 18. Database Design

Use MongoDB with Mongoose.

MongoDB stores **application-owned information**, not an unnecessary copy of the user's entire Gmail mailbox.

Gmail remains the source of truth for email messages.

## User Model

```text
User
├── _id
├── googleId
├── email
├── name
├── profilePicture
├── createdAt
└── updatedAt
```

## GmailConnection Model

```text
GmailConnection
├── _id
├── userId
├── googleAccountEmail
├── encryptedAccessToken
├── encryptedRefreshToken
├── tokenExpiry
├── scopes
├── status
├── createdAt
└── updatedAt
```

OAuth tokens must never be returned through normal API responses.

## Activity Model

```text
Activity
├── _id
├── userId
├── action
├── emailId
├── threadId
├── metadata
└── createdAt
```

Possible actions:

```text
EMAIL_VIEWED
EMAIL_STARRED
EMAIL_UNSTARRED
EMAIL_ARCHIVED
EMAIL_TRASHED
EMAIL_MARKED_READ
EMAIL_MARKED_UNREAD
EMAIL_SENT
EMAIL_REPLIED
AI_SUMMARY_GENERATED
AI_REPLY_GENERATED
```

## AIHistory Model

```text
AIHistory
├── _id
├── userId
├── emailId
├── threadId
├── type
├── result
└── createdAt
```

Do not unnecessarily store complete email bodies inside AI history.

---

# 19. Database Relationships

Relationships:

```text
User
 │
 ├── GmailConnection
 │
 ├── Activity
 │
 └── AIHistory
```

A user may have:

* one active Gmail connection
* many activity records
* many AI history records

Use MongoDB references through `userId`.

Indexes should be added where appropriate, especially for:

```text
User.googleId
User.email
GmailConnection.userId
Activity.userId
Activity.createdAt
AIHistory.userId
```

---

# 20. API Structure

## Health

```http
GET /api/health
```

## Authentication

```http
GET  /api/auth/google
GET  /api/auth/google/callback
GET  /api/auth/me
GET  /api/auth/status
POST /api/auth/logout
POST /api/auth/disconnect
```

## Emails

```http
GET    /api/emails
GET    /api/emails/search
GET    /api/emails/:id
PATCH  /api/emails/:id/read
PATCH  /api/emails/:id/unread
PATCH  /api/emails/:id/star
PATCH  /api/emails/:id/unstar
POST   /api/emails/:id/archive
DELETE /api/emails/:id
POST   /api/emails/send
```

## Threads

```http
GET  /api/threads/:threadId
POST /api/threads/:threadId/reply
```

## AI

```http
POST /api/ai/summarize
POST /api/ai/generate-reply
```

## Activity

```http
GET /api/activity
```

---

# 21. Frontend Pages

The application must contain the following pages.

```text
/
├── /
├── /login
├── /dashboard
├── /inbox
├── /email/:id
├── /compose
├── /activity
└── /settings
```

## Landing Page

The landing page should explain:

* what the application does
* Gmail integration
* AI summarization
* AI reply generation
* security
* main benefits

Provide a clear Google Login CTA.

## Login

Provide Google authentication.

Display appropriate loading and authentication error states.

## Dashboard

Display:

* Gmail connection status
* unread email count
* recent emails
* recent activity
* quick actions

## Inbox

Display:

* email list
* search
* filters/navigation
* unread indicators
* starred indicators
* email actions

## Email Details

Display:

* complete thread
* message information
* email body
* email actions
* AI summary
* AI reply generation
* reply editor

## Compose

Provide the complete compose form.

## Activity

Display chronological application activity.

## Settings

Display:

* connected Google account
* Gmail connection status
* reconnect
* disconnect
* logout

---

# 22. Frontend Components

Suggested structure:

```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── AppShell.jsx
│   │
│   ├── auth/
│   │   └── GoogleLoginButton.jsx
│   │
│   ├── email/
│   │   ├── EmailList.jsx
│   │   ├── EmailListItem.jsx
│   │   ├── EmailThread.jsx
│   │   ├── EmailMessage.jsx
│   │   ├── EmailToolbar.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── ai/
│   │   ├── SummaryPanel.jsx
│   │   ├── ReplyGenerator.jsx
│   │   └── ReplyEditor.jsx
│   │
│   ├── compose/
│   │   └── ComposeForm.jsx
│   │
│   └── common/
│       ├── LoadingState.jsx
│       ├── ErrorState.jsx
│       └── EmptyState.jsx
│
├── pages/
├── services/
├── store/
└── App.jsx
```

The exact structure may be adjusted if necessary, but responsibilities must remain separated.

---

# 23. Frontend API Layer

Create a centralized API client.

Example:

```text
services/api.js
```

All backend communication should go through this layer.

Do not scatter raw Axios calls throughout unrelated components.

Create appropriate API functions for:

```text
auth
emails
threads
AI
activity
```

---

# 24. State Management

Use Zustand only for appropriate client-side application state.

Potential state:

```text
currentUser
authentication state
Gmail connection status
UI state
sidebar state
```

Do not unnecessarily store complete Gmail datasets globally.

Email and thread data should be retrieved from the backend when needed.

Do not introduce Redux.

---

# 25. Protected Routes

The following pages require authentication:

```text
/dashboard
/inbox
/email/:id
/compose
/activity
/settings
```

Unauthenticated users must be redirected to `/login`.

The backend must independently protect authenticated API endpoints.

Frontend route protection alone is not sufficient.

---

# 26. Error Handling

Use a centralized backend error handler.

Errors must have predictable structures.

Possible error codes:

```text
AUTH_REQUIRED
AUTH_FAILED
GMAIL_NOT_CONNECTED
GOOGLE_AUTH_FAILED
GOOGLE_TOKEN_EXPIRED
GMAIL_API_ERROR
EMAIL_NOT_FOUND
THREAD_NOT_FOUND
INVALID_INPUT
AI_REQUEST_FAILED
AI_RESPONSE_INVALID
RATE_LIMITED
INTERNAL_SERVER_ERROR
```

The frontend must display understandable messages.

Example:

```text
Technical:
401 invalid_grant

User-facing:
"Your Gmail connection has expired. Please reconnect your Google account."
```

---

# 27. Input Validation

Validate all user-controlled input on the backend.

Validate:

* email addresses
* subject
* message body
* search queries
* thread IDs
* email IDs
* AI tone
* AI instructions

Do not rely only on frontend validation.

---

# 28. Security Requirements

The application must:

* use Google OAuth instead of Gmail passwords
* keep OAuth client secrets on the backend
* keep Gemini API key on the backend
* keep MongoDB credentials on the backend
* use HTTP-only cookies
* encrypt stored OAuth tokens
* never return refresh tokens to the frontend
* never log access/refresh tokens
* never commit `.env`
* use Helmet
* configure CORS
* rate-limit sensitive endpoints
* validate API inputs
* use HTTPS in production
* handle expired/revoked Gmail credentials
* avoid unnecessary storage of email contents
* safely render email HTML
* avoid exposing sensitive information in error responses

---

# 29. Token Encryption

OAuth access and refresh tokens stored in MongoDB must be encrypted at rest.

Use an application-level encryption key stored in an environment variable.

Example:

```text
TOKEN_ENCRYPTION_KEY
```

The encryption/decryption implementation must exist only on the backend.

Never expose:

```text
TOKEN_ENCRYPTION_KEY
```

to the frontend.

---

# 30. Environment Variables

Create:

```text
.env.example
```

with variable names only.

Example:

```text
NODE_ENV=
PORT=
CLIENT_URL=

MONGODB_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

SESSION_SECRET=
TOKEN_ENCRYPTION_KEY=

GEMINI_API_KEY=
```

Actual values must never be committed to source control.

---

# 31. Gmail Content Handling

Gmail messages may contain:

* plain text
* HTML
* multipart content
* encoded content
* missing body sections

The Gmail service must correctly parse supported message formats.

Email HTML must not be inserted into the DOM unsafely.

Use safe sanitization before rendering HTML email content.

---

# 32. AI Prompting Requirements

AI prompts must be constructed on the backend.

For summarization, provide the model with the relevant cleaned email/thread content and request a concise structured result.

For reply generation, provide:

* relevant conversation context
* selected tone
* optional user instruction

The model must be instructed to produce only the requested output.

The application must not blindly trust model output.

AI responses must be parsed and validated before being returned to the frontend.

---

# 33. AI Failure Handling

If Gemini is unavailable:

```text
User
 ↓
Generate Summary
 ↓
Gemini Error
 ↓
Friendly Error Message
 ↓
Retry
```

Do not expose raw API keys, provider internals, or stack traces.

The application must remain usable for normal Gmail operations even if the AI service is unavailable.

---

# 34. Activity History

The application must record important user actions.

Examples:

```text
Opened email
Starred email
Archived email
Deleted email
Generated summary
Generated reply
Sent email
Replied to thread
```

The activity page must show:

* action
* relevant email/thread information
* timestamp

Newest activities should appear first.

---

# 35. UI/UX Requirements

The UI should have a modern email-client aesthetic.

Requirements:

* responsive design
* clean navigation
* consistent spacing
* clear typography
* readable email content
* obvious primary actions
* accessible buttons
* loading states
* empty states
* error states
* confirmation where destructive actions require it

Use Tailwind CSS.

Use Lucide React for icons.

Avoid unnecessary visual complexity.

---

# 36. Loading States

All asynchronous operations must provide feedback.

Examples:

```text
Inbox:
Loading → skeleton/list loader

Email:
Loading → email skeleton

AI:
Generating summary...

Send:
Sending...

OAuth:
Connecting to Google...
```

---

# 37. Empty States

Examples:

```text
No emails found.

No search results.

No activity yet.

Gmail is not connected.
```

Each empty state should explain what the user can do next where appropriate.

---

# 38. Responsive Design

The application must work on:

* desktop
* tablet
* mobile

The inbox layout should adapt appropriately.

On smaller screens:

* sidebar may collapse
* email list and email detail may become separate views
* compose form must remain usable
* AI panels must remain readable

---

# 39. Backend Folder Structure

Use the following structure:

```text
backend/
└── src/
    ├── config/
    │   ├── env.js
    │   └── db.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── emailRoutes.js
    │   ├── threadRoutes.js
    │   ├── aiRoutes.js
    │   └── activityRoutes.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── emailController.js
    │   ├── threadController.js
    │   ├── aiController.js
    │   └── activityController.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── gmailService.js
    │   ├── emailService.js
    │   ├── aiService.js
    │   └── activityService.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   ├── validation.js
    │   └── rateLimiter.js
    │
    ├── models/
    │   ├── User.js
    │   ├── GmailConnection.js
    │   ├── Activity.js
    │   └── AIHistory.js
    │
    ├── utils/
    │   ├── encryption.js
    │   ├── gmailParser.js
    │   └── emailFormatter.js
    │
    └── server.js
```

---

# 40. Frontend Folder Structure

```text
frontend/
└── src/
    ├── components/
    │   ├── layout/
    │   ├── auth/
    │   ├── email/
    │   ├── ai/
    │   ├── compose/
    │   └── common/
    │
    ├── pages/
    │   ├── Landing.jsx
    │   ├── Login.jsx
    │   ├── Dashboard.jsx
    │   ├── Inbox.jsx
    │   ├── EmailDetails.jsx
    │   ├── Compose.jsx
    │   ├── Activity.jsx
    │   └── Settings.jsx
    │
    ├── services/
    │   └── api.js
    │
    ├── store/
    │   └── authStore.js
    │
    ├── hooks/
    ├── utils/
    ├── App.jsx
    └── main.jsx
```

---

# 41. Development Phases

The application must be implemented incrementally.

## Phase 1 — Project Foundation

Build:

* React/Vite frontend
* Express backend
* basic folder structure
* environment configuration
* API health endpoint
* base UI
* routing
* common error handling

Acceptance:

```text
Frontend runs.
Backend runs.
Frontend can reach /api/health.
```

---

## Phase 2 — MongoDB & Models

Implement:

* MongoDB connection
* Mongoose
* User model
* GmailConnection model
* Activity model
* AIHistory model

Acceptance:

```text
Backend can connect to MongoDB.
Models validate correctly.
Database errors are handled.
```

---

## Phase 3 — Google OAuth

Implement:

* Google OAuth configuration
* OAuth start
* callback
* user creation/update
* secure session
* auth middleware
* `/auth/me`
* logout

Acceptance:

```text
User can authenticate with Google.
Authenticated session works.
Protected endpoints reject unauthenticated users.
```

---

## Phase 4 — Gmail Integration

Implement:

* Gmail client
* token handling
* inbox retrieval
* message parsing
* thread retrieval
* Gmail search

Acceptance:

```text
Authenticated user can see real Gmail data.
User can open a real Gmail thread.
Search works.
```

---

## Phase 5 — Email Management

Implement:

* read/unread
* star/unstar
* archive
* trash
* email details
* thread UI

Acceptance:

```text
Changes made in application are reflected in Gmail.
```

---

## Phase 6 — Compose & Reply

Implement:

* compose page
* email validation
* Gmail send
* thread reply
* success/error states

Acceptance:

```text
User can compose and send a real email.
User can reply to a real Gmail thread.
```

---

## Phase 7 — AI Summarization

Implement:

* Gemini integration
* summarization prompts
* structured response
* summary UI
* retry/error handling
* AI history

Acceptance:

```text
User opens a real email/thread.
User requests summary.
AI returns useful structured summary.
```

---

## Phase 8 — AI Reply Generation

Implement:

* contextual reply generation
* tone selection
* optional instructions
* editable reply UI
* validation

Acceptance:

```text
AI generates a reply based on the actual email context.
User can modify the reply.
AI does not send automatically.
```

---

## Phase 9 — Activity & Settings

Implement:

* activity history
* Gmail connection status
* disconnect
* reconnect
* account information
* logout

Acceptance:

```text
Important application actions appear in activity history.
User can manage Gmail connection.
```

---

## Phase 10 — Security & Hardening

Implement and verify:

* secure cookies
* token encryption
* CORS
* Helmet
* rate limiting
* validation
* secure error responses
* sensitive-data logging review
* HTML email sanitization

Acceptance:

```text
No sensitive credentials are exposed to frontend.
No secrets are hardcoded.
Protected endpoints are secured.
```

---

## Phase 11 — Testing & Integration Verification

Test:

* OAuth
* authentication
* protected routes
* Gmail connection
* inbox
* search
* email actions
* thread display
* sending
* replying
* AI summarization
* AI reply generation
* activity history
* error handling
* responsive UI

---

## Phase 12 — Production Readiness

Verify:

* frontend/backend environment configuration
* production CORS
* production OAuth redirect URI
* secure cookies
* MongoDB connection
* Gmail API access
* Gemini API access
* error handling
* application startup
* API connectivity

---

# 42. Acceptance Criteria

The application is complete only when all of the following work.

## Authentication

* [ ] Google Login works.
* [ ] OAuth consent flow works.
* [ ] Application session works.
* [ ] Logout works.
* [ ] Protected routes work.
* [ ] Gmail passwords are never requested.

## Gmail

* [ ] Gmail connection works.
* [ ] Real inbox can be displayed.
* [ ] Email can be opened.
* [ ] Threads can be displayed.
* [ ] Search works.
* [ ] Read/unread works.
* [ ] Star/unstar works.
* [ ] Archive works.
* [ ] Trash works.
* [ ] Compose works.
* [ ] Send works.
* [ ] Reply works.

## AI

* [ ] Email summarization works.
* [ ] Summary is based on real email content.
* [ ] AI reply generation works.
* [ ] Reply uses conversation context.
* [ ] Tone selection works.
* [ ] User can edit generated reply.
* [ ] AI cannot send email automatically.
* [ ] AI failure is handled gracefully.

## Database

* [ ] Users are persisted.
* [ ] Gmail connections are persisted securely.
* [ ] Activity history is persisted.
* [ ] AI history is persisted appropriately.
* [ ] Database validation works.

## Security

* [ ] OAuth credentials are protected.
* [ ] Gmail tokens are encrypted at rest.
* [ ] Gemini key is backend-only.
* [ ] MongoDB credentials are backend-only.
* [ ] HTTP-only session cookies are used.
* [ ] Input validation exists.
* [ ] Rate limiting exists.
* [ ] CORS is configured.
* [ ] Helmet is configured.
* [ ] Sensitive tokens are not logged.

## UX

* [ ] Responsive UI.
* [ ] Loading states.
* [ ] Empty states.
* [ ] Error states.
* [ ] Clear navigation.
* [ ] Usable compose/reply experience.
* [ ] Safe rendering of email content.

---

# 43. AI Coding Agent Instructions

This SDD is the **single source of truth for implementation**.

The coding agent must follow these rules.

### General

1. Build the application phase by phase.
2. Do not skip required functionality.
3. Do not implement future phases prematurely.
4. Inspect existing files before modifying them.
5. Do not rewrite unrelated files.
6. Preserve working functionality.
7. Keep the implementation understandable and maintainable.

### Technology

8. Use React + Vite.
9. Use Express + Node.js.
10. Use MongoDB + Mongoose.
11. Use Google OAuth 2.0.
12. Use Gmail API.
13. Use Gemini API.
14. Use Tailwind CSS.
15. Use Zustand where appropriate.
16. Do not introduce Next.js.
17. Do not introduce Redux.
18. Do not introduce Redis.
19. Do not introduce BullMQ.
20. Do not introduce Socket.IO.
21. Do not introduce LangChain/LangGraph.
22. Do not introduce unrelated third-party integrations.

### Architecture

23. Keep controllers thin.
24. Put business logic in services.
25. Keep Gmail API communication inside `gmailService`.
26. Keep Gemini communication inside `aiService`.
27. Keep authentication logic inside authentication services.
28. Keep encryption utilities isolated.
29. Frontend communicates with backend through REST APIs.
30. Frontend must never directly call Gmail API.
31. Frontend must never directly call Gemini using a secret key.
32. Controllers must not directly contain MongoDB queries where a service layer is appropriate.

### Security

33. Never ask users for Gmail passwords.
34. Never expose Google client secrets.
35. Never expose Gmail access/refresh tokens to frontend.
36. Never expose Gemini API keys.
37. Never expose MongoDB credentials.
38. Never commit `.env`.
39. Never hardcode secrets.
40. Never log OAuth tokens.
41. Encrypt stored OAuth credentials.
42. Validate all user input.
43. Protect authenticated API routes.
44. Sanitize email HTML before rendering.

### AI

45. AI-generated replies are drafts only.
46. AI must never autonomously send an email.
47. User must explicitly click Send.
48. Retrieve actual email context through the backend.
49. Validate structured AI responses.
50. Handle AI failures without breaking normal email functionality.

### Implementation discipline

51. Implement one phase at a time.
52. Verify the current phase before proceeding.
53. Report files created or modified after each phase.
54. Report tests/checks performed after each phase.
55. Clearly report unresolved issues.
56. Do not claim a feature works unless it has actually been implemented and tested.
57. If a requirement conflicts with an existing implementation, identify the conflict before making destructive changes.
58. Prefer simple implementations over unnecessary abstractions.
59. Keep the project suitable for a student developer to understand and explain.
60. Follow this SDD unless an explicit requirement change is provided.

---

# 44. Final Product

The completed application must provide this end-to-end experience:

```text
Google Login
     ↓
OAuth Consent
     ↓
Secure Application Session
     ↓
Gmail Connection
     ↓
Inbox
     ↓
Search / Organize / Manage Emails
     ↓
Open Thread
     ↓
AI Summary
     ↓
Generate Reply
     ↓
Edit Reply
     ↓
User Clicks Send
     ↓
Gmail API
     ↓
Email Sent
     ↓
Activity Recorded
```

The final product must be a **real Gmail-integrated application with AI assistance**, not a static UI, mock email client, or chatbot that merely generates text.

The application must prioritize:

* real functionality
* security
* clear architecture
* maintainability
* responsive UX
* reliable error handling
* human control over AI-generated email actions
