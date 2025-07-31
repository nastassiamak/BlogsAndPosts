import { CommentUpdateInput } from "../input/commentUpdateInput";
import { Request, Response } from "express";
import { commentService } from "../../application/commentService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";

export async function updateCommentHandler(
  req: Request<{ id: string }, {}, CommentUpdateInput>,
  res: Response,
) {
  try {
    const user = req.user!;
    const id = req.params.id;
    const updateData = req.body;

    const comment = await commentService
        .findByIdOrFail(id);

    if (comment.commentatorInfo.userId !== user._id.toString()) {
      res.status(HttpStatus.Forbidden).json({ message: "Forbidden" });
      return;
    }

    // if (!comment) {
    //   res.status(HttpStatus.NotFound).json({ message: "Comment not found" })
    //   return;
    // }
    await commentService.update(id, updateData);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Comment not found" });
      return;
    } else {
      res
        .status(HttpStatus.InternalServerError)
        .send({ message: "Internal Server Error" });
      return;
    }
  }
}
