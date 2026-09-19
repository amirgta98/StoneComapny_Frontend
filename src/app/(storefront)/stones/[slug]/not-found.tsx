import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui";

/** Not-found state for the product detail route. */
export default function ProductNotFound() {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 py-16 text-center sm:px-6 lg:px-8">
      <SearchX className="size-12 text-muted-foreground/50" aria-hidden="true" />
      <h1 className="text-xl font-bold">محصول یافت نشد</h1>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        محصول مورد نظر موجود نیست یا حذف شده است. می‌توانید فهرست کامل
        سنگ‌ها را مرور کنید.
      </p>
      <Button asChild className="mt-2">
        <Link href="/stones">مشاهده همه سنگ‌ها</Link>
      </Button>
    </div>
  );
}