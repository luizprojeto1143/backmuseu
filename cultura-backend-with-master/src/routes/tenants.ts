import { Router } from "express";
import { AppDataSource } from "../utils/data-source";
import { Tenant } from "../entities/Tenant";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

router.get("/", async (req, res) => {
  const repo = AppDataSource.getRepository(Tenant);
  const tenants = await repo.find();
  res.json(tenants);
});

router.get("/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Tenant);
  const tenant = await repo.findOne({ where: { id: req.params.id } });
  if (!tenant) return res.status(404).json({ error: "Tenant não encontrado" });
  res.json(tenant);
});

router.put("/:id/settings", authMiddleware, requireRole("admin"), async (req, res) => {
  const repo = AppDataSource.getRepository(Tenant);
  const tenant = await repo.findOne({ where: { id: req.params.id } });
  if (!tenant) return res.status(404).json({ error: "Tenant não encontrado" });

  const allowed = ["theme_color", "custom_categories", "persona_config", "description", "logo_url"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) (tenant as any)[key] = req.body[key];
  });

  await repo.save(tenant);
  res.json(tenant);
});

router.post("/", authMiddleware, requireRole("master"), async (req, res) => {
  const repo = AppDataSource.getRepository(Tenant);
  const t = repo.create(req.body);
  await repo.save(t);
  res.status(201).json(t);
});

router.delete("/:id", authMiddleware, requireRole("master"), async (req, res) => {
  const repo = AppDataSource.getRepository(Tenant);
  await repo.delete(req.params.id);
  res.json({ ok: true });
});

export default router;
