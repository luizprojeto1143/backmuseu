import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "No token provided" });

  const [, token] = authHeader.split(" ");

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "devsecret"   // 🔥 CORRIGIDO
    ) as any;

    req.user = {
      id: Number(payload.id),
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
