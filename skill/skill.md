# Stone Commerce Multi-Tenant — Agent Skill

## 1. Mission

Build a production-grade, multi-tenant stone e-commerce platform with three primary roles:

1. **Super Admin** — creates and manages tenants and the platform.
2. **Tenant Manager / Factory Manager** — manages one tenant's storefront, catalog, inventory, orders, content, SEO, and visual identity.
3. **Customer** — browses a tenant storefront, searches/filters stones, manages cart, checkout, orders, account, wishlist, and reviews.

Each tenant must be able to independently manage its:
- domain/subdomain
- logo and favicon
- colors
- fonts and typography
- spacing/radius/shadows
- header/footer
- navigation
- homepage sections
- product-card presentation
- pages/content
- SEO metadata
- products, inventory, pricing, orders and customers

The architecture is **Feature-First**.

---

# 2. NON-NEGOTIABLE AGENT RULES

## Rule 1 — Reuse Before Creating (Highest Priority)

**NEVER write a component from zero when an existing project component can be reused, composed, configured, or extended.**

Before creating any new component, the agent MUST:

1. Search the repository.
2. Search the current feature.
3. Search `components/ui`.
4. Search shared components.
5. Search existing hooks.
6. Search existing stores.
7. Search existing schemas.
8. Search existing query/action patterns.
9. Search existing layouts and design primitives.
10. Reuse first; create only when there is genuinely no suitable implementation.

Preferred order:

`existing component → composition → configuration → extension → new component`

Examples:

- Existing `DataTable` → reuse it for products, orders, customers, tenants.
- Existing `FormField` → reuse it across product, tenant, category and settings forms.
- Existing `Dialog` → do not create another modal implementation.
- Existing `ProductCard` → configure/extend it instead of creating `FeaturedProductCard`, `LatestProductCard`, `PopularProductCard`, etc.
- Existing `SectionHeader` → reuse it throughout the storefront.
- Existing filter controls → compose them rather than inventing another filter system.

### Mandatory agent question before new UI

> "What already exists that I can reuse?"

If the answer is unknown, the agent must inspect the codebase before coding.

## Rule 2 — Inspect Before Coding

Do not assume a feature does not exist.
Inspect:
- repository structure
- related features
- shared components
- design tokens
- existing data-access patterns
- forms and validation
- responsive behavior
- loading/empty/error states

## Rule 3 — No Unnecessary Dependencies

Before installing a package, verify whether the current stack already solves the problem.

Prefer existing project capabilities and libraries over adding packages.

## Rule 4 — Feature-First

Business functionality belongs inside its feature.

Good:

`features/products/components/product-card.tsx`

Bad:

`components/products/product-card.tsx`

unless the component is genuinely generic and belongs in the shared design system.

## Rule 5 — Keep `app/` Thin

`app/` is primarily for:
- routing
- layouts
- route-level composition
- metadata
- loading/error/not-found boundaries
- providers

Business logic should live in `features/` or `lib/`.

## Rule 6 — Server by Default

Use Next.js Server Components by default.
Use Client Components only where interactivity, browser APIs, local client state, or third-party client-only libraries require them.

Never add `"use client"` to an entire route without a concrete reason.

## Rule 7 — Security Is Server-Side

Never trust client-provided:
- `tenantId`
- role
- permissions
- price
- inventory
- authorization decisions

Tenant isolation and authorization MUST be enforced server-side.

---

# 3. Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Client State | Zustand |
| Server State | TanStack Query |
| Forms | React Hook Form |
| Validation | Zod |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js / established auth system |
| Authorization | RBAC + Permission System |
| File/Image | Cloudinary / S3-compatible storage |
| Icons | Lucide |
| Tables | TanStack Table |
| Charts | Recharts |
| Drag & Drop | dnd-kit |
| Rich Text | Tiptap |
| Date | date-fns |
| URL State | nuqs |
| Notifications | Sonner |
| Error Monitoring | Sentry |
| Analytics | PostHog |
| Unit Tests | Vitest |
| E2E Tests | Playwright |
| Git | GitHub |
| Deployment | Vercel / VPS / cloud |

Do not replace these tools casually. Any change must have a concrete architectural reason.

---

# 4. Feature-First Architecture

Recommended structure:

```text
src/
├── app/
│   ├── (platform)/
│   │   └── admin/
│   ├── (manager)/
│   │   └── dashboard/
│   ├── (storefront)/
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
│
├── features/
│   ├── auth/
│   ├── tenants/
│   ├── users/
│   ├── permissions/
│   ├── products/
│   ├── categories/
│   ├── attributes/
│   ├── inventory/
│   ├── orders/
│   ├── customers/
│   ├── cart/
│   ├── checkout/
│   ├── payments/
│   ├── discounts/
│   ├── reviews/
│   ├── media/
│   ├── theme/
│   ├── pages/
│   ├── navigation/
│   ├── seo/
│   └── analytics/
│
├── components/
│   ├── ui/
│   ├── data-table/
│   ├── forms/
│   └── layouts/
│
├── lib/
│   ├── auth/
│   ├── tenant/
│   ├── permissions/
│   ├── db/
│   ├── storage/
│   ├── validation/
│   ├── cache/
│   └── utils/
│
├── providers/
├── hooks/
├── stores/
├── config/
├── types/
└── constants/
```

A feature may contain:

```text
feature/
├── components/
├── hooks/
├── actions/
├── queries/
├── schemas/
├── stores/
├── types/
├── constants/
└── index.ts
```

Do not create every folder mechanically. Create only the folders actually needed.

---

# 5. `app/` Must Be Thin

A route should look approximately like:

```tsx
import { ProductPage } from '@/features/products';

export default function Page() {
  return <ProductPage />;
}
```

Avoid giant route files containing:
- business rules
- large forms
- database queries
- repeated UI
- authorization logic
- domain calculations

---

# 6. Feature Public API

Substantial features should expose a controlled public API through `index.ts`.

Prefer:

```ts
import { ProductCard, ProductTable } from '@/features/products';
```

over:

```ts
import { ProductCard } from '@/features/products/components/product-card';
```

Keep implementation details internal where practical.

---

# 7. Core Domain Features

## Auth

Responsibilities:
- login
- logout
- registration where required
- session management
- password/account flows
- session validation

Authentication and authorization are separate concerns.

## Tenants

Responsibilities:
- create tenant
- edit tenant
- tenant status
- assign tenant managers
- domains/subdomains
- settings
- metadata

## Tenant Resolution

`lib/tenant` contains infrastructure for resolving the current tenant:

```text
hostname
  ↓
tenant resolver
  ↓
tenant context
  ↓
tenant ID
```

Never identify the current storefront using an untrusted browser-supplied tenant ID.

## Permissions

Use:

```text
Role
  ↓
Permissions
  ↓
Tenant Scope
```

Examples:

```text
product.read
product.create
product.update
product.delete

order.read
order.update

theme.read
theme.update
```

---

# 8. Stone Product Domain

A stone product is not a generic product with only `name`, `price`, and `image`.

Potential attributes include:
- stone type
- quarry/origin
- color
- grade/sort
- finish
- thickness
- dimensions
- slab/tile/form
- application
- surface
- pattern
- vein direction
- availability
- batch
- export status
- pricing unit
- inventory unit
- images
- videos
- technical specifications

Use an extensible attribute/variant model instead of a huge fixed product table.

Suggested domain:

```text
Product
├── ProductVariant
├── ProductAttribute
├── ProductImage
├── Category
├── Collection
├── Inventory
└── Pricing
```

Agents must preserve this domain flexibility when implementing product UI.

---

# 9. Theme System

Theme is a first-class feature.

Each tenant can manage:
- primary/secondary colors
- background/foreground
- typography
- fonts
- headings
- body text
- border radius
- shadows
- buttons
- cards
- header
- footer
- product cards
- spacing
- storefront sections

Use CSS variables/design tokens.

Do NOT create separate React component implementations for every tenant.

Preferred model:

```text
same components
+
tenant design tokens
=
different storefront appearance
```

The Theme Editor should support live preview where practical.

---

# 10. Visual Design Direction

The storefront should feel like a **premium natural-stone brand**.

Reference websites provided by the project owner:
- https://mirzaeestone.com/
- https://www.intmarble.com/

Use these as references for:
- premium stone-commerce presentation
- large material photography
- architectural/elegant composition
- product/collection storytelling
- strong whitespace
- high-quality product grids
- technical/product information
- project/showroom positioning

Do NOT copy their:
- exact layout
- exact text
- branding
- logos
- proprietary images
- proprietary assets
- exact visual identity

Extract principles and build an original design system.

## Desired visual language

- premium
- elegant
- architectural
- editorial
- image-led
- spacious
- strong typography
- restrained palette
- subtle motion
- excellent hierarchy
- excellent whitespace
- excellent responsive behavior

Avoid:
- generic SaaS-looking storefronts
- excessive gradients
- excessive rounded cards
- childish colors
- visual clutter
- too many borders
- unnecessary animation
- template-looking UI

The UI should visually communicate:
- material
- texture
- luxury
- architecture
- natural variation
- craftsmanship

---

# 11. Storefront Components

Always inspect existing components before creating a new one.

Potential reusable primitives:

```text
Header
MobileHeader
Footer
AnnouncementBar
Hero
SectionHeader
ProductCard
ProductGrid
ProductCarousel
CategoryCard
CategoryGrid
CollectionCard
FilterPanel
SearchBox
Breadcrumbs
PriceDisplay
Rating
ProductGallery
ProductSpecs
ProductAttributes
CTASection
Testimonials
ProjectShowcase
BlogCard
Newsletter
TrustBar
```

Design these for composition and configuration.

### Project Convention — Dividing Sections with the `Section` Component

Storefront sections MUST be divided using the reusable **`Section`** component
(`src/features/storefront/components/section.tsx`, exported from
`@/features/storefront`).

```tsx
<Section
  eyebrow="دسته بندی سنگ ها"
  title="دسته بندی بر اساس نوع"
  description="متن توضیحی اختیاری"
  action={<SliderArrows onPrev={...} onNext={...} />}
>
  {/* section content */}
</Section>
```

Rules:
- Do NOT hand-write section headers inline in pages; always compose with `Section`.
- `Section` provides the compact editorial header row: eyebrow + title (+ optional
  description) on the start side, and an optional `action` slot (navigation arrows,
  "view all" link, etc.) on the end side.
- For carousels/sliders, put prev/next controls in the `action` slot using the
  reusable `SliderArrows` component, and drive the slider through its imperative
  ref handle (see `CategorySliderHandle`).
- Persian text must not use letter-spacing (`tracking-*`) — it breaks Persian
  letter connections.
- Composed, ready-to-use sections (e.g., `CategoriesShowcase`) live in the
  storefront feature and accept data via props so they can be reused on any page.

Do not create separate components such as:

```text
FeaturedProductCard
PopularProductCard
LatestProductCard
RecommendedProductCard
```

when a configurable `ProductCard` can support them.

Example:

```tsx
<ProductCard
  variant="featured"
  showRating
  showPrice
/>
```

---

# 12. Product Listing Experience

Support:
- responsive grid
- sorting
- filtering
- URL-persisted filters
- search
- category
- stone type
- color
- finish
- form
- application
- price
- availability
- attributes

Use `nuqs` for URL state when appropriate.

Example:

```text
/stones/travertine?color=cream&finish=polished&form=slab
```

Filters should be shareable and bookmarkable.

---

# 13. Product Detail Experience

Product pages should prioritize visual material discovery.

Potential sections:

```text
Product Gallery
Product Name
Price / Inquiry
Availability
Key Attributes
Specifications
Applications
Finishes
Dimensions
Technical Information
Description
Downloads
Related Products
Similar Stones
Reviews
Project Inspiration
```

Use high-quality imagery and intentional information hierarchy.

Do not make product pages look like generic default e-commerce templates.

---

# 14. Image Rules

Stone is a highly visual category.

Images must:
- preserve quality
- be responsive
- avoid unnecessary layout shift
- support galleries
- use optimized delivery
- include meaningful alt text
- support zoom where useful

Use object storage/CDN for media and Next.js image optimization where appropriate.

Never store production media in the Git repository or local application filesystem.

---

# 15. Manager Dashboard

Manager UI can be more data-dense than storefront UI.

Use:
- shadcn/ui
- TanStack Table
- forms
- filters
- charts
- drawers/dialogs
- command/search patterns
- responsive layouts

Main areas:

```text
Dashboard
Products
Categories
Attributes
Inventory
Orders
Customers
Discounts
Reviews
Media
Pages
Navigation
Theme
SEO
Settings
```

Reuse dashboard primitives aggressively.

---

# 16. Super Admin

Super Admin manages:

```text
Overview
Tenants
Create Tenant
Tenant Details
Tenant Managers
Tenant Status
Domains
Platform Users
Billing/Plans if introduced
Platform Settings
Audit Logs
System Monitoring
```

Avoid duplicating Manager implementations unnecessarily.

---

# 17. State Management

## Zustand

Use for client state such as:
- cart UI
- filter UI
- theme-editor draft
- modal state
- sidebar state
- temporary page-builder state

Do not store all database entities globally in Zustand.

## TanStack Query

Use for interactive client-side server state when it is actually needed.

Do not automatically convert every server read to React Query.

Prefer Server Components/server-side fetching for initial storefront rendering.

---

# 18. Forms

Use:

```text
React Hook Form
+
Zod
```

Important forms need:
- schema
- client validation
- server validation
- accessible errors
- loading state
- success/error feedback

Never rely only on client validation.

---

# 19. Server Actions / Route Handlers

Preferred read path:

```text
Server Component
    ↓
query/service
    ↓
database
```

Preferred mutation path:

```text
Form
 ↓
Server Action
 ↓
Zod validation
 ↓
Authorization
 ↓
Service
 ↓
Database
```

Use Route Handlers only when an actual HTTP API boundary is required.

Do not duplicate business logic between Server Actions and API routes.

---

# 20. Dependency Direction

Preferred direction:

```text
app
 ↓
features
 ↓
lib
 ↓
external services
```

Shared generic components may be consumed by features.

Avoid:

```text
lib → features
```

Avoid uncontrolled feature-to-feature circular dependencies.

A feature may depend on another feature only when there is a real domain dependency.

---

# 21. Performance

Always consider:
- Server Components
- streaming
- loading boundaries
- image optimization
- lazy loading
- dynamic imports where appropriate
- caching/revalidation
- CDN
- minimizing client JavaScript
- avoiding unnecessary global state

Do not optimize blindly. Measure when possible.

---

# 22. Accessibility

Components should consider:
- keyboard navigation
- focus management
- semantic HTML
- accessible labels
- accessible dialogs
- contrast
- reduced motion
- screen readers
- RTL behavior

Accessibility is part of implementation.

---

# 23. Responsive Design

Design mobile-first.

Every feature must work intentionally at:

```text
mobile
tablet
desktop
large desktop
```

Do not merely shrink desktop layouts.

Navigation, filters, galleries, cards, tables, checkout, and forms need intentional mobile behavior.

---

# 24. RTL / Persian

The storefront must support RTL.

Consider:
- RTL layout
- Persian typography
- Persian/English mixed product names
- Latin technical specifications
- phone numbers
- currency formatting
- bidirectional text
- directional icons

Do not hard-code directional assumptions.

---

# 25. Reuse Checklist

Before writing a new component:

```text
[ ] Search components/ui
[ ] Search components/
[ ] Search the current feature
[ ] Search neighboring features
[ ] Search existing hooks
[ ] Search existing stores
[ ] Search existing schemas
[ ] Search existing utilities
[ ] Search existing layouts
[ ] Search existing table/form primitives
```

If an existing implementation is mostly suitable, adapt/combine it instead of duplicating it.

---

# 26. UI Quality Gate

Before considering UI work complete:

```text
[ ] Is hierarchy obvious?
[ ] Is spacing consistent?
[ ] Is typography consistent?
[ ] Does it feel premium?
[ ] Is product imagery prominent?
[ ] Does it work on mobile?
[ ] Does RTL work?
[ ] Are loading/error/empty states handled?
[ ] Is keyboard accessibility acceptable?
[ ] Was existing UI reused?
[ ] Was duplicate UI avoided?
```

---

# 27. Data States

Every data-driven feature should consider:

```text
loading
success
empty
error
permission denied
not found
```

Never leave blank screens.
Use reusable state components where practical.

---

# 28. Testing

## Vitest

Use for:
- schemas
- utilities
- calculations
- formatting
- permission helpers
- business logic

## Playwright

Use for critical flows such as:

```text
Super Admin creates tenant
Manager logs in
Manager creates product
Customer visits storefront
Customer searches product
Customer filters products
Customer opens product
Customer adds to cart
Customer checks out
Manager sees order
```

---

# 29. Security

Verify:

```text
[ ] Tenant isolation
[ ] Server-side authorization
[ ] Permission checks
[ ] Input validation
[ ] File upload validation
[ ] Rich-text/content sanitization
[ ] Rate limiting where appropriate
[ ] Secure session handling
[ ] No secrets in client bundle
[ ] No database credentials client-side
[ ] No trust in client prices
[ ] No trust in client tenantId
```

---

# 30. Agent Workflow

Every agent must follow this sequence.

## Step 1 — Understand

Identify:
- feature
- user role
- tenant scope
- affected route(s)
- dependencies

## Step 2 — Inspect

Search the repository for:
- existing components
- existing implementations
- existing patterns
- schemas
- queries/actions
- state patterns
- design tokens

## Step 3 — Reuse

Choose existing components/primitives before creating anything.

## Step 4 — Plan

Determine:
- files to modify
- files that genuinely need creation
- data flow
- state requirements
- validation
- permissions

## Step 5 — Implement

Implement the smallest coherent change.

## Step 6 — Verify

Check:
- TypeScript
- lint
- tests
- responsive behavior
- RTL
- accessibility
- tenant isolation where relevant

## Step 7 — Refactor

Remove duplication introduced by the implementation.

---

# 31. Agent Anti-Patterns

Agents MUST NOT:

- rewrite existing components unnecessarily
- create duplicate buttons/forms/tables
- create a new library for a problem already solved
- put all business logic in `components/`
- put everything in `utils/`
- put all state in Zustand
- turn every component into a Client Component
- fetch every server read through a client API
- trust client-provided tenant IDs
- duplicate business logic
- copy reference websites
- ship generic/template-looking storefront UI
- ignore mobile
- ignore RTL
- ignore loading/error/empty states
- create giant page components
- create giant unmaintainable feature files

---

# 32. Definition of Done

A task is complete when:

```text
[ ] Correct feature location
[ ] Existing code reused where possible
[ ] No unnecessary dependency
[ ] TypeScript passes
[ ] Validation exists where needed
[ ] Authorization exists where needed
[ ] Tenant scope is correct
[ ] Responsive
[ ] RTL-compatible
[ ] Accessible
[ ] Loading state
[ ] Error state
[ ] Empty state
[ ] Appropriate tests
[ ] Visual quality matches the premium stone-commerce direction
```

---

# 33. Final Principle

The project should evolve like a product platform, not a collection of pages.

Think:

```text
Design System
      ↓
Reusable Primitives
      ↓
Features
      ↓
Role-specific Experiences
      ↓
Tenant-specific Theme
      ↓
Storefront
```

The goal is not to write the most code.

The goal is to write the **smallest amount of new code necessary**, by intelligently reusing what already exists while keeping the system clean, scalable, visually premium, accessible, responsive, secure, and genuinely multi-tenant.
