import { Request, Response } from "express";
import { commentService } from "../../application/commentService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import {CommentAttributes} from "../../application/dto/commentAttributes";
import {postService} from "../../../posts/application/postService";

export async function createCommentHandler(
    req: Request<{postId: string}>,
    res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const postId = req.params.postId;
    if (!postId) {
      return res.status(HttpStatus.BadRequest).json({
        errorsMessages: [{ field: 'postId', message: 'PostId is required' }]
      });
    }

    const postExists = await postService.findByIdOrFail(postId);
    if (!postExists) {
      return res.status(HttpStatus.NotFound).json({ message: "Post not found" });
    }

    const { content } = req.body as CommentAttributes;

    const commentInput = {
      content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
      postId: postId,
      createdAt: new Date().toISOString(),
    };

    const createdCommentId = await commentService.create(postId, commentInput);
    const createdComment = await commentService.findByIdOrFail(createdCommentId);

    const commentOutput = {
      id: createdComment._id.toString(),
      content: createdComment.content,
      commentatorInfo: createdComment.commentatorInfo,
      postId: postId,
      createdAt: createdComment.createdAt,
    };

    return res.status(HttpStatus.Created).send(commentOutput);
  } catch (error) {
    console.error("Error in createCommentHandler:", error);
    if (error instanceof RepositoryNotFoundError) {
      return res.status(HttpStatus.NotFound).send({ message: "PostId Not Found" });
    }
    return res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
  }
}