import { Request, Response } from "express";
//import { errorsHandler } from "../../../core/errors/errorsHandler";
import { postService } from "../../application/postService";
import { HttpStatus } from "../../../core/types/httpStatus";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
    try {
        const id = req.params.id;
        await postService.delete(id);

        res.sendStatus(HttpStatus.NoContent);

    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
            return res.status(HttpStatus.NotFound).send({ message: "Post not found" });
        }
        res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
    }
}
