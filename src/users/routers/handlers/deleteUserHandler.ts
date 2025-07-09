import { Request, Response} from "express";
import {userService} from "../../application/userService";
import {HttpStatus} from "../../../core/types/httpStatus";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";

export async function deleteUserHandler(
    req: Request<{ id: string }>,
    res: Response,
): Promise<void> {
    try {
        const id = req.params.id;
        await userService.delete(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
            res.status(HttpStatus.NotFound).send({ message: "User doesn't exist" });
        }
    }
}