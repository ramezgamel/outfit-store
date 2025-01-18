import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Cart } from "@/types";
import PlaceOrderForm from "./PlaceOrderForm";
import OrderItemsTable from "@/components/shared/OrderItemsTable";
export const metadata = {
  title: "Place Order",
};
const PlaceOrder = async () => {
  const cart: Cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");
  const user = await getUserById(userId);
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");
  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-2xl pb-4">Shipping address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}
              </p>
              <div className="mt-3">
                <Link href="shipping-address">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-2xl pb-4">Payment Method</h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Link href="payment-method">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-2xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((i) => (
                    <TableRow key={i.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${i.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={i.image}
                            width={50}
                            height={50}
                            alt={i.name}
                          />
                          <span className="px-2">{i.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{i.qty}</span>
                      </TableCell>
                      <TableCell>{i.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card> */}
          <OrderItemsTable items={cart.items} />
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                Items: <div>{cart.itemsPrice}</div>
              </div>
              <div className="flex justify-between">
                Shipping: <div>{cart.shippingPrice}</div>
              </div>
              <div className="flex justify-between">
                Tax: <div>{cart.taxPrice}</div>
              </div>
              <hr />
              <div className="flex justify-between">
                Total: <div>{cart.totalPrice}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
