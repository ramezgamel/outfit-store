"use client";

import OrderItemsTable from "@/components/shared/OrderItemsTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";

const OrderDetailsTable = ({ order }: { order: Order }) => {
  return (
    <>
      <h1 className="py-4 text-2xl">Order: {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="pb-4 text-xl">Payment Method</h2>
              <p className="mb-2">{order.paymentMethod}</p>
              {order.isPaid ? (
                <Badge variant={"secondary"}>
                  Paid at {formatDateTime(order.paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={"destructive"}>Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="pb-4 text-xl">Shipping Address</h2>
              <p>{order.shippingAddress.fullName}</p>
              <p className="mb-2">
                {order.shippingAddress.streetAddress},{" "}
                {order.shippingAddress.city}
              </p>
              {order.isDelivered ? (
                <Badge variant={"secondary"}>
                  Delivered at {formatDateTime(order.deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={"destructive"}>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <OrderItemsTable items={order.orderItem} />
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                Items: <div>{order.itemsPrice}</div>
              </div>
              <div className="flex justify-between">
                Shipping: <div>{order.shippingPrice}</div>
              </div>
              <div className="flex justify-between">
                Tax: <div>{order.taxPrice}</div>
              </div>
              <hr />
              <div className="flex justify-between">
                Total: <div>{order.totalPrice}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
