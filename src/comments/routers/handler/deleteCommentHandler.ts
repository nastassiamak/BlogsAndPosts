import { Request, Response } from "express";
import { commentService } from "../../application/commentService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";

export async function deleteCommentHandler(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
      return;
    }

    const id = req.params.id;
    const comment = await commentService.findByIdOrFail(id);

    if (comment.commentatorInfo.userId !== user.userId) {
      res.status(HttpStatus.Forbidden).json({ message: "Forbidden" });
      return;
    }
    await commentService.delete(id);

    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Comment not found" });
      return;
    } else {
      res
        .status(HttpStatus.InternalServerError)
        .send({ message: "Internal Server Error" });
    }
    return;
  }
}
