# DAMAYAN Frontend

Final project (Frontend) of Cody Aguinaldo, Shantel Clarin, and Lance Cudia in Advanced Web Development.

A donation-drive platform: donors browse verified drives and track donations; collectors (organizations) create and manage drives.

## Stack
React 19 · Vite · TypeScript · Tailwind CSS v4 · React Router 7 · React Hook Form + Zod · Axios

## Getting started
```bash
npm install
npm run dev        # start the dev server
npm run typecheck  # TypeScript check
npm run build      # production build
```

## Configuration
| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API. If unset, the app runs in **demo mode**: requests go to `/api`, fail, and the UI falls back to seeded data in `src/data/mockData.ts`. Create/delete actions are simulated. |

## Structure
```
src/
  api/         axios client (token + 401 handling)
  auth/        AuthContext, ProtectedRoute
  app/         App + router
  components/  AppShell, shared page primitives (PageHeader, Notice, FormField)
  hooks/       useApiResource
  pages/       Landing, Auth, Drives, Donor, Collector pages
  schemas/     Zod schemas for all forms
  data/        seeded demo data
```

## Roles
- **Public:** drives, matching, collection centers
- **Signed in:** donations, pickups
- **Collector:** dashboard, manage/create drives (access must also be enforced by the API)
