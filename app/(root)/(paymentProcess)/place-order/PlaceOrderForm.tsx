"use client";

import { useFormStatus } from "react-dom";
import SubmitButton from "../SubmitButton";
import { createOrder } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";

const PlaceOrderForm = () => {
  const { pending } = useFormStatus();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <SubmitButton isPending={pending} btnName="Place Order" />
    </form>
  );
};

export default PlaceOrderForm;
