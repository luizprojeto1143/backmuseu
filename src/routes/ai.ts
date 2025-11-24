import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth";
import {
  aiGenerateSmartDescription,
  aiChatWithGuide,
  aiGenerateSouvenir,
} from "../services/aiEngine";

const router = Router();

router.post("/description", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { artworkName, context, tenantId } = req.body;
    if (!artworkName || !context) {
      return res.status(400).json({ error: "artworkName e context são obrigatórios" });
    }
    const text = await aiGenerateSmartDescription({ artworkName, context, tenantId });
    res.json({ text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Erro na IA (description)", details: err.message });
  }
});

router.post("/chat", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { tenantId, history, message, tenantPoints } = req.body;
    if (!tenantId || !message) {
      return res.status(400).json({ error: "tenantId e message são obrigatórios" });
    }

    const simpleHistory =
      (history || []).map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        text: h.parts?.[0]?.text || h.text || "",
      })) || [];

    const titles =
      (tenantPoints || []).map((p: any) => p.title).filter(Boolean) || [];

    const text = await aiChatWithGuide({
      tenantId,
      history: simpleHistory,
      message,
      knownPointsTitles: titles,
    });

    res.json({ text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Erro na IA (chat)", details: err.message });
  }
});

router.post("/souvenir", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { userName, visitedTitles, tenantName } = req.body;
    if (!userName || !visitedTitles?.length || !tenantName) {
      return res.status(400).json({
        error: "userName, visitedTitles e tenantName são obrigatórios",
      });
    }

    const text = await aiGenerateSouvenir({
      userName,
      visitedTitles,
      tenantName,
    });
    res.json({ text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Erro na IA (souvenir)", details: err.message });
  }
});

export default router;
