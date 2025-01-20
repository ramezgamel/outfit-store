"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { shippingAddressSchema } from "./../validators";
import { auth, signIn, signOut } from "@/auth";
import {
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
} from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";
import { formatErr } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import { hash } from "../encrypt";

export const signInWithCredentials = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, msg: "Signed in successfully" };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return { success: false, msg: "Invalid email or password" };
  }
};
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email: email as string,
    },
  });
};
export const signUserOut = async () => {
  await signOut();
};

export const signUpAction = async (prevState: any, formData: FormData) => {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      email: formData.get("email"),
    });
    const pass = user.password;

    user.password = await hash(user.password);
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });
    await signIn("credentials", {
      email: user.email,
      password: pass,
    });
    return { success: true, msg: "Account created successfully" };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return { success: false, msg: formatErr(err) };
  }
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("User id not found");
    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: session?.user?.id },
      data: {
        address: address,
      },
    });
    return {
      success: true,
      msg: "Updated user successfully",
    };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return { success: false, msg: formatErr(err) };
  }
};

export const updateUserPaymentMethod = async (
  data: z.infer<typeof paymentMethodSchema>
) => {
  try {
    const session = await auth();
    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: { id: session?.user?.id },
      data: { paymentMethod: paymentMethod.type },
    });
    return {
      success: true,
      msg: "User updated successfully",
    };
  } catch (err) {
    return { success: false, msg: formatErr(err) };
  }
};
