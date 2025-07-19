import { Request, Response, NextFunction } from "express";
import {jwtService} from "./JWT/jwtService";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.sendStatus(401)
        return;
    };

    const token = authHeader.split(' ')[1];
    const payload = jwtService.verifyToken(token);
    if (!payload) {
       res.sendStatus(401)
        return;
    }

    req.user = payload; // нужно расширить тип Request для TypeScript
    next();
}