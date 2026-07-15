# TaskY — Modern Task Management Application Frontend

TaskY is a production-ready, feature-based Task Management Application built with React, TypeScript, Vite, and Tailwind CSS. It is designed to be highly responsive, modern, and robust, providing complete control over workspaces, projects, members, and task workflows.

---

## Architecture Overview

This project follows a **Feature-Based (Domain-Driven) Architecture** to ensure high modularity, scalability, and ease of testing. Core directories are organized as follows:

```
src/
├── api/             # Base API Client (Axios configuration, token interceptors, response parsers)
├── components/      # Global reusable UI and layout components
│   ├── layout/      # AppShell, Sidebar, Header, Mobile navigation
│   └── ui/          # Button, Input, Select, Modal, Alert, States (Loading, Error)
├── features/        # Feature-specific modules containing their own components, api, hooks, types
│   ├── auth/        # Register/Login forms, JWT token context, auth hooks
│   ├── members/     # Workspace membership management and workspace members listing
│   ├── projects/    # Project CRUD, forms, and cards
│   ├── tasks/       # Task CRUD, kanban board columns, filters, forms
│   └── users/       # User search and autocomplete helpers
├── lib/             # Third-party integrations (React Query Client config)
├── pages/           # High-level page route definitions
├── utils/           # Shared utility functions (standardized errorHandler, etc.)
└── types/           # App-wide shared TypeScript declarations
```

---

## Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4 (with modern Vite CSS setup)
- **Routing**: React Router v6 (protected and public routes)
- **State Management & Caching**: TanStack Query (React Query) v5
- **Forms & Validation**: React Hook Form, Zod Resolver, Zod schema validation
- **HTTP Client**: Axios (pre-configured interceptors for JWT auth and 401 handling)
- **End-to-End Testing**: Playwright E2E framework
- **Toasts & Feedback**: Sonner

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or later (Active LTS recommended)
- **npm**: `v10.x` or later
- **Git**: Version control client
- **Backend API**: The .NET WebApi backend project (`TaskManagementAppApi` running on port `5174`)

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TaskY
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file from the example:
   ```bash
   # On macOS/Linux:
   cp .env.example .env
   
   # On Windows (PowerShell):
   copy .env.example .env
   ```

---

## Environment Variables

The project uses Vite-style environment variables. Configure them in your `.env` file:

| Variable Name | Description | Default Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | The base URL of the backend API. **Leave empty for local dev** so requests use the `/api` Vite proxy (avoids CORS). | *(empty)* |
| `VITE_ENABLE_MSW` | If set to `true`, enables Mock Service Worker for mocking endpoints locally. | `false` |

---

## Running the Project

To start the local development server:

```bash
npm run dev
```

- **Default Port**: `http://localhost:5173`
- **Proxy Setup**: All API calls targeting `/api` are automatically proxied to the backend at `https://localhost:7052` (configured in `vite.config.ts`). The browser only talks to `localhost:5173`, so **no backend CORS is required**.
- **Backend Requirement**: Ensure the .NET backend API is running (`dotnet run` in `TaskManagementApp.WebApi`). Swagger: `https://localhost:7052/swagger`.

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts the local Vite development server on port 5173. |
| `npm run build` | `tsc -b && vite build` | Compiles TypeScript and builds the production bundle in `dist/`. |
| `npm run preview`| `vite preview` | Previews the local production build on a local server. |
| `npm run lint` | `eslint .` | Runs ESLint utility checks to analyze static code quality. |
| `npm run e2e` | `playwright test` | Runs the Playwright E2E smoke test suite in headless mode. |
| `npm run e2e:ui` | `playwright test --ui` | Opens the interactive Playwright test runner UI. |

---

## End-to-End Testing

We use **Playwright** to run smoke tests verifying core user lifecycles.

### Setup and execution:
```bash
# Install required browser binaries (if running for the first time)
npx playwright install --with-deps chromium

# Run all tests
npm run e2e
```

### Verified User Flows:
1. **Authentication Smoke Test**: Covers Register, Login, Route Protection / Redirection, and Logout.
2. **Workspace Smoke Test**: Covers Workspace Creation, dashboard lists, and navigation.
3. **Project Smoke Test**: Covers Project Creation and visibility within a workspace.
4. **Task Smoke Test**: Covers the full Task lifecycle (Create -> Kanban view list -> Edit/Update -> Delete).

---

## Troubleshooting

### 1. CORS / Wrong API URL
- **Symptom**: Browser console shows CORS errors, or requests go to `http://localhost:5174` instead of the Vite dev server.
- **Cause**: `VITE_API_BASE_URL` is set to a direct backend URL. The backend has no CORS policy.
- **Solution**: Remove or comment out `VITE_API_BASE_URL` in `.env`. Restart `npm run dev`. Requests will use `/api` and the Vite proxy to `https://localhost:7052`.

### 2. Backend Not Running / Connection Errors
- **Symptom**: Console shows `ERR_CONNECTION_REFUSED` or network timeouts.
- **Solution**: Ensure your .NET backend is running. Go to the backend folder (`TaskManagementAppApi/TaskManagementApp.WebApi`) and execute `dotnet run`.

### 3. Authentication Tokens Expiring / Immediate Redirects
- **Symptom**: Logging in redirects you right back to the login page.
- **Solution**: Check if your backend is configured to issue valid JWTs. Check your browser localStorage for `access_token` and verify its structure.

### 4. Missing CSS styles / Tailwind issues
- **Symptom**: UI elements look basic or unstyled.
- **Solution**: Ensure you are using Tailwind v4. Run `npm run dev` again, which compiles the modern CSS configuration in `src/index.css`.
