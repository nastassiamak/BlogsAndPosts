import {Request, Response} from 'express';
import {MeViewModel} from "./me";
import {HttpStatus} from "../../core/types/httpStatus";

export async function meHandler(req: Request, res: Response) {
    if (!req.userId) {
        res.sendStatus(401);
    }

    const user = {

    };

    res.status(HttpStatus.Ok).json(user);
}