import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./OrderDetailsTable";
import { ShippingAddress } from "@/types";

export const metadata = {
  title: "Order Details",
};
const OrderDetails = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();
  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
    />
  );
};

export default OrderDetails;
