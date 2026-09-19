import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { QueryProvider, ThemeProvider } from "@/providers";
import { AuthProvider, RoleSwitcher } from "@/auth";
import { Toaster } from "@/components/ui";
import { siteConfig } from "@/config";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased `}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
            <RoleSwitcher />
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}