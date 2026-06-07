"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./button";
import { AddProductModal } from "./add-product-modal";

export function AddProductButton({ label = "Add product" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        {label}
      </Button>
      <AddProductModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
