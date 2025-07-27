import { Request, Response } from "express";
import { HttpStatus } from "../core/types/httpStatus";
import {userService} from "../users/application/userService";
import {jwtService} from "./JWT/jwtService";
import {mapToUserOutput} from "../users/routers/mappers/mapToUserOutput";


export async function loginHandler(req: Request, res: Response) {
  try {
    const { loginOrEmail, password } = req.body;

    const user = await userService.checkCredentials(loginOrEmail, password);


    if (!user) {
      // Если пользователь не найден или пароль неверен
       res.status(HttpStatus.Unauthorized).json({ message: "Invalid login or password" });
    }

    // Можно при желании преобразовать user к виду для токена
    const userPayload = mapToUserOutput(user);

    const token = await jwtService.generateToken(userPayload);

    res.status(HttpStatus.Ok).json({ accessToken: token });

  } catch (error) {
    console.error(error);
    res.status(HttpStatus.Unauthorized).json({ message: "internal server error" });
  }
}