import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { UserProgress } from "../entities/UserProgress";
import { AuthRequest } from "../middlewares/auth";

const router = Router();

// -------------------------------------
// Criar ou atualizar progresso
// -------------------------------------
router.post("/", async (req: AuthRequest, res) => {
  const progressRepo = AppDataSource.getRepository(UserProgress);
  const { tenant_id, viewed_items } = req.body;

  if (!req.user)
    return res.status(401).json({ error: "Unauthorized" });

  const user_id = Number(req.user.id); // 🔥 NUMBER

  let existing = await progressRepo.findOne({
    where: { user_id, tenant_id },
  });

  if (!existing) {
    existing = progressRepo.create({
      user_id,
      tenant_id,
      viewed_items,
    });
  } else {
    existing.viewed_items = viewed_items;
  }

  await progressRepo.save(existing);

  return res.json(existing);
});

// -------------------------------------
// Obter progresso do usuário
// -------------------------------------
router.get("/:tenant_id", async (req: AuthRequest, res) => {
  const progressRepo = AppDataSource.getRepository(UserProgress);
  const { tenant_id } = req.params;

  if (!req.user)
    return res.status(401).json({ error: "Unauthorized" });

  const user_id = Number(req.user.id); // 🔥 NUMBER

  const progress = await progressRepo.findOne({
    where: { user_id, tenant_id },
  });

  return res.json(progress || {});
});

export default router;
