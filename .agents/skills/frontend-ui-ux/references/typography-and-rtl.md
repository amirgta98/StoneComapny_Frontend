# Typography & RTL Layout Guide

## 1. Persian & Arabic Typography Mastery

### The #1 Golden Rule of Persian Typography
**NEVER apply letter-spacing (`tracking-wider`, `tracking-tight`, `tracking-[...]`) to Persian text.**
Persian script uses cursive connections between letters within words. Altering letter-spacing creates ugly disconnects or glitches in the text rendering engine.

- When working with mixed bilingual layouts (e.g. English labels and Persian product titles), isolate letter-spacing strictly to Latin text:
  ```tsx
  {/* Correct */}
  <span className="font-mono text-xs tracking-wider uppercase font-semibold text-muted-foreground">
    SKU-8921
  </span>
  <h3 className="text-lg font-bold text-foreground tracking-normal">
    سنگ تراورتن دره بخاری سوپر
  </h3>
  ```

### Line Height (`leading`) Balance
Persian characters feature tall ascenders (ک, ل, ا) and deep descenders (ی, م, ج, ز, ق).
- Default Latin line heights (`leading-none`, `leading-tight`) cause Persian accents and descenders to collide.
- Body text should use `leading-relaxed` or `leading-loose` (approx. `1.7` to `1.85`).
- Headings should use `leading-snug` or `leading-normal` (approx. `1.3` to `1.45`).

---

## 2. Bidirectional Layouts (RTL & LTR)

### CSS Logical Properties
Never use physical directional classes (`pl-`, `pr-`, `ml-`, `mr-`, `left-`, `right-`).
Always use logical classes:

| Physical (Avoid) | Logical (Use) | Description |
| :--- | :--- | :--- |
| `ml-4` | `ms-4` | Margin start (left in LTR, right in RTL) |
| `mr-4` | `me-4` | Margin end (right in LTR, left in RTL) |
| `pl-6` | `ps-6` | Padding start |
| `pr-6` | `pe-6` | Padding end |
| `left-0` | `start-0` | Positioning start edge |
| `right-0` | `end-0` | Positioning end edge |
| `text-left` | `text-start` | Text alignment |
| `text-right` | `text-end` | Text alignment |
| `border-l` | `border-s` | Border on inline start |
| `border-r` | `border-e` | Border on inline end |

### Directional Icons
Icons that represent spatial movement or navigation must mirror in RTL:
```tsx
{/* Arrow or Chevron must mirror */}
<ChevronRight className="w-4 h-4 rtl:rotate-180 transition-transform" />
<ArrowLeft className="w-4 h-4 rtl:rotate-180" />

{/* Static icons must NOT rotate */}
<Search className="w-4 h-4" />
<Phone className="w-4 h-4" />
<ShoppingBag className="w-4 h-4" />
```

### Numbers & Mixed Text
Always ensure phone numbers, pricing, and dimensional technical specs (e.g. `20 × 40 cm`) are wrapped with appropriate dir/bdi tags:
```tsx
<bdi className="font-mono">{dimensions}</bdi>
```
