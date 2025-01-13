"use client";

import { Button } from "@/components/ui/button";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const handleAddToCart = async () => {
    const res = await addToCart(item);
    if (!res.success) {
      toast.error(res.msg);
      return;
    }

    toast.success(`${item.name} added to cart`);
  };
  const handleRemoveFromCart = async () => {
    const res = await removeFromCart(item.productId);
    if (!res.success) {
      toast.error(res.msg);
      return;
    }

    toast.success(res.msg);
  };
  const exist = cart?.items.find((i) => i.productId === item.productId);
  if (exist) {
    return (
      <div className="flex items-center">
        <Button
          type="button"
          variant={"outline"}
          onClick={handleRemoveFromCart}
        >
          <Minus />
        </Button>
        <span className="px-2">{exist.qty}</span>
        <Button type="button" variant={"outline"} onClick={handleAddToCart}>
          <Plus />
        </Button>
      </div>
    );
  }
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus />
      Add to card
    </Button>
  );
};

export default AddToCart;
