import { PageHeader } from "@/components/page-header";
import { KanbanBoard } from "@/components/kanban-board";
import { getProductsServer } from "@/lib/supabase-server";

export default async function QueuePage() {
  const products = await getProductsServer();
  return (
    <>
      <PageHeader
        eyebrow="Production"
        title="Queue"
        description="Move ideas through research, build, and critique. Six stages, one source of truth."
      />
      <div className="h-[calc(100vh-220px)] min-h-[600px]">
        <KanbanBoard initialProducts={products} />
      </div>
    </>
  );
}
