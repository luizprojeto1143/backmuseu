import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", authMiddleware, requireRole("admin"), upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Arquivo não enviado" });
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({ url: publicUrl });
});

export default router;
