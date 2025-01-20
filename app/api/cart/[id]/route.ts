import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const cart = await prisma.cart.findFirst({
    where: { id },
  });
  return NextResponse.json(cart);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  await prisma.cart.deleteMany({
    where: { userId: id },
  });
  return NextResponse.json({ success: true });
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const body = await req.json();
  await prisma.cart.update({
    where: { id: id },
    data: { userId: body.userId as string },
  });
  return NextResponse.json({ success: true });
}
