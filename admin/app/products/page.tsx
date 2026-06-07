import { PageHeader } from "@/components/page-header";
import { ProductTable } from "@/components/product-table";
import { AddProductButton } from "@/components/add-product-button";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { getProductsServer, isMockMode } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProductsServer();
  const mock = isMockMode();

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Every product in the empire, line by line. Sort, filter, and click through to edit."
        actions={<AddProductButton />}
      />
      {mock ? (
        <div className="mb-3">
          <span className="chip chip-accent">mock mode</span>
          <span className="ml-2 text-xs text-fg-muted">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>admin/.env.local</code> to
            read from a real database.
          </span>
        </div>
      ) : null}
      {products.length === 0 ? (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>No products yet</CardTitle>
              <CardDescription>
                Add your first product to start tracking sales, reviews, and production events.
              </CardDescription>
            </div>
            <AddProductButton />
          </CardHeader>
          <CardBody>
            <p className="text-sm text-fg-muted">
              You can also seed the catalog from the operator pipeline at{" "}
              <Link href="/" className="underline">
                <code>/</code>
              </Link>
              , or import the existing products in <code>products/</code> with the CLI under{" "}
              <code>scripts/</code>.
            </p>
          </CardBody>
        </Card>
      ) : (
        <ProductTable products={products} />
      )}
    </>
  );
}
