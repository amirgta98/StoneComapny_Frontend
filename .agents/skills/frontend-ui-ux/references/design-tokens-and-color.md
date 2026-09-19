# Design Tokens, Color Palettes & Surface Elevation

## 1. Palette Architecture: The "Natural & Architectural" Aesthetic

### Why Default Colors Look Cheap
Generic web palettes rely on default primary blue (`#2563eb`), purple gradient buttons, and flat gray (`#f3f4f6`) cards. This screams template/SaaS.

### The Curated Luxury Palette System
For high-end, tactile, and natural-material applications:
- **Canvas (Background)**:
  - Light: `#faf9f7` (warm alabaster) or `#fdfcfb` (stone milk)
  - Dark: `#0c0a09` (obsidian stone) or `#18181b` (zinc graphite)
- **Primary / Brand Anchor**:
  - Warm Earth & Bronze: `#8b5e34` / `#784e27` (terracotta / bronze marble)
  - Dark Accent: `#1c1917` (rich espresso charcoal)
- **Secondary / Warm Neutrals**:
  - Light: `#f5f0ea` (travertine bone)
  - Border / Hairline: `#e7e0d6` (limestone sand)
- **Status & Feedback Tokens**:
  - Success: `#15803d` (deep forest jade, not radioactive neon green)
  - Warning: `#b45309` (warm amber/topaz)
  - Danger: `#b91c1c` (crimson oxide)

---

## 2. Realistic Elevation & Dual-Layer Shadows

### Avoid Default Tailwind Single Shadows
Single shadows look either invisible or muddy. Dual-layer shadows simulate ambient environmental light + direct key light.

### Shadow Recipes
```css
/* Level 1: Flat Card (rest state) */
--shadow-sm: 0 1px 2px 0 rgba(28, 25, 23, 0.04), 0 1px 3px 0 rgba(28, 25, 23, 0.02);

/* Level 2: Card on Hover or Interactive Tile */
--shadow-md: 0 4px 6px -1px rgba(28, 25, 23, 0.06), 0 2px 4px -2px rgba(28, 25, 23, 0.04);

/* Level 3: Elevated Floating Popover / Dropdown */
--shadow-lg: 0 10px 15px -3px rgba(28, 25, 23, 0.08), 0 4px 6px -4px rgba(28, 25, 23, 0.04);

/* Level 4: Modal Dialog / Drawer */
--shadow-xl: 0 20px 25px -5px rgba(28, 25, 23, 0.12), 0 8px 10px -6px rgba(28, 25, 23, 0.06);
```

---

## 3. Glassmorphism & Frosted Glass Surfaces

Used for sticky navigation bars, filter headers, and floating overlays:
```tsx
<header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60 transition-all">
  {/* Content */}
</header>
```
Guidelines:
- Always pair `backdrop-blur-*` with semi-transparent background (`bg-background/80` or `bg-card/75`).
- Add a delicate border (`border-border/60` or `border-white/10`) to separate the glass layer from content underneath.
