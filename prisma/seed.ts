import { generateNanoId } from "../src/lib/db/generateNanoId";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("12345678", 10);

  const adminAlreadyExists = await prisma.users.findUnique({ where: { email: "admin@admin.com.br" } });
  if (adminAlreadyExists) {
    console.log("Admin already seeded!");
    return;
  }
  await prisma.users.create({
    data: {
      id: generateNanoId(),
      email: "admin@admin.com.br",
      name: "Admin",
      passwordHash: passwordHash,
      role: "admin"
    }
  });
  console.log("Usuário Admin foi inserido com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
