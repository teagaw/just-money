"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 border border-danger/20 mb-4">
          <AlertTriangle className="h-5 w-5 text-danger" />
        </div>
        <h2 className="text-lg font-semibold">Something broke</h2>
        <p className="mt-2 text-sm text-fg-muted leading-relaxed">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        {error.digest && (
          <p className="mt-2 text-2xs font-mono text-fg-muted/70">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="primary" onClick={reset}>
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </Button>
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
