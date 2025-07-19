import { Request, Response } from "express";
import { authService } from "./authService";
import { HttpStatus } from "../core/types/httpStatus";
import {userService} from "../users/application/userService";
import {jwtService} from "./JWT/jwtService";
import {mapToUserOutput} from "../users/routers/mappers/mapToUserOutput";


export async function loginHandler(req: Request, res: Response) {
  try {
    const { loginOrEmail, password } = req.body;

    const isValid = await authService.checkCredentials(loginOrEmail, password);

    // Валидация входных типов
    if (typeof loginOrEmail !== "string" || typeof password !== "string") {
      res.status(HttpStatus.BadRequest).json({ message: "Invalid input data" });
      return;
    }

    if (!isValid) {
      res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
      return;
    }

    const user = await userService.findByLoginOrEmail(loginOrEmail);
    if (!user) {
       res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
       return;
    }

    const userDto = mapToUserOutput(user);

    const token = jwtService.generateToken({
      userId: userDto.id,
      login: loginOrEmail,
      email: userDto.email,
    });

     res.status(HttpStatus.Ok).json({ accessToken: token });

  } catch (error) {
    console.error(error);
    res.status(HttpStatus.Unauthorized).json({ message: "internal server error" });
  }
}