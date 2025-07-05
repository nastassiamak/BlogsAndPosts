import {Request, Response,Router} from "express";
import {userService} from "../users/application/userService";
import {HttpStatus} from "../core/types/httpStatus";

export const authSRouter = Router({});

authSRouter.post("/",
    async (req: Request, res: Response) => {
    const checkResult =
        await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
        if (!checkResult) {
            res.sendStatus(HttpStatus.Unauthorized)
        } else {
            res.sendStatus(HttpStatus.NoContent)
        }
    })