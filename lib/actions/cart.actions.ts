"use server";

import { CartItem } from "@/types";
import { convertToPlainObj, formatErr, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

const getSessionCartIdAndUserId = async () => {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");
  const session = await auth();
  const userId = (session?.user?.id as string) ?? undefined;
  return { sessionCartId, userId };
};

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const taxPrice = round2(itemsPrice * 0.15);
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const getMyCart = async () => {
  const { sessionCartId, userId } = await getSessionCartIdAndUserId();
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;

  return convertToPlainObj({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
};

export const addToCart = async (data: CartItem) => {
  try {
    const { sessionCartId, userId } = await getSessionCartIdAndUserId();
    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");
    if (!cart) {
      if (product.stock < 1) throw new Error("Not enough stock");
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      await prisma.cart.create({ data: newCart });
    } else {
      const existItem = (cart.items as CartItem[]).find(
        (i) => i.productId === item.productId
      );
      if (!existItem) {
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.items.push(item);
      } else {
        if (product.stock < existItem.qty + 1)
          throw new Error("Not enough stock");
        existItem.qty++;
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[]),
        },
      });
    }
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      msg: "Item Added to cart",
    };
  } catch (err) {
    return {
      success: false,
      msg: formatErr(err),
    };
  }
};

export const removeFromCart = async (productId: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");
    const existItem = (cart.items as CartItem[]).find(
      (i) => i.productId === productId
    );
    if (!existItem) throw new Error("This item not in cart");
    if (existItem.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (i) => i.productId !== productId
      );
    } else {
      (cart.items as CartItem[]).find((i) => i.productId == productId)!.qty =
        existItem.qty - 1;
    }
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      msg: `${product.name} removed from cart`,
    };
  } catch (err) {
    return {
      success: false,
      msg: formatErr(err),
    };
  }
};
