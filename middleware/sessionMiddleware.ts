import { NextFunction, Request, Response } from "express";
import { updateData } from "../database";

export function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    updateData(req.session.user);
  }
  next();
}
