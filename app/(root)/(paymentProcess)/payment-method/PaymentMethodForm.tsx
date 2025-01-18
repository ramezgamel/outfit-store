"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "../SubmitButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { toast } from "sonner";

const PaymentMethodForm = ({
  preferredMethod,
}: {
  preferredMethod: string | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredMethod || DEFAULT_PAYMENT_METHOD,
    },
  });
  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);
      if (!res.success) {
        toast.error(res.msg);
        return;
      }
      router.push("/place-order");
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4 text-center">Payment Method</h1>
      <p className="text-sm text-center text-muted-foreground">
        Please set payment method
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-2"
                  >
                    {PAYMENT_METHODS.map((p) => (
                      <FormItem
                        key={p}
                        className="flex items-center space-y-0 space-x-3"
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={p}
                            checked={field.value === p}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {p}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <SubmitButton btnName="Continue" isPending={isPending} />
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;
