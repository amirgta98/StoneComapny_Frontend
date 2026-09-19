"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, X, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { toast } from "sonner";
import type { SupportAttachment } from "../../types/support";

interface SupportMessageComposerProps {
  onSendMessage: (data: {
    body: string;
    attachments?: SupportAttachment[];
  }) => Promise<void>;
  isDisabled: boolean;
  disabledReason?: string;
}

export function SupportMessageComposer({
  onSendMessage,
  isDisabled,
  disabledReason,
}: SupportMessageComposerProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newAtt: SupportAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        url: dataUrl,
        size: file.size,
        mimeType: file.type,
      };
      setAttachments([newAtt]);
      toast.success("فایل با موفقیت پیوست شد.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async () => {
    if (isDisabled || isSending) return;

    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) {
      toast.error("لطفاً متن پیام یا فایل پیوست را وارد کنید.");
      return;
    }

    setIsSending(true);
    try {
      await onSendMessage({
        body: trimmed,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      setText("");
      setAttachments([]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "ارسال پیام با خطا مواجه شد."
      );
    } finally {
      setIsSending(false);
    }
  };

  if (isDisabled) {
    return (
      <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          {disabledReason ||
            "این گفتگو بسته شده است و امکان ارسال پیام جدید وجود ندارد."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-2 sm:p-3 shadow-xs space-y-2">
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2 border-b border-border/50">
          {attachments.map((att) => {
            const isImg =
              att.mimeType.startsWith("image/") ||
              att.url.startsWith("data:image/");

            return (
              <div
                key={att.id}
                className="flex items-center gap-2 p-1.5 pe-2.5 rounded-xl border border-border bg-secondary/40 text-xs"
              >
                {isImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={att.url}
                    alt={att.name}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <FileText className="h-4 w-4 text-primary" />
                )}
                <span className="truncate max-w-[150px] font-medium">
                  {att.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="ms-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Composer Row */}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          title="پیوست تصویر یا سند"
          className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="پیام خود را بنویسید... (Enter برای ارسال، Shift+Enter خط جدید)"
          className="min-h-[40px] max-h-[140px] text-xs resize-none rounded-xl bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2"
        />

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSending || (!text.trim() && attachments.length === 0)}
          className="h-10 px-4 rounded-xl text-xs gap-1.5 shrink-0 shadow-xs active:scale-[0.98] transition-all"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">ارسال</span>
              <Send className="h-4 w-4 rtl:rotate-180" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
