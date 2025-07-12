import { Request, Response } from "express";
import {mapToUserOutput} from "../mappers/mapToUserOutput";
import {HttpStatus} from "../../../core/types/httpStatus";
import {userService} from "../../application/userService";
import {UserCreateInput} from "../input/userCreateInput";
import {BusinessRuleError} from "../../../core/errors/businessRuleError";

export async function createUserHandler(
    req: Request<{},{}, UserCreateInput>,
    res: Response,
    ) {
    try {
        const createdUserId = await userService.create(req.body);
        console.log("Created user ID:", createdUserId);

        const createdUser =
            await userService.findByIdOrFail(createdUserId);
        console.log("Found user:", createdUser);

        const userOutput = mapToUserOutput(createdUser);
        res.status(HttpStatus.Created).json(userOutput);

    } catch (error) {
        if (error instanceof BusinessRuleError) {
             res.status(HttpStatus.BadRequest).json({
                errorsMessages: error.errors.errorsMessages.length > 0
                    ? error.errors.errorsMessages
                    : [{ message: error.message, field: '' }],
            });
        }
           res.status(HttpStatus.InternalServerError).send("Internal Server Error");
        }
}