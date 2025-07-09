import { Request, Response } from "express";
import {UserCreateInput} from "../input/userCreateInput";
import {mapToUserOutput} from "../mappers/mapToUserOutput";
import {HttpStatus} from "../../../core/types/httpStatus";
import {userService} from "../../application/userService";
import {BusinessRuleError} from "../../../core/errors/businessRuleError";

export async function createUserHandler(
    req: Request,
    res: Response,
    ) {
    try{
        const createdUserId = await userService.create(req.body);
        console.log("Created user ID:", createdUserId);

        const createdUser = await userService.findByIdOrFail(createdUserId);
        console.log("Found user:", createdUser);

        const userOutput = mapToUserOutput(createdUser);
        res.status(HttpStatus.Created).send(userOutput);
    } catch (error) {
        console.error("Create user error:", error);
        if (error instanceof BusinessRuleError) {
            res.status(HttpStatus.BadRequest).json({ message: error.message });
        } else {
            res.status(HttpStatus.InternalServerError).send("Internal Server Error");
        }
    }

}