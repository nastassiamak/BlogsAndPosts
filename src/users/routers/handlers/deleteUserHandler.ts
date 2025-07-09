import { Request, Response} from "express";
import {userService} from "../../application/userService";
import {HttpStatus} from "../../../core/types/httpStatus";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
import {BusinessRuleError} from "../../../core/errors/businessRuleError";

export async function deleteUserHandler(
    req: Request<{ id: string }>,
    res: Response,
): Promise<void> {
    try {
        const id = req.params.id;
        await userService.delete(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
        if (error instanceof BusinessRuleError) {
            res.status(HttpStatus.BadRequest).json({ message: error.message });
        } else if (error instanceof RepositoryNotFoundError) {
            res.status(HttpStatus.NotFound).json({ message: "User not found" });
        } else {
            res.status(HttpStatus.InternalServerError).send("Internal Server Error");
        }
    }
}