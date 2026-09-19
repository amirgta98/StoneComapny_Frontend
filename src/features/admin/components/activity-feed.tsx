import { Building2, UserPlus, Settings2, Server, ShoppingBag, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { ActivityEvent } from "../types";

const typeConfig = {
  "tenant.created": { icon: Building2 },
  "tenant.updated": { icon: Settings2 },
  "user.invited": { icon: UserPlus },
  system: { icon: Server },
  "order.placed": { icon: ShoppingBag },
  "inquiry.received": { icon: FileSpreadsheet },
} as const;

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
          <CardDescription>هنوز فعالیت اخیری ثبت نشده است</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>فعالیت‌های اخیر</CardTitle>
        <CardDescription>آخرین رویدادهای پلتفرم</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {events.map((event) => {
            const config = typeConfig[event.type];
            const Icon = config.icon;
            return (
              <li key={event.id} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleDateString("fa-IR")}
                    {event.actor ? ` · ${event.actor}` : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}