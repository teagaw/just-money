import { PageHeader } from "@/components/page-header";
import { ProductTable } from "@/components/product-table";
import { AddProductButton } from "@/components/add-product-button";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Every product in the empire, line by line. Sort, filter, and click through to edit."
        actions={<AddProductButton />}
      />
      <ProductTable products={MOCK_PRODUCTS} />
    </>
  );
}
