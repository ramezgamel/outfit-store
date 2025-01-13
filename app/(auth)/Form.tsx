/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const Form = ({
  formAction,
  children,
}: {
  formAction: (
    prevState: any,
    formData: FormData
  ) => Promise<{
    success: boolean;
    msg: string;
  }>;
  children: React.ReactNode;
}) => {
  const [data, action] = useActionState(formAction, {
    success: false,
    msg: "",
  });
  useEffect(() => {
    if (data.msg) {
      toast(data.msg);
    }
  }, [data]);
  return (
    <form className="space-y-6" action={action}>
      {children}
    </form>
  );
};

export default Form;
