import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  const user = await prisma.user.findFirst({
    where: {
      email: email as string,
    },
  });
  return NextResponse.json(user);
}
