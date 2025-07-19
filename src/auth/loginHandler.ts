import { Request, Response } from "express";
import { authService } from "./authService";
import { HttpStatus } from "../core/types/httpStatus";
import {userService} from "../users/application/userService";
import {jwtService} from "./JWT/jwtService";
import {mapToUserOutput} from "../users/routers/mappers/mapToUserOutput";

export async function loginHandler(req: Request, res: Response) {
  const { loginOrEmail, password } = req.body;

  const isValid = await authService.checkCredentials(loginOrEmail, password);

  if (!isValid) {
    res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
  }

  const user = await userService.findByLoginOrEmail(loginOrEmail);
  if (!user) {
    res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
  }

  const userDto = mapToUserOutput(user);

  const token = jwtService.generateToken({
    userId: userDto.id,
    login: loginOrEmail,
    email: userDto.email,
  });
  res.json({ accessToken: token });
}
