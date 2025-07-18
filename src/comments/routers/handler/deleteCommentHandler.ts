import { Request, Response } from "express";
import { commentService } from "../../application/commentService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";

export async function deleteCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const id = req.params.id;
    await commentService.delete(id);

    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Comment not found" });
    } else {
      res
        .status(HttpStatus.InternalServerError)
        .send({ message: "Internal Server Error" });
    }
  }
}
