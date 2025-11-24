import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

// 🔥 Agora importando o arquivo RENOMEADO
import authRoutes from "./routes/authRoutes";

import tenantRoutes from "./routes/tenants";
import pointsRoutes from "./routes/points";
import trailsRoutes from "./routes/trails";
import eventsRoutes from "./routes/events";
import reviewsRoutes from "./routes/reviews";
import aiRoutes from "./routes/ai";
import userProgressRoutes from "./routes/userProgress";
import uploadRoutes from "./routes/upload";
import analyticsRoutes from "./routes/analytics";

// 🔥 IMPORTAR A NOVA ROTA DE SINCRONIZAÇÃO REAL
import userProgressSyncRoutes from "./routes/userProgressSync";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// servir uploads estáticos
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.join(process.cwd(), uploadDir)));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// 🔥 Agora usando a rota correta renomeada
app.use("/api/auth", authRoutes);

app.use("/api/tenants", tenantRoutes);
app.use("/api/points", pointsRoutes);
app.use("/api/trails", trailsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/ai", aiRoutes);

// 🔥 ROTA ANTIGA — PODE MANTER
app.use("/api/users", userProgressRoutes);

// 🔥 ROTA NOVA — PROGRESSO REAL /sync
app.use("/api/users/progress", userProgressSyncRoutes);

app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
