"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors",
        className
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all",
          theme === "dark" ? "rotate-0 scale-0" : "-rotate-90 scale-100"
        )}
      />
      <Moon
        className={cn(
          "-ml-4 h-4 w-4 transition-all",
          theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        )}
      />
    </button>
  );
}
