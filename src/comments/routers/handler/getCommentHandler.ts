import { Request, Response } from "express";
import { commentService } from "../../application/commentService";
import { mapToCommentOutput } from "../mappers/mapToCommentOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";

export async function getCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const comment = await commentService.findByIdOrFail(id);
    if (!comment) {
      res.status(HttpStatus.NotFound).json({ error: "Could not find comment" });
      return;
    }
    const commentOutput = mapToCommentOutput(comment);

    res.status(HttpStatus.Ok).json(commentOutput);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
       return res.status(HttpStatus.NotFound).send({ message: "Comment not found" });
    } else {
      return res
        .status(HttpStatus.InternalServerError)
        .send({ message: "Internal Server Error" });
    }
  }
}
