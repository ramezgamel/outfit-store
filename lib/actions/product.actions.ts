"use server";
import { convertToPlainObj } from "../utils";
import { LATEST_PRODUCT_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT as number,
    orderBy: { createdAt: "desc" },
  });
  return convertToPlainObj(data);
}

export async function getProduct(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
