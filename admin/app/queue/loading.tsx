import { LoadingShell } from "@/components/loading-shell";
import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <LoadingShell showKpis={false}>
      <div className="mt-2 flex gap-3 overflow-x-auto pb-4 min-h-[600px]">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-[280px] shrink-0 rounded-lg border border-border bg-surface p-3"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-6" />
            </div>
            <Skeleton className="h-2.5 w-3/4 mb-2" />
            <Skeleton className="h-2.5 w-1/2 mb-3" />
            <Skeleton className="h-16 w-full mb-2" />
            <Skeleton className="h-16 w-full mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </LoadingShell>
  );
}
