import { Request, Response } from "express";
import { HttpStatus } from "../core/types/httpStatus";
import {userService} from "../users/application/userService";
import {jwtService} from "./JWT/jwtService";
import {mapToUserOutput} from "../users/routers/mappers/mapToUserOutput";
import {BusinessRuleError} from "../core/errors/businessRuleError";
import {RepositoryNotFoundError} from "../core/errors/repositoryNotFoundError";


export async function loginHandler(req: Request, res: Response) {
  try {
    const { loginOrEmail, password } = req.body;

    const user = await userService.checkCredentials(loginOrEmail, password);


    if (!user) {
      // Если пользователь не найден или пароль неверен
      res.status(HttpStatus.Unauthorized).json({ message: "Invalid login or password" });
      return;
    }

    // Можно при желании преобразовать user к виду для токена
    const userPayload = mapToUserOutput(user);

    const token = await jwtService.generateToken(userPayload);

    res.status(HttpStatus.Ok).json({ accessToken: token });

  }  catch (error) {
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}