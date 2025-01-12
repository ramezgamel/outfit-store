import { insertProductSchema } from "@/lib/validtors";
import { z } from "zod";
export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: number;
  createdAt: Date;
};
