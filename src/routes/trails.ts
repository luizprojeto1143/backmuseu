import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { Trail } from "../entities/Trail";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

router.get("/", async (req, res) => {
  const repo = AppDataSource.getRepository(Trail);
  const tenantId = req.query.tenantId as string | undefined;
  const where = tenantId ? { tenant_id: tenantId } : {};
  const trails = await repo.find({ where });
  res.json(trails);
});

router.post("/", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Trail);
  const t = repo.create(req.body);
  await repo.save(t);
  res.status(201).json(t);
});

router.put("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Trail);
  const t = await repo.findOne({ where: { id: req.params.id } });
  if (!t) return res.status(404).json({ error: "Trilha não encontrada" });
  Object.assign(t, req.body);
  await repo.save(t);
  res.json(t);
});

router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Trail);
  await repo.delete(req.params.id);
  res.json({ ok: true });
});

export default router;
