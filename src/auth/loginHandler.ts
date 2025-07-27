import { Request, Response } from "express";
import { HttpStatus } from "../core/types/httpStatus";
import {userService} from "../users/application/userService";
import {jwtService} from "./JWT/jwtService";
import {mapToUserOutput} from "../users/routers/mappers/mapToUserOutput";
import {BusinessRuleError} from "../core/errors/businessRuleError";


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
    if (error instanceof BusinessRuleError) {
      res.status(HttpStatus.BadRequest).json({
        errorsMessages:
            error.errors.errorsMessages.length > 0
                ? error.errors.errorsMessages
                : [{ message: error.message, field: "" }],
      });
    }
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}