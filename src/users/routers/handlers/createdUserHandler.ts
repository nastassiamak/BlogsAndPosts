import { Request, Response } from "express";
import {mapToUserOutput} from "../mappers/mapToUserOutput";
import {HttpStatus} from "../../../core/types/httpStatus";
import {userService} from "../../application/userService";
import {BusinessRuleError} from "../../../core/errors/businessRuleError";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
import {UserCreateInput} from "../input/userCreateInput";

export async function createUserHandler(
    req: Request<{},{}, UserCreateInput>,
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
                res.status(HttpStatus.BadRequest).json();
            }
            // if (error instanceof RepositoryNotFoundError) {
            //
            // }

           res.status(HttpStatus.InternalServerError).send("Internal Server Error");
        }
}