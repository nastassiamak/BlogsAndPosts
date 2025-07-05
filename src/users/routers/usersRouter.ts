import {Router} from "express";
import {superAdminGuardMiddleware} from "../../auth/middlewares/superAdminGuardMiddleware";
import {userCreateInputValidation} from "./userInputDtoValodationMiddleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/inputValidationResultMiddleware";
import {createUserHandler} from "./handlers/createdUserHandler";
import {getUserListHandler} from "./handlers/getUserListHandler";
import {usersPaginationValidation} from "./usersPaginationValidation";

export const usersRouter = Router({});

usersRouter
    .get("/",
        usersPaginationValidation,
        getUserListHandler
    )
    .post("/",
        superAdminGuardMiddleware,
        userCreateInputValidation,
        createUserHandler
        )
