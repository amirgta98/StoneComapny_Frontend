"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { faIR } from "date-fns/locale";
import {
  User,
  Headphones,
  Check,
  CheckCheck,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import type { SupportMessage } from "../../types/support";
import { Dialog, DialogContent } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SupportMessageBubbleProps {
  message: SupportMessage;
  isCustomer: boolean;
}

export function SupportMessageBubble({
  message,
  isCustomer,
}: SupportMessageBubbleProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  let formattedTime = "";
  try {
    formattedTime = format(parseISO(message.createdAt), "HH:mm - yyyy/MM/dd", {
      locale: faIR,
    });
  } catch {
    formattedTime = "لحظاتی پیش";
  }

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[88%] sm:max-w-[78%] transition-all",
        isCustomer ? "ms-auto flex-row-reverse" : "me-auto flex-row"
      )}
    >
      {/* Avatar / Role Icon */}
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl shrink-0 mt-0.5 text-xs font-bold shadow-xs",
          isCustomer
            ? "bg-primary text-primary-foreground"
            : "bg-secondary border border-border/80 text-foreground"
        )}
      >
        {isCustomer ? (
          <User className="h-4 w-4" />
        ) : (
          <Headphones className="h-4 w-4 text-primary" />
        )}
      </div>

      {/* Message Content Container */}
      <div className="space-y-1">
        {/* Header Label: Sender Name & Role */}
        <div
          className={cn(
            "flex items-center gap-2 text-[11px] text-muted-foreground",
            isCustomer ? "justify-end" : "justify-start"
          )}
        >
          <span className="font-semibold text-foreground">
            {message.senderName}
          </span>
          {!isCustomer && (
            <span className="rounded-md bg-primary/10 px-1.5 py-0.2 text-[10px] font-medium text-primary border border-primary/20">
              پشتیبانی
            </span>
          )}
          <span>•</span>
          <span className="font-mono text-[10px]">{formattedTime}</span>
        </div>

        {/* Message Bubble Card */}
        <div
          className={cn(
            "rounded-2xl p-4 text-xs leading-relaxed shadow-xs relative",
            isCustomer
              ? "bg-primary/10 dark:bg-primary/15 text-foreground rounded-tr-none border border-primary/20"
              : "bg-card text-foreground rounded-tl-none border border-border/80"
          )}
        >
          {/* Message Text */}
          {message.body && (
            <p className="whitespace-pre-wrap select-text font-normal">
              {message.body}
            </p>
          )}

          {/* Attachments Section */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2 pt-2 border-t border-border/50">
              {message.attachments.map((att) => {
                const isImg =
                  att.mimeType.startsWith("image/") ||
                  att.url.startsWith("data:image/");

                if (isImg) {
                  return (
                    <div key={att.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setSelectedImage(att.url)}
                        className="group relative block overflow-hidden rounded-xl border border-border bg-black/5 hover:opacity-90 transition-all cursor-zoom-in"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={att.url}
                          alt={att.name}
                          className="max-h-60 rounded-xl object-contain"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          مشاهده تصویر کامل
                        </div>
                      </button>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {att.name}
                      </span>
                    </div>
                  );
                }

                return (
                  <a
                    key={att.id}
                    href={att.url}
                    download={att.name}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border/70 bg-secondary/40 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-xs font-medium text-foreground truncate">
                        {att.name}
                      </span>
                    </div>
                    <Download className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Delivery Indicator for Customer */}
          {isCustomer && (
            <div className="flex justify-end mt-1 text-primary/70">
              {message.readAt ? (
                <CheckCheck className="h-3 w-3 text-primary" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Dialog for Image Attachment */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl p-2 rounded-2xl bg-black/90 border-zinc-800">
          {selectedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedImage}
              alt="پیوست تصویر سنگ"
              className="max-h-[80vh] w-auto mx-auto rounded-xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
