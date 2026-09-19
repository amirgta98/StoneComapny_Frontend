# Component Patterns & Luxury UI Standards

## 1. Product Cards & Material Tiles

Product cards in a luxury stone catalog must prioritize the texture and visual quality of the material.

### Anatomical Structure of a Premium Material Card
1. **Aspect Container with Smooth Scale**:
   - Aspect ratio: `aspect-[4/3]` or `aspect-[16/10]`
   - Rounded corners: `rounded-xl` or `rounded-2xl`
   - Hidden overflow with `group` hover scale
2. **Subtle Badges**:
   - Quarry / Origin badge in backdrop-blur glass pill (`backdrop-blur-md bg-white/80 dark:bg-black/60 text-xs px-2.5 py-1 rounded-full font-medium`).
3. **Typography**:
   - Persian title in bold weight with tight/natural leading.
   - Latin/Technical subtitle (quarry code, grade) in muted mono/sans.
4. **Action Layer**:
   - Quick inquiry / sample request button appearing on desktop hover or pinned cleanly on mobile.

```tsx
export function StoneProductCard({ product }: { product: StoneProduct }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute start-3 top-3">
          <span className="inline-flex items-center rounded-full bg-white/85 dark:bg-black/75 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md shadow-sm">
            {product.origin}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between pt-4 pb-1 px-1">
        <div>
          <span className="text-xs font-medium text-muted-foreground">
            {product.category}
          </span>
          <h3 className="mt-1 text-base font-bold text-foreground line-clamp-1">
            {product.title}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
          <span className="text-sm font-semibold text-primary">
            {product.priceFormatted || "استعلام قیمت"}
          </span>
          <button className="text-xs font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
            مشاهده جزئیات
            <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>
      </div>
    </article>
  );
}
```

---

## 2. Empty States with Character

Never present a dry text label like "موردی یافت نشد" (No items found).
Always compose an intentional empty state:
```tsx
export function EmptyCatalogState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4">
        <Layers className="h-7 w-7 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-foreground">هیچ سنگ یا محصولی یافت نشد</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        فیلترهای انتخابی شما با هیچ کدام از محصولات فعلی انبار تطابق ندارد. لطفاً فیلترها را تغییر داده یا بازنشانی کنید.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:brightness-105 active:scale-95 transition-all"
        >
          بازنشانی فیلترها
        </button>
      )}
    </div>
  );
}
```

---

## 3. Section Compositions

Always adhere to the architectural `Section` pattern:
- Compact, elegant eyebrow text (uppercase or tinted small text)
- Prominent editorial title
- Optional description paragraph
- Action slot holding navigation arrows or "مشاهده همه" (View All)
- Clean vertical rhythm with consistent spacing (`py-12 md:py-20`)
