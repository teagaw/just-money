import { CardSkeleton, LoadingShell } from "@/components/loading-shell";

export default function Loading() {
  return (
    <LoadingShell>
      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-3">
        <CardSkeleton className="lg:col-span-2" />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-3">
        <CardSkeleton className="lg:col-span-2" />
        <CardSkeleton />
      </div>
    </LoadingShell>
  );
}
