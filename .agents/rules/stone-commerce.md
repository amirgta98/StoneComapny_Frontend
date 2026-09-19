---
description: Stone Commerce Multi-Tenant architecture and development rules
always_on: true
---

# Stone Commerce Multi-Tenant — Agent Skill & Project Rules

This document outlines the core architecture, tenant isolation, and engineering guidelines for the Stone Commerce platform.

## 1. Non-Negotiable Rules
1. **Reuse Before Creating**: Never write a component from scratch when an existing project component can be reused, composed, or extended.
2. **Inspect Before Coding**: Inspect repository structure, shared components, design tokens, and existing patterns before making changes.
3. **No Unnecessary Dependencies**: Prefer existing dependencies (`motion`, `gsap`, `nuqs`, `@radix-ui/*`, `sonner`, `lucide-react`, `zustand`, `@tanstack/react-query`).
4. **Feature-First Architecture**: Group code by business feature under `src/features/<feature-name>/`. Keep `src/app/` thin.
5. **Server Components by Default**: Only add `"use client"` where interactivity, browser APIs, or state requires it.
6. **Security is Server-Side**: Enforce tenant boundaries and role authorization on the server. Never trust client `tenantId`.

## 2. Storefront Design & Persian Typography
- Use the architectural `Section` primitive (`@/features/storefront`) for consistent section layout.
- **NEVER use letter-spacing (`tracking-*`) on Persian text** — it breaks cursive letter ligatures.
- Use CSS logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`) for bidirectional RTL/LTR support.
- Maintain a luxury, architectural aesthetic (warm stone palettes, dual-layer shadows, tactile micro-interactions).
