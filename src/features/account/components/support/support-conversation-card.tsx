"use client";

import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { faIR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui";
import { SupportStatusBadge } from "./support-status-badge";
import { SupportCategoryBadge } from "./support-category-badge";
import type { SupportConversation } from "../../types/support";
import { ChevronLeft, MessageSquare, Clock, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportConversationCardProps {
  conversation: SupportConversation;
  className?: string;
}

export function SupportConversationCard({
  conversation,
  className,
}: SupportConversationCardProps) {
  let relativeTime = "";
  try {
    relativeTime = formatDistanceToNow(parseISO(conversation.lastMessageAt), {
      addSuffix: true,
      locale: faIR,
    });
  } catch {
    relativeTime = "اخیراً";
  }

  const hasUnread = conversation.unreadCountCustomer > 0;

  return (
    <Link
      href={`/account/support/${conversation.id}`}
      className="block group outline-hidden"
    >
      <Card
        className={cn(
          "border border-border/70 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden relative",
          hasUnread && "border-primary/30 bg-primary/[0.015]",
          className
        )}
      >
        {hasUnread && (
          <span className="absolute top-3 end-3 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
        )}

        <CardContent className="p-4 sm:p-5 space-y-3">
          {/* Top Row: Conversation Number, Category, Status */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
                {conversation.conversationNumber}
              </span>
              <SupportCategoryBadge category={conversation.category} />
            </div>
            <SupportStatusBadge status={conversation.status} />
          </div>

          {/* Middle Row: Subject and Preview */}
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {conversation.subject}
            </h3>
            {conversation.lastMessagePreview && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {conversation.lastMessagePreview}
              </p>
            )}
          </div>

          {/* Bottom Row: Agent/Dept, Time, and Action arrow */}
          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              {conversation.assignedAgentName && (
                <span className="inline-flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">
                    {conversation.assignedAgentName}
                  </span>
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                <span>{relativeTime}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-primary font-medium group-hover:translate-x-[-2px] rtl:group-hover:translate-x-[2px] transition-transform">
              <span className="hidden sm:inline text-xs">مشاهده گفتگو</span>
              <ChevronLeft className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
