// =============================================================================
// Product registry — every product the empire has, in one place
// =============================================================================
// Read from disk: scan products/ for every subfolder, parse metadata.json.
// The CLI uses this to drive ship, produce, list, stats.
// =============================================================================

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

export type Product = {
  slug: string;
  line: "notion" | "canva" | "prompts" | "spreadsheets" | "resume";
  name: string;
  price: number; // USD
  status: "idea" | "spec" | "built" | "critiqued" | "fixed" | "listed" | "archived";
  buildDate?: string;
  paths: {
    root: string;
    readme: string;
    listingTitle: string;
    listingDescription: string;
    listingTags: string;
    coverPrompt: string;
    mockupPrompts: string;
    metadata: string;
  };
  stats?: {
    sales: number;
    revenue: number;
    rating: number;
    reviews: number;
  };
};

const LINES: Product["line"][] = ["notion", "canva", "prompts", "spreadsheets", "resume"];

export function all(): Product[] {
  const products: Product[] = [];
  const root = join(process.cwd(), "products");

  for (const line of LINES) {
    const lineDir = join(root, line);
    if (!existsSync(lineDir)) continue;
    const slugs = readdirSync(lineDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const slug of slugs) {
      const product = load(`${line}/${slug}`);
      if (product) products.push(product);
    }
  }
  return products;
}

export function load(slug: string): Product | null {
  const root = join(process.cwd(), "products", slug);
  if (!existsSync(root)) return null;
  const metaPath = join(root, "metadata.json");
  if (!existsSync(metaPath)) return null;

  let meta: any;
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf-8"));
  } catch {
    return null;
  }

  return {
    slug,
    line: meta.line || slug.split("/")[0] as Product["line"],
    name: meta.name || slug,
    price: meta.price || 0,
    status: meta.status || "spec",
    buildDate: meta.build_date,
    paths: {
      root,
      readme: join(root, "README.md"),
      listingTitle: join(root, "listing/title.md"),
      listingDescription: join(root, "listing/description.md"),
      listingTags: join(root, "listing/tags.md"),
      coverPrompt: join(root, "cover-prompt.md"),
      mockupPrompts: join(root, "mockup-prompts.md"),
      metadata: metaPath,
    },
  };
}

export function byLine(line: Product["line"]): Product[] {
  return all().filter((p) => p.line === line);
}

export function byStatus(status: Product["status"]): Product[] {
  return all().filter((p) => p.status === status);
}

export function update(slug: string, patch: Partial<Product>): boolean {
  const product = load(slug);
  if (!product) return false;
  const updated = { ...product, ...patch };
  require("fs").writeFileSync(
    product.paths.metadata,
    JSON.stringify(
      {
        slug: updated.slug,
        line: updated.line,
        name: updated.name,
        price: updated.price,
        status: updated.status,
        build_date: updated.buildDate,
        ...(patch as any),
      },
      null,
      2
    )
  );
  return true;
}
