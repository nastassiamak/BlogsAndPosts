import {Request, Response} from 'express';
import {MeViewModel} from "./me";
import {HttpStatus} from "../../core/types/httpStatus";

export async function meHandler(req: Request, res: Response) {
    if (!req.user) {
        res.sendStatus(401);
    }

    const user: MeViewModel = {
        userId: req.user.userId,
        login: req.user.login,
        email: req.user.email,
    };

    res.status(HttpStatus.Ok).json(user);
}