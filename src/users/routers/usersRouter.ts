import {Router} from "express";
import {superAdminGuardMiddleware} from "../../auth/middlewares/superAdminGuardMiddleware";
import {userCreateInputValidation} from "./userInputDtoValodationMiddleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/inputValidationResultMiddleware";
import {createUserHandler} from "./handlers/createdUserHandler";
import {getUserListHandler} from "./handlers/getUserListHandler";

export const usersRouter = Router({});

usersRouter
    .get("/",
        userCreateInputValidation,
        inputValidationResultMiddleware,
        getUserListHandler
    )
    .post("/",
        superAdminGuardMiddleware,
        userCreateInputValidation,
        inputValidationResultMiddleware,
        createUserHandler
        )
