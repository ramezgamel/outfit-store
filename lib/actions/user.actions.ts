/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { formatErr } from "../utils";
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
    user.password = hashSync(user.password, 10);
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
