# UI Skill — Unified Design System & UI Architecture

## 1. Purpose of This File

This file defines the visual and UI architecture contract for the project and must be followed by all AI agents, developers, and designers working on the UI.

The primary goal is not simply to create beautiful pages. The goal is to make the **entire project feel like one coherent product**. Users should never feel that the Home page was designed by one person, the Product page by another, and the Dashboard by a third.

Core principle:

> **Consistency First — Reuse Before Create**
>
> Before creating any new UI, inspect and reuse the existing components, patterns, layouts, and tokens in the project.

The visual direction is for a professional architectural-stone store/platform. The overall feeling should combine:

- Luxury and architecture
- Professionalism and trust
- Minimalism and modern design
- Strong visual/material presentation
- Readability and usability for stone shopping and comparison

---

# 2. Project Visual References

## 2.1 Provided Visual Reference

The uploaded reference image is a modern dashboard UI with the following characteristics:

- Neutral, soft outer background
- White cards with soft corners
- Generous spacing and good visual breathing room
- Subtle borders instead of heavy shadows
- Simple and clear typography
- Independent but visually coordinated modules
- Clear hierarchy between title, description, value, and action
- Limited and purposeful use of accent color

This should inspire the project's **design system and visual consistency**, not be copied literally into a stone store.

## 2.2 Mirzaei Stone Website Reference

The website `https://mirzaeestone.com/` is used as a reference for the information architecture of a real stone store. It includes patterns such as search, stone categories, featured products, popular products, latest products, categories by type and color, applications, articles, and trust/value sections.

The website should be used for **information architecture and merchandising ideas**, not for direct visual, HTML, or CSS copying.

### What we can learn from this reference

- Fast product discovery
- Categorization by stone type
- Categorization by color
- Categorization by application/use case
- Featured / Popular products
- Latest products
- Educational content / knowledge base
- Benefits, trust, and credibility sections
- Strong use of product imagery

### What must NOT be copied

- HTML structure
- Exact CSS or spacing
- Typography as an exact replica
- The other brand's color identity
- Section-by-section layout without adapting it to this project's design system
- Duplicate components created only to imitate the reference site

---

# 3. Master Design Principle

All pages must use a **shared Design Language**.

Every new page must pass through these five layers before implementation:

1. Global Tokens
2. Layout System
3. Shared Components
4. Page Patterns
5. Page-specific Composition

Important rule:

> **Page-specific UI should be limited to composition and data; it should not introduce a new design language for each page.**

---

# 4. Existing Theme System

The project uses a `ThemeProvider` and `ThemeTokens`. All UI should use these tokens whenever possible. Do not scatter raw colors throughout components.

```ts
export type ThemeTokens = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  radius: string;
  fontSans: string;
  fontHeading: string;
};
```

## 4.1 Token Usage Rules

Do not use patterns like this in JSX/TSX:

```tsx
className="bg-[#123456]"
```

or:

```tsx
style={{ color: "#123456" }}
```

unless the value is truly data/media-specific and no semantic token exists for it.

Use theme tokens, CSS variables, or project abstractions instead.

Example:

```tsx
className="bg-background text-foreground border-border"
```

or use the project's semantic component abstractions when available.

## 4.2 Theme Must Be Tenant-Aware

Because the project is multi-tenant, the UI must not depend on a single fixed brand.

Each tenant should be able to change, without breaking layout or components:

- Primary color
- Secondary color
- Accent
- Background
- Text colors
- Border color
- Radius
- Sans font
- Heading font

Therefore:

> **Components must be theme-aware, not color-aware.**

A Button must not know whether the brand is blue or black. The Button only consumes the semantic `primary` token.

---

# 5. Visual Direction

## 5.1 Overall Feel

Target visual direction:

**Modern Architectural Commerce**

Meaning:

- Minimal, but not empty
- Luxurious, but not flashy
- Industrial, but not cold
- Visual, but not cluttered
- Professional, but not corporate-looking

## 5.2 Color

The base palette should be neutral-first:

- White / Off-white
- Warm gray
- Charcoal
- Stone gray
- Sand / Beige
- Metallic or earthy accent when appropriate

The tenant's brand identity should come primarily from `primary` and `accent`.

Color must never occupy the entire UI.

Rule of thumb:

- 70–85%: neutral surfaces/backgrounds
- 10–20%: typography/borders/media framing
- 5–10%: brand/accent/action

These are not hard limits. The goal is simply to avoid colorful, noisy, non-luxury UI.

## 5.3 Border Radius

Use one shared radius language.

Do not use different radius values randomly on different pages.

Suggested levels:

- `sm`: small controls
- `md`: inputs/buttons/cards
- `lg`: large cards/sections
- `xl`: hero/premium compositions

Actual values should come from the `radius` token and the project's shared scale.

---

# 6. Typography

Typography is one of the most important parts of project-wide consistency.

## Rules

- `fontSans` for text and UI
- `fontHeading` for headings
- Heading hierarchy must stay consistent across all pages
- Persian line-height must be handled properly
- Do not introduce arbitrary sizes such as 17px, 19px, or 23px without a clear reason
- Font weights must be semantic and consistent throughout the project

Suggested hierarchy:

- Display
- H1
- H2
- H3
- H4
- Body Large
- Body
- Body Small
- Caption
- Label

A page must not invent its own typography scale.

---

# 7. Spacing System

All layouts must use the same spacing scale.

For example:

```text
4 → 8 → 12 → 16 → 20 → 24 → 32 → 40 → 48 → 64 → 80 → 96
```

This is only a baseline. If the project already has an official spacing scale, that scale is the source of truth.

### Rule

Random spacing is not allowed.

Avoid patterns such as:

```text
17px here
27px there
33px somewhere else
```

If a new spacing value is repeatedly needed, convert it into a design token or component abstraction.

---

# 8. Container & Grid

All pages must use shared container behavior.

### Desktop

- Limited and readable content width
- Sufficient horizontal whitespace
- Consistent grid
- Consistent alignment between sections

### Tablet

- Reduce grid columns
- Reduce spacing where appropriate
- Compact controls

### Mobile

- Convert multi-column layouts to single-column layouts where needed
- Cards should become full-width or nearly full-width
- Important actions must remain thumb-friendly
- Complex tables should transform into cards/lists when necessary

Do not create a new container width for every page.

---

# 9. Layout Architecture

Pages should belong to one of these layout families:

### A. Public Store Layout

For:

- Home
- Products
- Categories
- Product detail
- Articles
- About
- Contact

Includes:

- Header
- Navigation
- Main container
- Optional breadcrumb
- Footer

### B. Listing Layout

For:

- Product listing
- Search results
- Category products

Pattern:

```text
Page Header
  ↓
Filters / Sort / Search
  ↓
Product Grid
  ↓
Pagination / Load More
```

### C. Detail Layout

For:

- Product detail
- Article detail
- Project detail

Pattern:

```text
Breadcrumb
↓
Primary content
↓
Supporting information
↓
Related content
```

### D. Dashboard Layout

For:

- Super Admin
- Tenant Admin / Factory Owner
- User account

The Dashboard should use the same visual language, but navigation and information density should be adapted to the role.

Dashboard must not become a completely separate visual product.

---

# 10. Header System

The Header is one of the project's most important visual anchors.

There should be a shared Header family.

Possible variants may include:

- `DefaultHeader`
- `TransparentHeader`
- `CompactHeader`
- `DashboardHeader`

All variants must still belong to the same design language.

### Desktop

- Brand / Logo
- Main navigation
- Search
- Category access
- Account
- Favorites
- Cart when ecommerce is enabled

### Mobile

- Logo
- Search or search trigger
- Menu
- Cart/account when needed

Do not rebuild the Header independently for each page.

---

# 11. Product Card System

Product Card is a core component of the project.

There should be **one Product Card family** with variants for different contexts.

Example:

```ts
type ProductCardVariant =
  | "default"
  | "compact"
  | "featured"
  | "horizontal"
  | "comparison";
```

A Product Card may include:

- Stone image
- Name
- Stone type
- Color
- Surface/finish when available
- Price
- Price unit
- Grade/sort when available
- Badge
- Availability
- Action

### Image Rule

Stone is a visual product, so the image must receive high priority.

However, images must not be cropped randomly across cards.

All Product Cards should use a shared aspect-ratio family.

---

# 12. Product Image Rules

Stone imagery should be, whenever possible:

- High quality
- Realistic
- Free from unnecessary UI noise
- Consistently cropped
- Zoom-friendly
- Visually consistent

For slab and tile products, media ratios may differ based on the actual asset type. The component should handle this difference instead of each page introducing custom image styling.

Use a shared image container system.

---

# 13. Product Detail Page

The Product Detail page should combine a professional catalog feeling with ecommerce usability.

Base pattern:

```text
Breadcrumb

Gallery                    Product Info
───────────────            ───────────────
Main Image                 Product Name
Thumbnails                 Category
Zoom                       Code
                           Price
                           Availability
                           Variants
                           CTA

────────────────────────────────────────
Technical / Commercial Information

────────────────────────────────────────
Description

────────────────────────────────────────
Applications / Specifications

────────────────────────────────────────
Related Products
```

Technical information may include:

- Stone type
- Color
- Quarry/origin
- Grade/sort
- Dimensions
- Thickness
- Finish/process
- Application
- Water absorption
- Density
- Strength
- Other relevant technical properties

The exact fields should depend on the product type and project data model.

---

# 14. Filters

Stone stores can have complex filtering requirements.

Potential filters include:

- Type
- Color
- Price
- Finish
- Thickness
- Size
- Application
- Origin/quarry
- Availability
- Grade/sort

Filters must use shared UI primitives.

Do not create a completely different filter experience on every category page.

Use one filter system with responsive variants.

Desktop may use a sidebar; mobile may use a drawer/sheet.

The underlying filter model should remain shared.

---

# 15. Buttons

Buttons are part of the design language.

Use semantic variants such as:

```text
Primary
Secondary
Outline
Ghost
Destructive
Link
```

Do not invent custom button styles for each feature.

The same semantic action should look the same throughout the product.

Example:

If the primary conversion action is `Add to Cart`, it should not look like a completely different button on another page.

---

# 16. Forms

Forms must use the shared form system.

Inputs, labels, descriptions, validation states, selects, comboboxes, switches, radios, checkboxes, and other controls should use the project's existing primitives/components.

Validation must visually distinguish:

- Default
- Focus
- Error
- Success when applicable
- Disabled
- Read-only

Do not create a one-off input style inside a page.

---

# 17. Cards

Cards must have semantic roles.

Do not use one generic card style for everything or create a new card style for every section.

Possible semantic card families:

- Product Card
- KPI Card
- Content Card
- Project Card
- Article Card
- Feature Card
- Settings Card
- Data Card

Each family may have variants, but related cards should share the same visual DNA.

---

# 18. Tables

Tables are mainly for dashboard/admin areas.

Use a shared table architecture with:

- Consistent header
- Row spacing
- Hover behavior
- Sorting
- Pagination
- Selection when needed
- Empty state
- Loading state
- Responsive fallback

On mobile, do not force a wide desktop table into an unusable layout. Use a card/list representation when appropriate.

---

# 19. Data Visualization

Dashboard charts must follow the same theme system.

Charts should consume theme colors or semantic chart tokens rather than hard-coded colors.

Charts should prioritize:

- Readability
- Clear labels
- Minimal visual noise
- Consistent legend behavior
- Consistent spacing

Do not make every dashboard page use a different chart style.

---

# 20. Navigation

Navigation patterns should remain consistent.

Public site may use:

- Header navigation
- Category navigation
- Breadcrumbs
- Footer navigation

Dashboard may use:

- Sidebar navigation
- Top navigation
- Breadcrumbs
- Section navigation

Even when the structure differs, active states, typography, spacing, icon treatment, and interaction behavior should remain within the same design language.

---

# 21. Search

Search is a first-class feature for a stone store.

The search experience should support:

- Product search
- Category search
- Search suggestions when appropriate
- Clear result states
- Loading state
- No-result state

Search UI must be consistent between:

- Header search
- Search page
- Mobile search
- Dashboard search where relevant

Do not create separate visual systems for each search context.

---

# 22. Category & Discovery UI

Stone discovery may happen through multiple dimensions:

```text
Stone Type
Color
Application
Finish
Price
Origin
```

The same category system should be reused across:

- Home
- Navigation
- Category pages
- Filters
- Search
- Product detail

A category badge on one page should not look like a completely different component elsewhere.

---

# 23. Tenant Branding

The same UI codebase may serve multiple stone businesses/tenants.

Therefore the UI must support visual personalization through theme tokens without breaking layout consistency.

Tenant customization may include:

- Logo
- Primary color
- Secondary color
- Accent color
- Fonts
- Border radius
- Background tone
- Other approved brand tokens

Tenant customization must **change identity, not design architecture**.

A tenant should feel branded without turning the project into a different design system.

---

# 24. Role-Based Dashboard UI

The project contains three major user levels:

```text
Super Admin
Tenant / Factory Owner
Customer / User
```

The data and actions can differ significantly, but the visual language must remain unified.

Examples:

Super Admin:
- tenant management
- platform statistics
- system settings

Tenant / Factory Owner:
- products
- inventory
- orders
- customers
- reports
- store settings

Customer / User:
- orders
- favorites
- profile
- addresses
- account settings

These are functional differences, not reasons to create three unrelated UI systems.

---

# 25. Section System

Large pages should be built from reusable sections.

Examples:

- HeroSection
- FeaturedProductsSection
- CategoryShowcaseSection
- ProductGridSection
- StatsSection
- BenefitsSection
- ArticlesSection
- TestimonialsSection
- ProjectShowcaseSection
- CTASection

Sections should accept content/data and use shared components.

Avoid embedding a completely custom component tree inside every page.

---

# 26. When to Create a New Component

A new component is justified only when one or more of these is true:

- The UI pattern is genuinely new
- The pattern will be reused
- Existing components cannot reasonably represent the requirement
- Extending an existing component would make it overly complex
- The component represents a meaningful domain concept

### Bad approach

```text
Need a card → create NewCard
Need another similar card → create AnotherCard
Need another slightly different card → create FinalCard
```

### Better approach

```text
ExistingCard
  ↓
Add variants/props
  ↓
Reuse
```

Or:

```text
Existing components
  ↓
Compose a new reusable domain component
```

### Golden Rule

> **Do not create a new component just because writing one is faster.**

Always inspect the codebase first.

---

# 27. Component Reuse Hierarchy

Every AI Agent must inspect these layers before coding:

```text
Design Tokens
    ↓
Primitives
    ↓
UI Components
    ↓
Composite Components
    ↓
Section Components
    ↓
Page Templates
    ↓
Pages
```

For example, a Product page should not directly assemble dozens of primitives with custom styles.

Prefer:

```text
ProductPage
  → ProductDetailLayout
      → ProductGallery
      → ProductInfo
          → Price
          → ProductMeta
          → CTA
      → ProductSpecifications
      → RelatedProducts
```

---

# 28. Before Building a New Page

An AI Agent must mentally run this checklist before implementing a new page:

- Does a similar page already exist in the project?
- Which Page Template can be reused?
- Which shared Header should be used?
- Which shared Footer should be used?
- Which section patterns already exist?
- Which existing Card can be reused?
- Is a new variant enough instead of a new component?
- Does typography and spacing follow the tokens?
- Does responsive behavior match other pages?

If these questions cannot be answered, inspect the repository before coding.

---

# 29. Prohibited UI Patterns

The following are prohibited unless there is a strong, documented reason:

### Forbidden

- Random colors
- Random shadows
- Random border radii
- Random font families
- Mixing multiple icon libraries within one feature
- Different buttons for the same semantic action
- Different cards for the same type of data
- Different container widths without a real need
- Custom heading scales for one page
- Rebuilding Header/Footer
- Copying components with only minor changes
- Excessive inline styles
- CSS magic numbers
- Using multiple design systems on the same page

---

# 30. Icons

Use the project's selected primary icon library as the default (for example, Lucide if that is part of the project stack).

Avoid mixing:

```text
Lucide + Heroicons + Font Awesome + random SVGs
```

unless a custom brand/product icon is genuinely required.

Use one icon family consistently for similar actions.

---

# 31. Shadows

Shadows must be subtle and semantic.

For a premium stone store, surface and contrast matter more than heavy shadows.

Priority:

```text
Border → Surface contrast → Subtle shadow
```

not:

```text
Heavy shadow everywhere
```

---

# 32. Interaction & Motion

Animation should be subtle.

Appropriate examples:

- Very limited image hover zoom
- Short fade/slide transitions
- Dropdown transitions
- Drawer transitions
- Skeleton shimmer
- Modal transitions

Avoid highly decorative motion that makes the stone store feel like a gaming or SaaS website.

All motion should be:

- Short
- Predictable
- Easy to understand
- Respectful of `prefers-reduced-motion`

---

# 33. Responsive Design

Responsive behavior must not be added at the end of development.

Every component should be designed with these states in mind:

```text
Mobile
Tablet
Desktop
Large Desktop
```

At breakpoints, prioritize structural changes over random font resizing:

- Number of columns
- Spacing
- Visibility
- Layout direction
- Density

---

# 34. RTL & Persian UI

The project must be RTL-first.

Always verify:

- Alignment
- Icon placement
- Breadcrumbs
- Pagination
- Arrows
- Carousels
- Numeric values
- Price formatting
- Tables
- Mixed Persian/English text

Do not simply add `direction: rtl` and assume the UI is correct.

Components must be RTL-aware from the start.

---

# 35. Accessibility

Beautiful UI without accessibility is not acceptable.

At minimum:

- Semantic HTML
- Keyboard navigation
- Visible focus
- Accessible labels
- Sufficient contrast
- Alt text
- Correct button semantics
- Form error association
- Modal focus management
- ARIA only when actually needed

Do not remove or hide keyboard focus with custom styling.

---

# 36. Content Rules

UI copy must also be consistent.

Use the same labels for the same actions.

For example, do not use:

```text
View Product
```

in one place and:

```text
Explore More
```

elsewhere for the exact same semantic action unless there is a genuine difference in meaning.

The project's content/copy dictionary should gradually become standardized.

---

# 37. Page Composition Rules

Pages must not be constructed as a random collection of cards.

Every page needs hierarchy:

```text
1. Context
2. Primary message
3. Primary action
4. Main content
5. Supporting content
6. Secondary action
```

For storefront pages:

```text
Discovery → Trust → Products → Details → Conversion
```

For dashboard pages:

```text
Context → Summary → Action → Data → Secondary information
```

---

# 38. Home Page Architecture

The Home page can follow a structure such as:

```text
Header
↓
Hero / Search
↓
Featured Categories
↓
Featured Products
↓
Browse By Type
↓
Browse By Color
↓
Promotional / Trust Block
↓
Latest Products
↓
Applications / Use Cases
↓
Projects / Social Proof
↓
Articles / Knowledge
↓
CTA
↓
Footer
```

This order is not mandatory. The important requirement is clear hierarchy.

The Home page must not become a collection of unrelated sections with different visual systems.

---

# 39. Product Listing Architecture

```text
Header
↓
Breadcrumb
↓
Category / Search Header
↓
Toolbar
  ├── Result count
  ├── Sort
  └── Filter trigger
↓
Main Content
  ├── Filter Sidebar
  └── Product Grid
↓
Pagination
↓
Related / SEO Content
↓
Footer
```

---

# 40. Dashboard Page Architecture

```text
DashboardShell
↓
PageHeader
↓
Summary / KPI
↓
Primary Data
↓
Charts / Activity
↓
Tables
↓
Secondary Actions
```

Every dashboard page should follow this language.

---

# 41. Error / Empty / Loading Architecture

Every feature must define these three states from the beginning.

### Loading

Use a shared Skeleton system and preserve the layout of the final UI as much as possible.

### Empty

Use a shared EmptyState with:

- icon/image
- title
- description
- optional CTA

### Error

Use a shared ErrorState with:

- title
- explanation
- retry action

These should not be rebuilt from scratch for every feature.

---

# 42. Image & Media Direction

For a stone store, imagery is a major part of the brand.

Image usage should feel more like an architectural material catalog than a generic ecommerce marketplace.

### Image priorities

1. Real product image
2. Close-up texture
3. Installed/application image
4. Project image
5. Decorative image

Do not use irrelevant stock images simply to fill empty space.

---

# 43. Premium / Luxury Sections

Premium stones may have special showcase sections, but these sections must still use the shared system.

For example:

```text
PremiumStoneShowcase
```

may have a distinctive composition, but it must still consume:

- Theme tokens
- Typography tokens
- Button system
- Spacing system
- Image system

---

# 44. Code Architecture Rules for UI Agents

Agents should not write an entire page UI inside one oversized file.

When reasonable, follow a structure close to:

```text
features/
  products/
    components/
    sections/
    hooks/
    schemas/
    types/

components/
  ui/
  layout/
  commerce/
```

The actual project architecture remains the source of truth. This file does not replace an existing architecture.

---

# 45. Agent Workflow

Every AI Agent working on UI should follow this process:

### Step 1 — Inspect

First inspect the repository.

Find files, components, tokens, layouts, and similar pages.

### Step 2 — Reuse

Use existing components.

### Step 3 — Extend

If the difference requires a variant, extend the existing component.

### Step 4 — Compose

Combine existing components into the new feature.

### Step 5 — Create

Only when no reasonable reusable solution exists, create a new component.

### Step 6 — Validate

Review the result for:

- Visual consistency
- Responsive behavior
- RTL
- Accessibility
- Loading/error/empty states
- Theme compatibility

---

# 46. Most Important Rule for AI Agents

**No page should be designed as an isolated piece.**

Before implementation, the following question must have a clear answer:

> “Which existing components and patterns does this page reuse?”

If the answer is unclear, inspect the codebase before coding.

---

# 47. How to Detect a UI That Does Not Belong to the Project

If a page contains any of the following, consistency may be broken:

- A card with a different radius
- A button with a different height
- Different typography
- A much stronger/weaker shadow system
- Unusual spacing
- A different Header
- A different icon family
- A color outside the ThemeTokens
- A different container width
- A different shape or treatment for empty/loading/error states

The agent must fix these inconsistencies before delivery.

---

# 48. UI Definition of Done

A UI is considered complete only when it:

- Follows the shared design system
- Uses theme tokens
- Reuses existing components where possible
- Is responsive
- Correctly supports RTL
- Includes loading/empty/error states where applicable
- Meets basic accessibility requirements
- Does not break when used with another tenant theme
- Contains no random styles
- Does not introduce duplicate components without justification

---

# 49. Final Component Creation Rule

The priority order is always:

```text
Reuse an existing component
        ↓
Modify / extend an existing component
        ↓
Compose existing components
        ↓
Create a new reusable component
        ↓
Create a page-specific component (only when unavoidable)
```

**No AI Agent should create a new component just because it is faster.**

Use previously created components as much as possible. If they are not sufficient, modify them, extend them with variants/props, or compose them into a stronger reusable abstraction. Only create a new component when there is genuinely no reasonable way to reuse or extend the existing system.

---

# 50. Reference Notes

This skill uses two primary references for the UI direction:

1. The visual reference image provided by the user: used to understand hierarchy, whitespace, cards, visual order, and modular UI.
2. `https://mirzaeestone.com/`: used to study the structure of a real stone store and patterns for product discovery, category discovery, products, applications, and content.

These references are **references, not templates to copy**.

---

# FINAL RULE

> **One Project, One Design Language, One Component Language, One Theme System.**
>
> Every page must feel like a member of the same system.
>
> **Reuse → Extend → Compose → Create**
>
> Before building anything new, find what has already been built.
