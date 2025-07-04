import { Request, Response } from "express";
import {UserCreateInput} from "../input/userCreateInput";
import {mapToUserOutput} from "../mappers/mapToUserOutput";
import {HttpStatus} from "../../../core/types/httpStatus";
import {userService} from "../../application/userService";

export async function createUserHandler(
    req: Request<{}, {}, UserCreateInput>,
    res: Response,
    ) {
    try{
        const createdUserId = await userService.create(req.body);

        const createdUser  = await userService.findByIdOrFail(createdUserId);

        const userOutput  = mapToUserOutput(createdUser);

        res.status(HttpStatus.Created).send(userOutput);
    } catch (error) {
        console.error("Error in createUserHandler", error);
        res.status(HttpStatus.InternalServerError).send("Internal Server Error");
    }

}