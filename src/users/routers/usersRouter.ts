import {Router} from "express";
import {superAdminGuardMiddleware} from "../../auth/middlewares/superAdminGuardMiddleware";
import {userCreateInputValidation} from "./userInputDtoValodationMiddleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/inputValidationResultMiddleware";
import {createUserHandler} from "./handlers/createdUserHandler";

export const usersRouter = Router({});

usersRouter

    .post("/",
        superAdminGuardMiddleware,
        userCreateInputValidation,
        inputValidationResultMiddleware,
        createUserHandler
        )