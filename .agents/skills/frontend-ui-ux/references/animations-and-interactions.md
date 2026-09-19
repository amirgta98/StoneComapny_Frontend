# Micro-Interactions, Animation & Polish Guide

## 1. Physics-Based Micro-Interactions

### Spring and Snappy Easing
Avoid robotic linear transitions (`transition-all ease-linear`). UI must feel physical and responsive:
- **Fast and Decisive**: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo)
- **Fluid Spring**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (snappy overshoot)

### Interactive Element States

#### The Complete Interactive State Stack
Every button, card, and interactive control should address:
1. **Rest**: Baseline elevation, subtle hairline border, clear contrast.
2. **Hover**: Smooth lift or luminance adjustment (e.g. `hover:-translate-y-0.5 hover:shadow-md`).
3. **Active / Press**: Tactile recoil simulation (`active:scale-[0.98] active:translate-y-0`).
4. **Focus-Visible**: High-contrast accessible focus ring with an offset:
   `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`
5. **Disabled**: Clear disabled state with `disabled:opacity-50 disabled:pointer-events-none`.

---

## 2. Motion Framework (`motion/react` / Framer Motion)

When building staggered reveals, entrance animations, and modals with Framer Motion (`motion`):

### Staggered Grid Reveal Pattern
```tsx
import * as motion from "motion/react-client"; // or motion/react

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function StaggeredGrid({ children }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {children}
    </motion.div>
  );
}
```

### Layout Shift Prevention
When expanding accordions or tabs, use layout animations:
```tsx
<motion.div layout transition={{ duration: 0.25, ease: "easeInOut" }}>
  {/* Dynamic content */}
</motion.div>
```

---

## 3. Shimmer Skeleton Patterns

Never use a harsh, jarring blank space while data loads. Use realistic skeleton shapes with animated shimmer:

```tsx
export function SkeletonShimmer({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-stone-200/60 dark:bg-stone-800/60 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
    </div>
  );
}
```
Add to CSS or Tailwind config:
```css
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
```
