# API Architecture

The application communicates with the database exclusively through a server-side API layer.

## 1. COMMUNICATION FLOW
- **Frontend (React/Next.js)** -> `fetch` / Server Actions -> **Backend API Route** -> **Prisma ORM** -> **Remote MySQL**
- The browser NEVER communicates directly with the MySQL database.
- The API abstracts all database complexity and validates input before executing queries.

## 2. NEXT.JS API ROUTES (App Router)
All endpoints reside within `src/app/api/`.

### Core Endpoints:
- `/api/auth/*` - Handles login, logout, and session verification.
- `/api/admin/*` - Protected endpoints for the CMS (e.g., managing pages, services, users). Requires admin session.
- `/api/pages` - Fetches page content and section data for rendering the public site.
- `/api/services` - Fetches service hierarchies and details.
- `/api/projects` - Fetches projects for the portfolio.
- `/api/gallery` - Fetches gallery media.
- `/api/blog` - Fetches blog posts.
- `/api/products` - Fetches WooCommerce/product data.
- `/api/contact` - Handles contact form submissions.

## 3. SECURITY & VALIDATION
- **Authentication**: Admin API routes verify HTTP-only session cookies.
- **Validation**: Use Zod or similar schema validation to strictly validate all incoming request bodies and parameters.
- **Error Handling**: Catch database errors at the API level. Return sanitized generic errors (e.g., `500 Internal Server Error`) to the client without exposing SQL structure or secrets.
- **Rate Limiting**: Apply rate limiting, especially to `/api/auth/login` and `/api/contact`.

## 4. SERVER ACTIONS
For Next.js App Router, some data fetching and mutations (like submitting contact forms or admin CMS actions) may utilize Next.js Server Actions (`"use server"`) as an alternative to explicit REST API routes. These actions must enforce the exact same security and validation rules as standard API endpoints.
