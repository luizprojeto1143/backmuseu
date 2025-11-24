import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { Review } from "../entities/Review";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

router.get("/", async (req, res) => {
  const repo = AppDataSource.getRepository(Review);
  const tenantId = req.query.tenantId as string | undefined;
  const pointId = req.query.pointId as string | undefined;
  const where: any = {};
  if (tenantId) where.tenant_id = tenantId;
  if (pointId) where.point_id = pointId;
  const reviews = await repo.find({ where });
  res.json(reviews);
});

router.post("/", authMiddleware, async (req, res) => {
  const repo = AppDataSource.getRepository(Review);
  const { tenant_id, point_id, rating, comment } = req.body;
  const userId = (req as any).user?.id;
  const r = repo.create({
    tenant_id,
    point_id,
    rating,
    comment,
    user_id: userId,
  });
  await repo.save(r);
  res.status(201).json(r);
});

router.post("/:id/reply", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Review);
  const r = await repo.findOne({ where: { id: req.params.id } });
  if (!r) return res.status(404).json({ error: "Review não encontrada" });
  r.reply = req.body.reply;
  await repo.save(r);
  res.json(r);
});

router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Review);
  await repo.delete(req.params.id);
  res.json({ ok: true });
});

export default router;
