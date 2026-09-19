import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

type ManagementHubCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  meta?: string;
};

export function ManagementHubCard({ title, description, href, icon: Icon, meta }: ManagementHubCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-colors group-hover:border-primary/40">
        <CardContent className="flex h-full flex-col gap-3 p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {meta ? <p className="text-xs font-medium text-muted-foreground">{meta}</p> : null}
        </CardContent>
      </Card>
    </Link>
  );
}