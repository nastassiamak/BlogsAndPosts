import { Request, Response, NextFunction } from "express";
import { jwtService } from "./JWT/jwtService";
import { HttpStatus } from "../core/types/httpStatus";
import { userService } from "../users/application/userService";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.headers.authorization) {
    res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
    return;
  }

  const userIdFromToken = await jwtService.getUserIdByToken(token);
  if (!userIdFromToken) {
    res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
    return;
  }

  const user = await userService.findByIdOrFail(userIdFromToken);
  req.user = user;

  next();
}
