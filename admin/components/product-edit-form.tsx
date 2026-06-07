"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
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
import { updateProductAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export function ProductEditForm({
  product,
}: {
  product: {
    id: string;
    name: string;
    line: ProductLine;
    status: ProductStatus;
    price_cents: number;
    listing_url_etsy: string | null;
    listing_url_gumroad: string | null;
  };
}) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [line, setLine] = useState<ProductLine>(product.line);
  const [status, setStatus] = useState<ProductStatus>(product.status);
  const [price, setPrice] = useState(
    (product.price_cents / 100).toFixed(0),
  );
  const [etsy, setEtsy] = useState(product.listing_url_etsy ?? "");
  const [gumroad, setGumroad] = useState(product.listing_url_gumroad ?? "");
  const [notes, setNotes] = useState(
    "Cover image passes quality bar. Description is benefit-led. Consider adding a third mockup before ship.",
  );
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty =
    name !== product.name ||
    line !== product.line ||
    status !== product.status ||
    Number(price) * 100 !== product.price_cents ||
    (etsy || null) !== product.listing_url_etsy ||
    (gumroad || null) !== product.listing_url_gumroad;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedAt(null);
    const priceCents = Math.max(1, Math.round(Number(price) * 100));
    startTransition(async () => {
      try {
        await updateProductAction(product.id, {
          name: name.trim(),
          line,
          status,
          priceCents,
          listingUrlEtsy: etsy.trim() || null,
          listingUrlGumroad: gumroad.trim() || null,
        });
        setSavedAt(new Date().toLocaleTimeString());
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  const reset = () => {
    setName(product.name);
    setLine(product.line);
    setStatus(product.status);
    setPrice((product.price_cents / 100).toFixed(0));
    setEtsy(product.listing_url_etsy ?? "");
    setGumroad(product.listing_url_gumroad ?? "");
    setError(null);
    setSavedAt(null);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Field label="Name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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
      <div className="grid grid-cols-3 gap-3">
        <Field label="Price (USD)">
          <Input
            type="number"
            step="1"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>
        <Field label="Etsy URL">
          <Input
            type="url"
            value={etsy}
            onChange={(e) => setEtsy(e.target.value)}
            placeholder="https://etsy.com/listing/…"
          />
        </Field>
        <Field label="Gumroad URL">
          <Input
            type="url"
            value={gumroad}
            onChange={(e) => setGumroad(e.target.value)}
            placeholder="https://gumroad.com/l/…"
          />
        </Field>
      </div>
      <Field label="Critique notes (latest)">
        <Textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>
      {error && (
        <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <div
        className={cn(
          "flex items-center justify-between gap-2 pt-2",
        )}
      >
        <span className="text-2xs text-fg-muted">
          {savedAt
            ? `Saved at ${savedAt}`
            : dirty
              ? "Unsaved changes"
              : "Up to date"}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={!dirty || isPending}
            onClick={reset}
          >
            Discard
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!dirty || isPending}
          >
            <Save className="h-3.5 w-3.5" />
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
