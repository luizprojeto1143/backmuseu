import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { UserProgress } from "../entities/UserProgress";
import { authMiddleware, AuthRequest } from "../middlewares/auth";

const router = Router();

// obter progresso por tenant (usa user do token e tenantId na URL)
router.get("/progress/:tenantId", authMiddleware, async (req: AuthRequest, res) => {
  const repo = AppDataSource.getRepository(UserProgress);
  const userId = req.user!.id;
  const tenantId = req.params.tenantId;
  const progress = await repo.findOne({ where: { user_id: userId, tenant_id: tenantId } });
  res.json(progress || null);
});

// sincronizar progresso vindo do front
router.post("/progress/sync", authMiddleware, async (req: AuthRequest, res) => {
  const repo = AppDataSource.getRepository(UserProgress);
  const userId = req.user!.id;
  const { tenantId, xp, level, visited_points, solved_riddles, unlocked_achievements, souvenir_text } =
    req.body;

  let progress = await repo.findOne({ where: { user_id: userId, tenant_id: tenantId } });
  if (!progress) {
    progress = repo.create({ user_id: userId, tenant_id: tenantId, xp: 0, level: 1 });
  }

  if (xp !== undefined) progress.xp = xp;
  if (level !== undefined) progress.level = level;
  if (visited_points) progress.visited_points = visited_points;
  if (solved_riddles) progress.solved_riddles = solved_riddles;
  if (unlocked_achievements) progress.unlocked_achievements = unlocked_achievements;
  if (souvenir_text !== undefined) progress.souvenir_text = souvenir_text;

  await repo.save(progress);
  res.json(progress);
});

export default router;
