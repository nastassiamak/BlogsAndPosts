import {Router} from "express";
import {loginHandler} from "./loginHandler";
import {superAdminGuardMiddleware} from "./middlewares/superAdminGuardMiddleware";
import {inputValidationResultMiddleware} from "../core/middlewares/validation/inputValidationResultMiddleware";

export const authRouter = Router({});

authRouter
    .post(
        "/login",
        superAdminGuardMiddleware,
        inputValidationResultMiddleware,
        loginHandler)