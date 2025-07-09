import {Request, Response} from "express";
import {HttpStatus} from "../core/types/httpStatus";
import {authService} from "./authService";

export async function loginHandler(
    req: Request,
    res: Response,
) {
    const {loginOrEmail, password} = req.body;

    if (!loginOrEmail || !password) {
         res.status(HttpStatus.BadRequest).json({
            errorsMessages: [
                { field: !loginOrEmail ? "loginOrEmail" : "password", message: (!loginOrEmail ? "loginOrEmail is required" : "password is required") }
            ],
        });
    }

    const credentialsOk = await authService.checkCredentials(loginOrEmail, password);

    if (!credentialsOk) {
        res.sendStatus(401);
    }

    res.sendStatus(204);
}