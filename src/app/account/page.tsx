import { Overview } from "@/features/account";

/**
 * /account — Customer Dashboard overview (default landing page of the
 * account panel). Protected for authenticated users only (USER role
 * reaches it; the layout enforces the auth guard).
 */
export default function AccountPage() {
  return <Overview />;
}
