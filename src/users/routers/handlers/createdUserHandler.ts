import { Request, Response } from "express";
import {mapToUserOutput} from "../mappers/mapToUserOutput";
import {HttpStatus} from "../../../core/types/httpStatus";
import {userService} from "../../application/userService";
import {BusinessRuleError} from "../../../core/errors/businessRuleError";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";

export async function createUserHandler(
    req: Request,
    res: Response,
    ) {
    try {
        const createdUserId = await userService.create(req.body);
        console.log("Created user ID:", createdUserId);

        const createdUser = await userService.findByIdOrFail(createdUserId);
        console.log("Found user:", createdUser);

        const userOutput = mapToUserOutput(createdUser);
        res.status(HttpStatus.Created).send(userOutput);

    } catch (error) {
            console.error("Create user error:", error);

            if (error instanceof BusinessRuleError) {
                res.status(HttpStatus.BadRequest).json({
                    errorsMessages: error.errors.errorsMessages.length > 0
                        ? error.errors.errorsMessages
                        : [{ message: error.message, field: "" }],
                });
            }

           res.status(HttpStatus.InternalServerError).send("Internal Server Error");
        }
}