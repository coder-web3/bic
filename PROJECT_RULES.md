# Best International Contracting Company (BIC) - Project Rules

## 1. PRIMARY PROJECT OBJECTIVE
Completely redesign the visual frontend of the existing BIC website while preserving the existing business identity, content architecture, SEO structure, URLs, service hierarchy, products, blog structure, and existing business information. Powered by a custom CMS/Admin Dashboard.

## 2. NON-NEGOTIABLE RULES
**DO NOT CHANGE:**
- BIC logo, company name, brand identity
- Existing company information
- Existing service names, hierarchy
- Existing page hierarchy
- Existing SEO URLs, URL slugs, product URLs, blog URLs
- Existing content unless explicitly instructed
- Existing SEO-targeted pages

**DO NOT AUTOMATICALLY:**
- Rename URLs, change slugs, delete pages, merge pages
- Remove service detail pages, products, blog pages
- Replace content with invented content
- Invent statistics, clients, projects, certifications, locations, services, claims

## 3. DESIGN DIRECTION
- Premium Saudi Industrial Corporation, Engineering, Construction, Infrastructure, Industrial Supply.
- Modern, sophisticated, industrial, architectural, corporate, spacious, editorial, high-end, strong visual hierarchy, excellent whitespace.
- Use existing BIC logo exactly as provided.
- Use existing BIC red selectively (CTAs, active navigation, highlights, lines, small UI accents).
- Supporting colors: Deep Charcoal (#111111), Industrial Charcoal (#242424), Off White (#F7F7F5), White (#FFFFFF), Steel Gray (#8A8F94), Light Gray (#ECECEC).
- Typography: Professional modern sans-serif (e.g., Manrope / Inter). High-quality Arabic-compatible font for Arabic.

## 4. CONTENT PRESERVATION
- The existing BIC website content is authoritative.
- Never invent business claims, statistics, clients, projects, certifications, experience, locations, services, awards.
- If a design mockup uses placeholder text, replace it with actual BIC content from the CMS.

## 5. DESIGN-TO-CODE WORKFLOW
- Analyze design screenshots provided by user.
- Identify corresponding existing BIC content.
- Map content into the visual design.
- Build/reuse appropriate React components.
- Connect all editable fields to the CMS.
- Do not redesign the supplied section unless instructed. Do not simplify into generic cards or templates.

## 6. EXTERNAL DEPENDENCIES
- Do not use trial APIs, temporary APIs, expiring API keys, temporary URLs/storage/CDN.
- The website must not depend on an AI service or Antigravity runtime in production.
- Use stable, maintained, production-suitable dependencies.
- Images should be stored in controlled server/object storage, managed by the media library.

## 7. CODE QUALITY & ARCHITECTURE
- Next.js + React + TypeScript + Tailwind CSS.
- Prisma ORM + MySQL.
- Modular, reusable, type-safe, maintainable, documented, consistent code.
- No hard-coded CMS content in React components (unless it is static UI text).
- Validate all inputs, protect API routes, handle errors gracefully.

## 8. SECURITY & PERFORMANCE
- Secure admin authentication (role-based, hashed passwords, HTTP-only cookies).
- Environment variables must not be exposed to the client or committed to Git.
- Optimize images (WebP/AVIF), implement lazy loading, efficient DB queries.

## 9. SEO & STRUCTURE
- Preserve existing URLs. If a URL must change, create a permanent 301 redirect.
- Dynamic meta tags, semantic HTML, proper H1/H2/H3 hierarchy, XML sitemap, JSON-LD schema based on actual content.
