"use client";

import Link from "next/link";
import { ImageOff, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { useCartStore, type CartItem } from "@/stores";
import { formatPrice } from "@/features/products/lib/product-price";
import { getCartLineTotal } from "../lib/cart-totals";

type CartItemRowProps = {
  item: CartItem;
};

/**
 * Single cart line: image, name, unit price, quantity stepper and remove.
 * Decrementing below 1 removes the line (same net effect as the trash icon).
 */
export function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const closeCart = useCartStore((s) => s.closeCart);

  const decrement = () => {
    if (item.quantity <= 1) {
      removeItem(item.productId, item.variantId);
    } else {
      updateQuantity(item.productId, item.quantity - 1, item.variantId);
    }
  };

  const increment = () =>
    updateQuantity(item.productId, item.quantity + 1, item.variantId);

  const handleRemove = () => {
    removeItem(item.productId, item.variantId);
    toast.success("از سبد خرید حذف شد", { description: item.name });
  };

  return (
    <li className="flex gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
      {/* Product image → detail page */}
      <Link
        href={`/stones/${item.slug}`}
        onClick={closeCart}
        className="block h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted"
      >
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Name + remove */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/stones/${item.slug}`}
            onClick={closeCart}
            className="line-clamp-2 text-sm font-medium transition-colors hover:text-primary"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="حذف از سبد خرید"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {item.unit && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.unit}</p>
        )}

        {/* Quantity stepper + line total */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              aria-label="کاهش تعداد"
              onClick={decrement}
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </Button>
            <span className="w-9 text-center text-sm font-medium tabular-nums">
              {item.quantity.toLocaleString("fa-IR")}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7"
              aria-label="افزایش تعداد"
              onClick={increment}
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </Button>
          </div>

          <div className="text-left">
            {item.price !== undefined ? (
              <>
                <p className="text-sm font-bold tabular-nums">
                  {formatPrice(getCartLineTotal(item))}{" "}
                  <span className="text-[11px] font-normal text-muted-foreground">
                    تومان
                  </span>
                </p>
                <p className="text-[11px] tabular-nums text-muted-foreground">
                  {formatPrice(item.price)} / {item.unit ?? "واحد"}
                </p>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">استعلام قیمت</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}