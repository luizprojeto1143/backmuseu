
import { AppDataSource } from "./data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

export async function ensureMasterUser() {
  const repo = AppDataSource.getRepository(User);

  const existing = await repo.findOne({ where: { role: "master" } });
  if (existing) return;

  const password_hash = await bcrypt.hash("Qs@1143*", 10);

  const master = repo.create({
    name: "Master Admin",
    email: "Qsinclusao@gmail.com",
    password_hash,
    role: "master",
  });

  await repo.save(master);
  console.log("👑 Usuário master criado automaticamente.");
}
