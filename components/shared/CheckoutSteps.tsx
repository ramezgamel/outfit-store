import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { Fragment } from "react";

const CheckoutSteps = ({ cur }: { cur: number }) => {
  return (
    <div className="flex-between flex-col space-x-2 space-y-2 mb-10 md:flex-row">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <Fragment key={step}>
            <div
              className={cn(
                "p-2 rounded-full text-center text-sm",
                cur == index && "bg-secondary",
                cur > index && "text-secondary flex items-center gap-1 "
              )}
            >
              {index < cur && <CheckCircle />}
              {step}
            </div>
            {step !== "Place Order" && (
              <hr className="w-16 border-t border-gray-300 mx-2" />
            )}
          </Fragment>
        )
      )}
    </div>
  );
};

export default CheckoutSteps;
