import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { Point } from "../entities/Point";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

router.get("/tenant/:tenantId", async (req, res) => {
  const repo = AppDataSource.getRepository(Point);
  const points = await repo.find({ where: { tenant_id: req.params.tenantId } });
  res.json(points);
});

router.post("/", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Point);
  const payload = req.body;

  const existing = await repo.findOne({
    where: { tenant_id: payload.tenant_id, number_code: payload.number_code },
  });
  if (existing) {
    return res.status(409).json({ error: "number_code já utilizado para este tenant" });
  }

  const p = repo.create(payload);
  await repo.save(p);
  res.status(201).json(p);
});

router.put("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Point);
  const point = await repo.findOne({ where: { id: req.params.id } });
  if (!point) return res.status(404).json({ error: "Ponto não encontrado" });

  Object.assign(point, req.body);
  await repo.save(point);
  res.json(point);
});

router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Point);
  await repo.delete(req.params.id);
  res.json({ ok: true });
});

export default router;
