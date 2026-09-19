"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Award,
  ShieldCheck,
  Download,
  Eye,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  Printer,
} from "lucide-react";
import type { TechnicalDocument } from "../../types/document";

interface DocumentCardProps {
  document: TechnicalDocument;
  onPreview: (doc: TechnicalDocument) => void;
  onDownload: (doc: TechnicalDocument) => void;
}

export function DocumentCard({
  document,
  onPreview,
  onDownload,
}: DocumentCardProps) {
  const isQC = document.type === "quality_certificate";

  return (
    <Card className="group relative overflow-hidden border border-border/80 bg-card shadow-xs transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Stone Image Thumbnail */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40 sm:h-24 sm:w-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={document.productImage}
              alt={document.productName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>

          {/* Details Content */}
          <div className="min-w-0 flex-1 space-y-2.5">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className={
                  isQC
                    ? "border-primary/30 bg-primary/10 text-primary text-[11px] font-medium"
                    : "border-border bg-secondary text-foreground text-[11px] font-medium"
                }
              >
                {isQC ? (
                  <Award className="me-1 h-3 w-3" />
                ) : (
                  <ShieldCheck className="me-1 h-3 w-3" />
                )}
                {isQC ? "گواهی کیفیت و اصالت" : "برگه مشخصات فنی (TDS)"}
              </Badge>

              <Badge
                variant="secondary"
                className="font-mono text-[10px] text-muted-foreground"
                dir="ltr"
              >
                {document.orderNumber}
              </Badge>

              <span className="font-mono text-[10px] text-muted-foreground" dir="ltr">
                #{document.docNumber}
              </span>

              {document.verified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 ms-auto">
                  <CheckCircle2 className="h-3 w-3" />
                  استاندارد تأییدشده
                </span>
              )}
            </div>

            {/* Document Title & Product Name */}
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {document.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-2">
                <span>{document.productName}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground/70" />
                  {document.quarryOrigin}
                </span>
              </p>
            </div>

            {/* Key Specs Pills (First 3 metrics) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {document.keySpecs.slice(0, 3).map((spec, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 px-2 py-1 text-[11px] text-muted-foreground"
                >
                  <span>{spec.name}:</span>
                  <span className="font-semibold text-foreground">{spec.measuredValue}</span>
                </div>
              ))}
            </div>

            {/* Metadata & Actions Row */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between border-t border-border/50">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(document.issuedAt).toLocaleDateString("fa-IR")}
                </span>
                <span>•</span>
                <span className="font-mono" dir="ltr">
                  PDF ({document.fileSize})
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(document)}
                  className="h-8 gap-1.5 rounded-xl px-3 text-xs font-medium"
                >
                  <Eye className="h-3.5 w-3.5" />
                  مشاهده شناسنامه
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => onDownload(document)}
                  className="h-8 gap-1.5 rounded-xl px-3 text-xs font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  دانلود PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
