import { Request, Response } from "express";
import { authService } from "./authService";
import { HttpStatus } from "../../core/types/httpStatus";

export async function loginHandler(req: Request, res: Response) {
  const { loginOrEmail, password } = req.body;

  const isValid = await authService.checkCredentials(loginOrEmail, password);

  if (!isValid) {
    res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
  }

  res.sendStatus(HttpStatus.NoContent);
}
