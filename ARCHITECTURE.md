# Architecture

## 1. TECH STACK
- **Frontend Framework**: Next.js (App Router recommended for SEO & Performance)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Reusable UI System
- **Database**: Remote MySQL
- **ORM**: Prisma
- **Backend API**: Node.js / Next.js Server Actions / API Routes

## 2. PROJECT STRUCTURE
```text
BIC
│
├── PUBLIC WEBSITE
│   │
│   ├── /
│   ├── /about-us
│   ├── /services
│   ├── /services/[hierarchy]
│   ├── /projects
│   ├── /projects/[slug]
│   ├── /gallery
│   ├── /blog
│   ├── /blog/[slug]
│   ├── /shop
│   ├── /product/[slug]
│   └── /contact-us
│
├── ADMIN CMS
│   │
│   ├── /admin/login
│   ├── /admin
│   ├── /admin/homepage
│   ├── /admin/pages
│   ├── /admin/services
│   ├── /admin/projects
│   ├── /admin/gallery
│   ├── /admin/products
│   ├── /admin/blog
│   ├── /admin/media
│   ├── /admin/messages
│   ├── /admin/seo
│   ├── /admin/redirects
│   ├── /admin/users
│   └── /admin/settings
│
├── API / BACKEND
│
├── DATABASE (Prisma)
```

## 3. COMPONENT ARCHITECTURE
- **Global Components**: Header, Footer, Navigation, Breadcrumbs
- **Reusable Templates**: Service Detail Template, Project Detail Template, Blog Post Template
- **Dynamic Sections**: CMS-driven page sections (Hero, Content, Feature Grid, Gallery, Contact, etc.)

## 4. CONTENT / DESIGN SEPARATION
- Design is controlled by React components.
- Content is controlled by the database.
- React components must fetch typed data via API/Server Actions rather than hard-coding business content.

## 5. AUTHENTICATION & SECURITY
- Admin routes are protected.
- Secure password hashing, HTTP-only authentication cookies.
- Role-based access control (Admin vs Editor).
- API routes must validate session and inputs.

## 6. MEDIA ARCHITECTURE
- Images stored in controlled object storage / server file system.
- MySQL stores metadata (URL, alt text, dimensions).
- React components render optimized images via Next/Image.

## 7. DEPLOYMENT
- Must be deployable as an independent Next.js production app.
- Must not depend on Antigravity runtime, demo APIs, or temporary services.
