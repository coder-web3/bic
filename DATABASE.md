# Database Schema Architecture

## Database: MySQL
## ORM: Prisma

The database uses hierarchical relationships and normalized tables to maintain a structured CMS.

## CORE TABLES
- `users`: Admin credentials (hashed passwords), roles.
- `site_settings`: Global configurations (Logo, Contact details, Social links, Default SEO).
- `navigation`: Dynamic header and footer links.

## PAGES & SECTIONS
- `pages`: Title, slug, SEO metadata, status.
- `page_sections`: Ordered layout items per page, visibility status.
- `section_items`: Content pieces (headings, images, text blocks, buttons) mapped to sections.

## SERVICES (Hierarchical)
- `service_categories`: Parent categories (e.g., Contracting Services).
- `services`: Detailed services (e.g., Civil Works). Support self-relations for nesting (e.g., Building Works under Civil Works).
- `service_faqs`: FAQs specific to a service.
- `service_images`: Relationships to Media for service galleries.

## PROJECTS
- `projects`: Title, slug, description, category, completion date.
- `project_images`: Gallery relation.

## MEDIA LIBRARY
- `media`: Centralized storage metadata.
  - Media ID, Filename, Path, URL, Alt Text, Title, Caption, Mime Type, Dimensions, Size.

## GALLERY
- `gallery_categories`: Filters for the gallery page.
- `gallery_images`: Image references with display order.

## BLOG & PRODUCTS (WooCommerce Migration)
- `blog_posts`, `blog_categories`, `blog_tags`.
- `products`, `product_categories`, `product_images`.

## CONTACT & SEO
- `contact_submissions`: Enquiries from the frontend form.
- `seo_metadata`: Overrides for specific URLs/Entities.
- `redirects`: URL redirection management (Old URL, New URL, Status 301, Active).
