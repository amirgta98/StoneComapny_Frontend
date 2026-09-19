/**
 * Auth route group — intentionally has no storefront header/footer.
 * The login page renders its own slim header (see `LoginPage`).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}