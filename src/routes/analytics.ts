import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { UserProgress } from "../entities/UserProgress";
import { Point } from "../entities/Point";
import { Review } from "../entities/Review";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

router.get("/", authMiddleware, requireRole("admin"), async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  if (!tenantId) return res.status(400).json({ error: "tenantId é obrigatório" });

  const progressRepo = AppDataSource.getRepository(UserProgress);
  const pointsRepo = AppDataSource.getRepository(Point);
  const reviewRepo = AppDataSource.getRepository(Review);

  const [progress, points, reviews] = await Promise.all([
    progressRepo.find({ where: { tenant_id: tenantId } }),
    pointsRepo.find({ where: { tenant_id: tenantId } }),
    reviewRepo.find({ where: { tenant_id: tenantId } }),
  ]);

  const totalVisitors = new Set(progress.map((p) => p.user_id)).size;
  const totalVisits = progress.reduce((sum, p) => sum + (p.visited_points?.length || 0), 0);
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : null;

  res.json({
    totalVisitors,
    totalVisits,
    pointsCount: points.length,
    reviewsCount: reviews.length,
    avgRating,
  });
});

export default router;
