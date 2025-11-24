import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User";

const router = Router();

const jwtSecret = process.env.JWT_SECRET ?? "devsecret";

// -------------------------------------
// Registro
// -------------------------------------
router.post("/register", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const { name, email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios" });

  const existing = await userRepo.findOne({ where: { email } });
  if (existing)
    return res.status(409).json({ error: "Email já cadastrado" });

  const password_hash = await bcrypt.hash(password, 10);

  const user = userRepo.create({ name, email, password_hash });
  await userRepo.save(user);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    jwtSecret,
    { expiresIn: "7d" }   // 🔥 FIX DEFINITIVO
  );

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// -------------------------------------
// Login
// -------------------------------------
router.post("/login", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios" });

  const user = await userRepo.findOne({ where: { email } });
  if (!user)
    return res.status(401).json({ error: "Credenciais inválidas" });

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword)
    return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    jwtSecret,
    { expiresIn: "7d" }   // 🔥 FIX DEFINITIVO
  );

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

export default router;
