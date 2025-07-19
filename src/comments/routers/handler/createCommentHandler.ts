import { Request, Response } from "express";
import { CommentCreateInput } from "../input/commentCreateInput";
import { postService } from "../../../posts/application/postService";
import { mapToCommentOutput } from "../mappers/mapToCommentOutput";
import { commentService } from "../../application/commentService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";

export async function createCommentHandler(req: Request, res: Response) {
  try {
    const postId = req.params.postId;
    if (!postId) {
       res.status(400).json({ errorsMessages: [{ field: 'postId', message: 'PostId is required' }] });
    }
    const { content } = req.body as CommentCreateInput;

    await postService.findByIdOrFail(postId);

    const commentInput = {
      ...req.body,
      postId: postId,
    };

    const createdCommentId = await commentService.create(commentInput);
    const createdComment = await commentService.findByIdOrFail(createdCommentId);

    const commentOutput = mapToCommentOutput(createdComment);

     res.status(HttpStatus.Created).send(commentOutput);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
       res.status(HttpStatus.NotFound).send({ message: "PostId Not Found" });
    }
    console.log("Error in createCommentHandler:", error);
     res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
  }
}
