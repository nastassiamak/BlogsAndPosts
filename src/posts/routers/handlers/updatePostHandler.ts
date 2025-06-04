import { Request, Response } from "express";
//import { errorsHandler } from "../../../core/errors/errorsHandler";
import { PostUpdateInput } from "../input/postUpdateInput";
import { postService } from "../../application/postService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";

export async function updatePostHandler(
  req: Request<{ id: string }, {}, PostUpdateInput>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await postService.update(id, req.body);

    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Post not found" });
    } else {
      res
        .status(HttpStatus.InternalServerError)
        .send({ message: "Internal Server Error" });
    }
  }
}
