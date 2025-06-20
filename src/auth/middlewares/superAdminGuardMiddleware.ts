import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../core/types/httpStatus";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "qwerty";

export const superAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //console.log("Auth Middleware called on:", req.method, req.path);
  const auth = req.headers["authorization"] as string; //Basic xxx

  if (!auth) {
    res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
    return;
  }

  const [authType, token] = auth.split(" "); //admin:qwerty

  if (authType !== "Basic") {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const credentials = Buffer.from(token, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  next(); //успешная авторизация, продожаем
};
