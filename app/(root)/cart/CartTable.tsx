"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleAddToCart = async (item: CartItem) => {
    startTransition(async () => {
      const res = await addToCart(item);
      if (!res.success) {
        toast.error(res.msg);
        return;
      }

      toast.success(`${item.name} added to cart`);
    });
  };
  const handleRemoveFromCart = async (prdId: string) => {
    startTransition(async () => {
      const res = await removeFromCart(prdId);
      if (!res.success) {
        toast.error(res.msg);
        return;
      }

      toast.success(res.msg);
    });
  };
  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>{" "}
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          width={50}
                          height={50}
                          alt={item.name}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => handleAddToCart(item)}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl ">
                Subtotal ({cart.items.reduce((acc, i) => acc + i.qty, 0)}):{" "}
                <span className="font-bold">{cart?.itemsPrice}</span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                type="button"
                onClick={() =>
                  startTransition(async () => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" /> To Checkout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
