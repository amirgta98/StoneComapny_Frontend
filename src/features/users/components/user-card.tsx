import { Badge } from "@/components/ui";
import { userRoleLabel, userRoleVariant, userStatusLabel, userStatusVariant } from "../constants";
import type { User } from "@/types";

type UserCardProps = {
  user: User;
};

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{user.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <div className="flex-shrink-0 flex gap-1">
          <Badge variant={userRoleVariant[user.role]} className="text-xs">
            {userRoleLabel[user.role]}
          </Badge>
          <Badge variant={userStatusVariant[user.status]} className="text-xs">
            {userStatusLabel[user.status]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">شرکت</p>
          <p className="font-medium">{user.tenantName || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">ایجاد شد</p>
          <p className="font-medium">
            {new Date(user.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
        {user.lastLogin && (
          <div className="col-span-2">
            <p className="text-muted-foreground">آخرین ورود</p>
            <p className="font-medium">
              {new Date(user.lastLogin).toLocaleDateString("fa-IR")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
