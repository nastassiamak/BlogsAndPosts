import {Router} from "express";
import {superAdminGuardMiddleware} from "../../auth/middlewares/superAdminGuardMiddleware";
import {userCreateInputValidation} from "./userInputDtoValodationMiddleware";
import {createUserHandler} from "./handlers/createdUserHandler";
import {getUserListHandler} from "./handlers/getUserListHandler";
import {usersPaginationValidation} from "./usersPaginationValidation";
import {idValidation} from "../../core/middlewares/validation/paramsIdValidationMiddleware";
import {deleteUserHandler} from "./handlers/deleteUserHandler";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/inputValidationResultMiddleware";

export const usersRouter = Router({});

usersRouter
    .get("/",
        usersPaginationValidation,
        inputValidationResultMiddleware,
        getUserListHandler
    )
    .post("/",
        superAdminGuardMiddleware,
        userCreateInputValidation,
        inputValidationResultMiddleware,
        createUserHandler
        )
    .delete('/:id',
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteUserHandler)
