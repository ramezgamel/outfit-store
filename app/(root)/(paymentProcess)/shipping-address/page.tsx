import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./ShippinAdressForm";
import { ShippingAddress } from "@/types";

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/cart");
  const session = await auth();
  if (session?.user?.id === undefined) redirect("/sign-in");
  const user = await getUserById(session?.user?.id);
  if (!user) redirect("/sign-up");
  return <ShippingAddressForm address={user.address as ShippingAddress} />;
};

export default ShippingAddressPage;
