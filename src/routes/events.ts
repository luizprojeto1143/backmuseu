import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { Event } from "../entities/Event";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

router.get("/", async (req, res) => {
  const repo = AppDataSource.getRepository(Event);
  const tenantId = req.query.tenantId as string | undefined;
  const where = tenantId ? { tenant_id: tenantId } : {};
  const events = await repo.find({ where });
  res.json(events);
});

router.post("/", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Event);
  const e = repo.create(req.body);
  await repo.save(e);
  res.status(201).json(e);
});

router.put("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Event);
  const e = await repo.findOne({ where: { id: req.params.id } });
  if (!e) return res.status(404).json({ error: "Evento não encontrado" });
  Object.assign(e, req.body);
  await repo.save(e);
  res.json(e);
});

router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Event);
  await repo.delete(req.params.id);
  res.json({ ok: true });
});

export default router;
