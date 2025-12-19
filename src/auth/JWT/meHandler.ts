import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/httpStatus";
import { userService } from "../../users/application/userService";
import { jwtService } from "./jwtService";

export async function meHandler(req: Request, res: Response): Promise<any> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Проверяем токен и получаем payload
    const payload = await jwtService.getUserIdByToken(token); // реализуйте verifyToken на jwtService

    if (!payload || !payload.userId) {
      res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
    }

    // Опционально: достать пользователя из базы, если нужна актуальная информация
    const user = await userService.findByIdOrFail(payload.userId);

    return res.status(HttpStatus.Ok).json({
      login: user.login,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("meHandler error:", error);
    res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
  }
}
