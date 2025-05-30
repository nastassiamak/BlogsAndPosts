import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { blogService } from "../../application/blogService";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
//import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
    try {

        const id = req.params.id;

        await blogService.delete(id);
        res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
           res.status(HttpStatus.NotFound).send({ message: 'Blog not found' });
        }
        console.error("Error in deletePostHandler:", error);
        res.status(HttpStatus.InternalServerError);
    }

}
