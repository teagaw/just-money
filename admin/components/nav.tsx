"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Home,
  Kanban,
  PackageSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/queue", label: "Queue", icon: Kanban },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-56 lg:w-60 flex-col border-r border-border bg-bg sticky top-0 h-screen">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-md bg-accent flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-sm bg-accent-fg" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">Just Money</span>
          <span className="text-2xs uppercase tracking-widest text-fg-muted mt-0.5">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-surface-2 text-fg"
                  : "text-fg-muted hover:text-fg hover:bg-surface"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  active ? "text-accent" : "text-fg-muted group-hover:text-fg"
                )}
              />
              <span className="font-medium">{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center justify-between text-2xs uppercase tracking-widest text-fg-muted">
          <span>Status</span>
          <span className="flex items-center gap-1.5 text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            Live
          </span>
        </div>
        <p className="mt-2 text-xs text-fg-muted leading-relaxed">
          Mock data on. Connect Supabase for live numbers.
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-bg/95 backdrop-blur">
      <div className="grid grid-cols-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-fg-muted hover:text-fg"
          >
            <item.icon className="h-4 w-4" />
            <span className="text-2xs uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
