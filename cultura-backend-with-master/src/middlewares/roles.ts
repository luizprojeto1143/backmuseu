import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const requireRole = (role: "admin" | "master") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== role && !(role === "admin" && req.user.role === "master")) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
