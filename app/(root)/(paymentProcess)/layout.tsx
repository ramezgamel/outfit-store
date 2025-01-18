"use client";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { usePathname } from "next/navigation";

const PaymentProcessLayout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const paths = [
    "/user-login",
    "/shipping-address",
    "/payment-method",
    "/place-order",
  ];
  const index: number = paths.indexOf(pathName);

  return (
    <>
      <CheckoutSteps cur={index} />
      <section>{children}</section>
    </>
  );
};

export default PaymentProcessLayout;
