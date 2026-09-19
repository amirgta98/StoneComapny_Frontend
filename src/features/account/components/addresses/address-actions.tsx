"use client";

import Link from "next/link";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Truck,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CustomerAddress } from "../../types/address";

interface AddressActionsProps {
  address: CustomerAddress;
  onDelete: (address: CustomerAddress) => void;
  onSetDefaultShipping: (id: string) => void;
  onSetDefaultBilling: (id: string) => void;
  variant?: "dropdown" | "inline";
}

export function AddressActions({
  address,
  onDelete,
  onSetDefaultShipping,
  onSetDefaultBilling,
  variant = "inline",
}: AddressActionsProps) {
  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-border text-xs"
        >
          <Link href={`/account/addresses/${address.id}/edit`}>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>ویرایش</span>
          </Link>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onDelete(address)}
          className="h-8 gap-1.5 border-border text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>حذف</span>
        </Button>

        {/* Quick Default Toggles if not already default */}
        {(!address.isDefaultShipping || !address.isDefaultBilling) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                aria-label="سایر تنظیمات آدرس"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 border-border bg-card">
              {!address.isDefaultShipping && (
                <DropdownMenuItem
                  onClick={() => onSetDefaultShipping(address.id)}
                  className="gap-2 text-xs"
                >
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span>تنظیم به عنوان پیش‌فرض ارسال</span>
                </DropdownMenuItem>
              )}
              {!address.isDefaultBilling && (
                <DropdownMenuItem
                  onClick={() => onSetDefaultBilling(address.id)}
                  className="gap-2 text-xs"
                >
                  <ReceiptText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>تنظیم به عنوان پیش‌فرض صورت‌حساب</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  // Dropdown-only variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 border-border bg-card">
        <DropdownMenuItem asChild className="gap-2 text-xs">
          <Link href={`/account/addresses/${address.id}/edit`}>
            <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>ویرایش آدرس</span>
          </Link>
        </DropdownMenuItem>

        {!address.isDefaultShipping && (
          <DropdownMenuItem
            onClick={() => onSetDefaultShipping(address.id)}
            className="gap-2 text-xs"
          >
            <Truck className="h-3.5 w-3.5 text-primary" />
            <span>تنظیم به عنوان پیش‌فرض ارسال</span>
          </DropdownMenuItem>
        )}

        {!address.isDefaultBilling && (
          <DropdownMenuItem
            onClick={() => onSetDefaultBilling(address.id)}
            className="gap-2 text-xs"
          >
            <ReceiptText className="h-3.5 w-3.5 text-muted-foreground" />
            <span>تنظیم به عنوان پیش‌فرض صورت‌حساب</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-border/60" />

        <DropdownMenuItem
          onClick={() => onDelete(address)}
          className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>حذف آدرس</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
