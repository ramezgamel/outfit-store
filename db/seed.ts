import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";
import { hash } from "@/lib/encrypt";

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });
  for (const user in sampleData.users) {
    sampleData.users[user].password = await hash(
      sampleData.users[user].password
    );
  }
  await prisma.user.createMany({ data: sampleData.users });
  console.log("Data base created");
}

main();
