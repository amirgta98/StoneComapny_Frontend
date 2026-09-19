---
name: frontend-ui-ux
description: >-
  Authoritative skill for modern frontend development and high-end UI/UX design.
  Use this skill whenever building, refactoring, or styling user interfaces, components,
  layouts, design tokens, animations, responsive screens, or Persian RTL typography.
  Ensures every UI has stunning visual aesthetics, tactile micro-interactions,
  and avoids generic template looks.
---

# Frontend & UI/UX Design System Mastery

This skill provides comprehensive instructions, standards, and patterns for creating world-class, visually stunning, and responsive user interfaces. It enforces high aesthetic standards, micro-interactions, ergonomic UX, and accessibility across all frontend work.

---

## 1. Core Visual Philosophy: The "Anti-Generic" Standard

Generic UI looks like standard Bootstrap, boilerplate Tailwind, or uninspired SaaS templates:
- Flat gray borders around every box
- Plain saturated blue or purple gradients
- Monotonous cards with no elevation or surface hierarchy
- Rigid, lifeless interactions with no tactile feedback
- Jagged layout shifts and clunky loading spinners

### The High-End Alternative:
1. **Architectural Restraint**: Curated, harmonious palettes (e.g. warm stone, sand, obsidian, subtle warm grays, rich brass/gold accents) over loud saturated colors.
2. **Surface & Depth Hierarchy**: Use distinct layers of depth rather than plain border outlines.
   - Base canvas: e.g. `#faf9f7` or `#0c0a09`
   - Surface/Card: Subtle tonal difference with soft dual-layer ambient shadows
   - Floating Popover/Dialog: Elevated with backdrop blur (`backdrop-blur-md bg-white/90`) and fine rim lighting (`border border-white/20 dark:border-white/10`)
3. **Tactile Micro-Interactions**: Every clickable element must respond immediately to hover, active press, and focus states.
4. **Generous White Space**: Let elements breathe. Luxury and quality are communicated through whitespace and editorial composition.

---

## 2. Design Tokens & Color Engineering

### The 60-30-10 Balance Rule
- **60% Dominant Base**: Neutral canvas and surfaces (`background`, `card`, `muted`).
- **30% Secondary Structure**: Typography, subtle borders, secondary buttons, structural dividers.
- **10% Intentional Accent**: Primary call-to-actions, badges, active indicators, brand highlight moments.

### Surface Elevation & Dual-Layer Shadows
Never use standard single-layer harsh shadows. Compose dual-layer shadows for realistic ambient lighting:
```css
/* Premium subtle card shadow */
box-shadow: 
  0 1px 2px 0 rgba(0, 0, 0, 0.03),
  0 4px 12px 0 rgba(0, 0, 0, 0.05);

/* Elevated floating element shadow */
box-shadow: 
  0 4px 6px -1px rgba(0, 0, 0, 0.05),
  0 20px 25px -5px rgba(0, 0, 0, 0.08);
```

### Borders as "Rim Lights"
Instead of heavy dark borders, use translucent hairline borders:
- Light mode: `border border-stone-200/80` or `border-black/[0.06]`
- Dark mode: `border border-white/[0.08]` or `border-stone-800`

---

## 3. Typography & RTL Mastery (Crucial for Persian / Bilingual UI)

### Persian Typography Rules
1. **CRITICAL: NEVER use `tracking-*` / `letter-spacing` on Persian or Arabic text.**
   - In Persian, letters connect cursively. Letter-spacing breaks ligatures and ruins rendering.
   - If a class like `tracking-wider` or `tracking-tight` is applied to a container, explicitly override it on Persian elements with `tracking-normal`.
2. **Font Hierarchy**:
   - Use `font-sans` with primary Persian font (e.g. `Vazirmatn`, `Dana`) paired with clean fallback system fonts.
   - Set comfortable line-height for Persian: Persian text requires slightly taller `leading` than Latin script (e.g., `leading-relaxed` or `leading-[1.8]` for body text).

### Bidirectional (LTR / RTL) Layout Rules
Always use CSS logical properties or Tailwind logical utilities:
- Use `start` and `end` instead of `left` and `right`:
  - `ms-` (margin-inline-start) instead of `ml-`
  - `me-` (margin-inline-end) instead of `mr-`
  - `ps-` (padding-inline-start) instead of `pl-`
  - `pe-` (padding-inline-end) instead of `pr-`
  - `text-start` instead of `text-left`
  - `text-end` instead of `text-right`
- Directional icons:
  - Arrows (chevron, arrow-right/left) must mirror in RTL: `rtl:rotate-180`.
  - Non-directional icons (phone, search, close, cart) must NOT rotate.

---

## 4. Motion, Physics & Micro-Interactions

### The 3 Timing Tiers
1. **Micro (100ms – 150ms)**: Button presses, badge toggles, icon hover shifts. Use snappy ease-out (`transition-all duration-150 ease-out`).
2. **Medium (200ms – 350ms)**: Dropdowns, tooltips, dialog reveals, tab switching, card hover lifts.
3. **Macro (400ms – 700ms)**: Page transitions, modal backdrop fades, hero scroll animations.

### Essential Micro-Interaction Recipes

#### Tactile Button Press
```tsx
<button className="relative inline-flex items-center justify-center font-medium rounded-lg px-5 py-2.5 
  bg-primary text-primary-foreground shadow-sm 
  hover:brightness-105 hover:shadow-md 
  active:scale-[0.98] active:brightness-95 
  transition-all duration-150 ease-out 
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  {children}
</button>
```

#### Luxury Image Hover Reveal
```tsx
<div className="group relative overflow-hidden rounded-xl bg-stone-100 aspect-[4/3]">
  <Image 
    src={src} 
    alt={alt}
    fill 
    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
</div>
```

#### Reduced Motion Respect
Always include `@media (prefers-reduced-motion: reduce)` fallbacks or ensure Tailwind `motion-reduce:*` variants disable layout-intensive animations.

---

## 5. Component Polish Checklist

Before declaring any UI component complete, verify:

### 1. States & Feedback
- [ ] **Hover state**: Clear, subtle visual shift (color, brightness, or scale).
- [ ] **Active / Pressed state**: Spring or micro-scale reduction (`active:scale-[0.98]`).
- [ ] **Focus-Visible state**: Distinct keyboard focus ring without ugly default browser outlines.
- [ ] **Disabled state**: `disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed`.
- [ ] **Loading state**: Skeleton loader with shimmer matching the exact dimensions (never an abrupt white box).
- [ ] **Empty state**: Engaging icon, concise title, helpful description, and a primary CTA.
- [ ] **Error state**: Non-destructive red/amber tone with clear retry or correction prompt.

### 2. Layout & Responsiveness
- [ ] **Touch Targets**: Minimum 44px on mobile devices.
- [ ] **No Horizontal Overflow**: Prevent accidental x-axis scrolling (`overflow-x-hidden` on main container or check child widths).
- [ ] **Fluid Typography**: Use fluid type scales or responsive breakpoint prefixes (`text-xl sm:text-2xl md:text-3xl`).
- [ ] **Mobile Drawers vs Desktop Dialogs**: Prefer responsive sheet/drawers on mobile for filters and menus, floating dialogs on desktop.

---

## 6. Luxury Stone & Material Presentation Patterns

When rendering stone products, materials, and architectural catalogs:
- **Aspect Ratio Containers**: Use standardized aspect ratios (`aspect-[16/10]`, `aspect-[4/3]`, `aspect-square`) to prevent Cumulative Layout Shift (CLS).
- **Material Texture Highlight**: Allow full-bleed imagery with high zoom capability or lightbox inspection.
- **Specification Grids**: Format technical specs (finish, thickness, origin, vein type) as crisp tabular badges or key-value lists with muted labels and crisp values.
- **Editorial Section Headers**: Always compose sections with clean eyebrow subtitles, prominent editorial titles, and optional slider arrow controls in the action slot.

---

## 7. Reference Files

Detailed cheat-sheets are available in the `references/` directory:
- [Design Tokens & Color](./references/design-tokens-and-color.md)
- [Typography & RTL Guide](./references/typography-and-rtl.md)
- [Micro-Interactions & Animation Guide](./references/animations-and-interactions.md)
- [Component Patterns & Skeletons](./references/component-patterns.md)
