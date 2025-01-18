"use client";

import { ShippingAddress } from "@/types";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { shippingAddressSchema } from "@/lib/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmitButton from "../SubmitButton";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || {
      fullName: "",
      streetAddress: "",
      city: "",
    },
  });

  function onSubmit(values: z.infer<typeof shippingAddressSchema>) {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast.error(res.msg);
        return;
      }
      router.push("/payment-method");
    });
  }

  return (
    <Form {...form}>
      <form
        className="max-w-md mx-auto space-y-4"
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="h2-bold mt-4 text-center">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter an address to ship to
        </p>
        <FormFieldInput name="fullName" label="Full Name" form={form} />
        <FormFieldInput
          name="streetAddress"
          label="Street Address"
          form={form}
        />
        <FormFieldInput name="city" label="City" form={form} />
        <SubmitButton isPending={isPending} btnName="Continue" />
      </form>
    </Form>
  );
};

const FormFieldInput = ({
  name,
  label,
  form,
}: {
  name: "fullName" | "streetAddress" | "city" | "lat" | "lng";
  label: string;
  form: UseFormReturn<z.infer<typeof shippingAddressSchema>>;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
export default ShippingAddressForm;
