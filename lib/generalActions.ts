import { prisma } from "@/db/prisma";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email: email as string,
    },
  });
};

export const updateUserById = async (id: string, data: any) => {
  await prisma.user.update({
    where: { id: id },
    data: { name: data.name },
  });
};

export const findCartById = async (id: string) => {
  return await prisma.cart.findFirst({
    where: { id },
  });
};
export const deleteCartByUserId = async (id: string) => {
  await prisma.cart.deleteMany({
    where: { userId: id },
  });
};
export const updateCartById = async (sessionCartId: string, userId: any) => {
  await prisma.cart.update({
    where: { id: sessionCartId },
    data: { userId: userId },
  });
};
