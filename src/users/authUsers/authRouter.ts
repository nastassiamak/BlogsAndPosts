import { Router } from "express";
import { loginHandler } from "./loginHandler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/superAdminGuardMiddleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/inputValidationResultMiddleware";
import { authValidator } from "./authValidation";

export const authRouter = Router({});

authRouter.post(
  "/",
  authValidator,
  inputValidationResultMiddleware,
  loginHandler,
);
