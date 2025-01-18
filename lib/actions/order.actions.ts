"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { convertToPlainObj, formatErr } from "../utils";
import { prisma } from "@/db/prisma";
import { OrderItem } from "@/types";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("You are not authorized");
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");
    const user = await getUserById(userId);
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0)
      return { success: false, msg: "Your cart is empty", redirectTo: "/cart" };
    if (!user.address)
      return {
        success: false,
        msg: "No shipping address",
        redirectTo: "/shipping-address",
      };
    if (!user.paymentMethod)
      return {
        success: false,
        msg: "No Payment method",
        redirectTo: "/payment-method",
      };
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({
        data: order,
      });
      cart.items.map(async (item: OrderItem) => {
        await tx.orderItem.create({
          data: { ...item, price: item.price, orderId: insertedOrder.id },
        });
      });
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });
      return insertedOrder.id;
    });
    if (!insertedOrderId) throw new Error("Order not created");
    return {
      success: true,
      msg: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (err) {
    if (!isRedirectError(err)) throw err;
    return { success: false, msg: formatErr(err) };
  }
}

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItem: true, user: { select: { name: true, email: true } } },
  });
  return convertToPlainObj(data);
}
