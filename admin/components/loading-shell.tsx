import { Skeleton } from "@/components/skeleton";
import { Card, CardBody, CardHeader } from "@/components/card";

export function LoadingShell({
  children,
  showKpis = true,
}: {
  children?: React.ReactNode;
  showKpis?: boolean;
}) {
  return (
    <div className="animate-in fade-in duration-200" aria-busy="true" aria-live="polite">
      <div className="pt-2 pb-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-64 mt-3" />
        <Skeleton className="h-3.5 w-96 mt-2" />
      </div>
      {showKpis && (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-lg bg-surface border border-border"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-32 mt-3" />
              <Skeleton className="h-3 w-40 mt-3" />
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-48 mt-1.5" />
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="h-40 w-full" />
      </CardBody>
    </Card>
  );
}
