"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "./button";
import { Field, Input, Select, Textarea } from "./form";
import {
  PRODUCT_LINES,
  PRODUCT_STATUSES,
  LINE_LABELS,
  STATUS_LABELS,
  type ProductLine,
  type ProductStatus,
} from "@/lib/types";
import { createProductAction } from "@/app/actions";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [line, setLine] = useState<ProductLine>("notion");
  const [status, setStatus] = useState<ProductStatus>("idea");
  const [price, setPrice] = useState("19");
  const [slug, setSlug] = useState("");
  const [slugDirty, setSlugDirty] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      setName("");
      setSlug("");
      setSlugDirty(false);
      setNotes("");
      setPrice("19");
      setLine("notion");
      setStatus("idea");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (slugDirty) return;
    if (!name) {
      setSlug("");
      return;
    }
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 50),
    );
  }, [name, slugDirty]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    const priceCents = Math.max(1, Math.round(Number(price) * 100) || 1900);
    startTransition(async () => {
      try {
        await createProductAction({
          name: name.trim(),
          slug: slug.trim(),
          line,
          status,
          priceCents,
          notes: notes.trim() || undefined,
        });
        onClose();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create product");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        className="w-full sm:max-w-lg bg-bg border border-border rounded-t-xl sm:rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 id="add-product-title" className="text-base font-semibold">
            Add a new product
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-md hover:bg-surface-2 text-fg-muted hover:text-fg inline-flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form className="px-5 py-5 space-y-4" onSubmit={submit}>
          <Field label="Name">
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Modern Tech Resume"
              autoFocus
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Line">
              <Select
                value={line}
                onChange={(e) => setLine(e.target.value as ProductLine)}
              >
                {PRODUCT_LINES.map((l) => (
                  <option key={l} value={l}>
                    {LINE_LABELS[l]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
              >
                {PRODUCT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (USD)" hint="Stored as cents.">
              <Input
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Field>
            <Field label="Slug" hint="Used in URL.">
              <Input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugDirty(true);
                }}
              />
            </Field>
          </div>
          <Field label="Spec notes" hint="What this product is and why.">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Target: Etsy resume buyers. Pain: ATS rejection. Angle: a clean, designer-grade 1-page resume that passes parsers."
            />
          </Field>
          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Adding…" : "Add product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
