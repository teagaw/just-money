import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SideNav, MobileNav } from "@/components/nav";
import { isMockMode } from "@/lib/supabase";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Just Money — Admin",
  description: "Production dashboard for the digital product empire.",
  applicationName: "Just Money Admin",
};

export const viewport: Viewport = {
  themeColor: "#0d1410",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mock = isMockMode();
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider>
          <div className="flex min-h-screen bg-bg text-fg">
            <SideNav />
            <div className="flex-1 flex flex-col min-w-0">
              <Header mock={mock} />
              <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-24 md:pb-10 pt-2 max-w-[1440px] w-full mx-auto">
                {children}
              </main>
              <MobileNav />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Header({ mock }: { mock: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 md:hidden">
          <div className="h-6 w-6 rounded-md bg-accent flex items-center justify-center">
            <div className="h-2 w-2 rounded-sm bg-accent-fg" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Just Money</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-fg-muted">
          <span className="font-mono text-2xs tracking-widest uppercase">
            Empire Dashboard
          </span>
          <span className="text-border">·</span>
          <span className="text-2xs tracking-widest uppercase">
            {mock ? "Mock data" : "Live"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {mock && (
            <span className="hidden sm:inline-flex chip chip-accent">
              <span className="dot bg-accent animate-pulse-dot" />
              Connect Supabase
            </span>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
