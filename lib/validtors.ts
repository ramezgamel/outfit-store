import { z } from "zod";
import { formatNumWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^d+(\.\d{2})?$/.test(formatNumWithDecimal(Number(value))),
    "Price must have two decimal places"
  );
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must at least 3 characters"),
  slug: z.string().min(3, "Slug must at least 3 characters"),
  category: z.string().min(3, "Category must at least 3 characters"),
  brand: z.string().min(3, "Brand must at least 3 characters"),
  description: z.string().min(3, "Description must at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
