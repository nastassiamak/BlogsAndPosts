import {Router} from "express";
import {loginHandler} from "./loginHandler";
import {superAdminGuardMiddleware} from "./middlewares/superAdminGuardMiddleware";
import {inputValidationResultMiddleware} from "../core/middlewares/validation/inputValidationResultMiddleware";
import {authValidator} from "./authValidation";

export const authRouter = Router({});

authRouter
    .post(
        "/",
       // superAdminGuardMiddleware,
        authValidator,
        inputValidationResultMiddleware,
        loginHandler)