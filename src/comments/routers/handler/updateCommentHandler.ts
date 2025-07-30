import { CommentUpdateInput } from "../input/commentUpdateInput";
import { Request, Response } from "express";
import { commentService } from "../../application/commentService";
import { CommentAttributes } from "../../application/dto/commentAttributes";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";

export async function updateCommentHandler(
  req: Request<{ id: string }, {}, CommentUpdateInput>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const updateData: CommentAttributes = {} as CommentAttributes;

    const comment = await commentService
        .findByIdOrFail(id);

    if (!comment) {
      res.status(HttpStatus.NotFound).json({ message: "Comment not found" })
    }
    await commentService.update(id, updateData);
    res.status(HttpStatus.NoContent).json(updateData);
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
