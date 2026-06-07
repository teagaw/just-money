import { CardSkeleton, LoadingShell } from "@/components/loading-shell";

export default function Loading() {
  return (
    <LoadingShell showKpis={false}>
      <CardSkeleton className="mt-2" />
    </LoadingShell>
  );
}
