import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { UserProgress } from "../entities/UserProgress";

const router = Router();

router.post("/sync", async (req, res) => {
  try {
    const { userId, tenantId, progress } = req.body;

    if (!userId || !tenantId || !progress) {
      return res.status(400).json({ error: "Missing data" });
    }

    const repo = AppDataSource.getRepository(UserProgress);

    let record = await repo.findOne({
      where: { user_id: userId, tenant_id: tenantId },
    });

    if (!record) {
      record = repo.create({
        user_id: userId,
        tenant_id: tenantId,
      });
    }

    record.xp = progress.xp ?? 0;
    record.level = progress.level ?? 1;
    record.visited_points = progress.visitedPointIds ?? [];
    record.solved_riddles = progress.solvedRiddleIds ?? [];
    record.unlocked_achievements = progress.unlockedAchievementIds ?? [];
    record.collected_stamps = progress.collectedStamps ?? [];
    record.reviews_count = progress.reviewsCount ?? 0;
    record.souvenir = progress.souvenir ?? null;

    await repo.save(record);

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
