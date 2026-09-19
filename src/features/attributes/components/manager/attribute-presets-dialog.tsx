"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, RotateCcw, Microscope, Layers, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FACTORY_PRESET_PACKAGES } from "../../data/mock-attributes";
import { toast } from "sonner";

interface AttributePresetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetToDefaults: () => void;
}

export function AttributePresetsDialog({
  open,
  onOpenChange,
  onResetToDefaults,
}: AttributePresetsDialogProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const handleApplyPack = () => {
    onResetToDefaults();
    toast.success("پیش‌فرض‌های تخصصی آزمایشگاهی و فرآوری با موفقیت بارگذاری شد.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl" dir="rtl">
        <DialogHeader className="text-start">
          <div className="flex items-center gap-2.5 text-primary">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 border border-amber-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                بارگذاری الگوهای صنعتی و آزمایشگاهی سنگ
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                تزریق استانداردهای مهندسی سنگ ASTM و فرآوری‌های مرسوم صادراتی به کاتالوگ
              </p>
            </div>
          </div>
          <DialogDescription className="sr-only">
            انتخاب و اعمال بسته‌های پیش‌فرض ویژگی‌ها و استانداردهای سنگ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {FACTORY_PRESET_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              onClick={() => setSelectedPack(pkg.id)}
              className={`p-4 cursor-pointer transition-all border ${
                selectedPack === pkg.id
                  ? "border-amber-500/60 bg-amber-500/5 shadow-xs"
                  : "border-border/70 hover:border-amber-500/40 hover:bg-secondary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    {pkg.id === "astm-specs" ? (
                      <Microscope className="h-4 w-4" />
                    ) : (
                      <Layers className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{pkg.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {pkg.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {pkg.codes.map((code) => (
                        <code
                          key={code}
                          className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/50"
                          dir="ltr"
                        >
                          {code}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] shrink-0">
                  {pkg.attributesCount.toLocaleString("fa-IR")} مشخصه
                </Badge>
              </div>
            </Card>
          ))}

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              با انتخاب هر بسته یا بازنشانی به پیش‌فرض کارخانه، ساختار کامل ویژگی‌های سنگ با واحدهای مهندسی (درصد، kg/cm²، gr/cm³) بارگذاری شده و در فرم تعریف سنگ و فیلترهای وبگاه در دسترس قرار می‌گیرد.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            انصراف
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleApplyPack}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>بارگذاری الگوها و بازنشانی</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
