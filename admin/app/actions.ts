"use server";

import { revalidatePath } from "next/cache";

import {
  createProductServer,
  moveProductStatusServer,
  updateProductServer,
} from "@/lib/supabase-server";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/supabase-server";
import type { ProductStatus } from "@/lib/types";

export async function createProductAction(input: CreateProductInput) {
  const product = await createProductServer(input);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/queue");
  return product;
}

export async function updateProductAction(
  id: string,
  input: UpdateProductInput,
) {
  await updateProductServer(id, input);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/queue");
  revalidatePath(`/products`);
}

export async function moveProductStatusAction(
  id: string,
  status: ProductStatus,
) {
  await moveProductStatusServer(id, status);
  revalidatePath("/queue");
  revalidatePath("/");
  revalidatePath("/products");
}
