"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "./button";
import { LineBadge, StatusPill } from "./status";
import { formatCurrency, daysBetween } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  PRODUCT_STATUSES,
  STATUS_LABELS,
  type ProductStatus,
  type ProductWithStats,
} from "@/lib/types";
import { moveProductStatusAction } from "@/app/actions";

const COLUMN_HINT: Record<ProductStatus, string> = {
  idea: "Pain → angle. Validated by researcher.",
  researching: "Subagents digging into demand.",
  building: "Files being produced.",
  critiquing: "Critic reviewing for quality bar.",
  listed: "Live on marketplaces.",
  archived: "Retired or underperforming.",
};

export function KanbanBoard({
  initialProducts,
}: {
  initialProducts: ProductWithStats[];
}) {
  const [products, setProducts] = useState<ProductWithStats[]>(initialProducts);
  const [active, setActive] = useState<ProductWithStats | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onStart = (e: { active: { id: string | number } | null }) => {
    const id = e.active?.id;
    if (id === null || id === undefined) return;
    const p = products.find((x) => x.id === id);
    if (p) setActive(p);
  };

  const onEnd = (e: {
    active: { id: string | number } | null;
    over: { id: string | number } | null;
  }) => {
    setActive(null);
    const a = e.active;
    const over = e.over;
    if (!a || !over) return;
    const targetStatus = String(over.id) as ProductStatus;
    if (!PRODUCT_STATUSES.includes(targetStatus)) return;
    const productId = String(a.id);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, status: targetStatus } : p,
      ),
    );

    startTransition(async () => {
      try {
        await moveProductStatusAction(productId, targetStatus);
        router.refresh();
      } catch (err) {
        console.error("Failed to move card:", err);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, status: initialProducts.find((x) => x.id === productId)?.status ?? p.status }
              : p,
          ),
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between pb-4">
        <p className="text-xs text-fg-muted">
          {isPending
            ? "Saving change…"
            : "Drag cards across stages. Changes persist to the data layer."}
        </p>
        <Button
          variant="secondary"
          size="sm"
          disabled={isPending}
          onClick={() => {
            const idea: ProductWithStats = {
              id: `new-${Date.now()}`,
              slug: `idea-${Date.now()}`,
              line: "notion",
              name: "New idea (generated)",
              price_cents: 1900,
              status: "idea",
              cover_image_url: null,
              listing_url_etsy: null,
              listing_url_gumroad: null,
              listing_url_other: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              sales_count: 0,
              total_revenue_cents: 0,
              avg_rating: null,
              review_count: 0,
            };
            setProducts((p) => [idea, ...p]);
            startTransition(() => {
              router.refresh();
            });
          }}
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Generate next idea
        </Button>
      </div>

      <KanbanGrid
        products={products}
        active={active}
        onStart={onStart}
        onEnd={onEnd}
      />
    </div>
  );
}

function KanbanGrid({
  products,
  active,
  onStart,
  onEnd,
}: {
  products: ProductWithStats[];
  active: ProductWithStats | null;
  onStart: (e: { active: { id: string | number } | null }) => void;
  onEnd: (e: {
    active: { id: string | number } | null;
    over: { id: string | number } | null;
  }) => void;
}) {
  return (
    <KanbanDnd
      products={products}
      active={active}
      onStart={onStart}
      onEnd={onEnd}
    />
  );
}

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

function KanbanDnd({
  products,
  active,
  onStart,
  onEnd,
}: {
  products: ProductWithStats[];
  active: ProductWithStats | null;
  onStart: (e: { active: { id: string | number } | null }) => void;
  onEnd: (e: {
    active: { id: string | number } | null;
    over: { id: string | number } | null;
  }) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => onStart({ active: e.active })}
      onDragEnd={(e) => onEnd({ active: e.active, over: e.over })}
    >
      <div className="flex-1 min-h-0 overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-4">
          {PRODUCT_STATUSES.map((status) => {
            const items = products.filter((p) => p.status === status);
            return (
              <Column
                key={status}
                status={status}
                count={items.length}
                hint={COLUMN_HINT[status]}
              >
                <div className="space-y-2 p-2 min-h-[120px]">
                  {items.length === 0 ? (
                    <div className="text-center text-2xs text-fg-muted/70 py-6">
                      Drop a card here
                    </div>
                  ) : (
                    items.map((p) => <KanbanCard key={p.id} product={p} />)
                  )}
                </div>
              </Column>
            );
          })}
        </div>
      </div>
      <DragOverlay>
        {active && (
          <div className="rotate-1 scale-[1.02]">
            <KanbanCard product={active} dragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  status,
  count,
  hint,
  children,
}: {
  status: ProductStatus;
  count: number;
  hint: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-[280px] shrink-0 rounded-lg border bg-surface flex flex-col transition-colors",
        isOver ? "border-accent bg-accent/5" : "border-border",
      )}
    >
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <StatusPill status={status} />
        <span className="text-2xs text-fg-muted num font-medium">{count}</span>
      </div>
      <p className="px-3 pb-2 text-2xs text-fg-muted/80 leading-relaxed">
        {hint}
      </p>
      {children}
    </div>
  );
}

function KanbanCard({
  product,
  dragging,
}: {
  product: ProductWithStats;
  dragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: product.id,
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "group rounded-md border bg-bg p-3 cursor-grab active:cursor-grabbing transition-all",
        dragging
          ? "border-accent shadow-xl shadow-accent/10"
          : "border-border hover:border-fg-muted/50",
        isDragging && !dragging && "opacity-30",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug line-clamp-2">
          {product.name}
        </p>
        <span className="text-xs num font-semibold text-fg shrink-0">
          {formatCurrency(product.price_cents)}
        </span>
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <LineBadge line={product.line} />
        <span className="text-2xs text-fg-muted num">
          {daysBetween(product.created_at)}d
        </span>
      </div>
      {product.status === "listed" && product.sales_count > 0 && (
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-2xs">
          <span className="text-fg-muted uppercase tracking-widest">Sold</span>
          <span className="num font-semibold text-accent">
            {product.sales_count}
          </span>
        </div>
      )}
    </div>
  );
}
