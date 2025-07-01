import {Router} from "express";
import {superAdminGuardMiddleware} from "../../auth/middlewares/superAdminGuardMiddleware";

export const usersRouter = Router({});

usersRouter
    .get("/",
        )
    .post("/",
        superAdminGuardMiddleware,
        )