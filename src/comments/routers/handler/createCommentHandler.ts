import { Request, Response } from "express";
import { CommentCreateInput } from "../input/commentCreateInput";
import { postService } from "../../../posts/application/postService";
import { mapToCommentOutput } from "../mappers/mapToCommentOutput";
import { commentService } from "../../application/commentService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import {CommentAttributes} from "../../application/dto/commentAttributes";

export async function createCommentHandler(
    req: Request, res: Response): Promise<void> {
  try {
    const postId = req.params.postId;
    if (!postId) {
       res
           .status(HttpStatus.BadRequest)
           .json({ errorsMessages: [{ field: 'postId', message: 'PostId is required' }] });
    }

      const user = req.user;
      if (!user) {
          res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
      }
    const { content, commentatorInfo } = req.body as CommentAttributes;

    await postService.findByIdOrFail(postId);

    const commentInput = {
      content,
    commentatorInfo,

    };

    const createdCommentId = await commentService.create(postId, commentInput);
    const createdComment = await commentService.findByIdOrFail(createdCommentId);

    const commentOutput = mapToCommentOutput(createdComment);

     res.status(HttpStatus.Created).send(commentOutput);
  } catch (error) {
    console.error("Error in createCommentHandler:", error);
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "PostId Not Found" });
    }
    res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
  }
}
