import { Router } from "express";
import { loginHandler } from "./loginHandler";
import { inputValidationResultMiddleware } from "../core/middlewares/validation/inputValidationResultMiddleware";
import { authValidator } from "./authValidation";
import {authMiddleware} from "./authMiddleware";
import {meHandler} from "./JWT/meHandler";

export const authRouter = Router({});

authRouter
    .post(
      "/login",
      authValidator,
      inputValidationResultMiddleware,
      loginHandler,
    )
    // .get(
    //     "/me",
    //     authMiddleware,
    //     authValidator,
    //     inputValidationResultMiddleware,
    //     meHandler,
    // )
