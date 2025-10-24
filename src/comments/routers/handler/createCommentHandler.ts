import { Request, Response } from "express";
import { commentService } from "../../application/commentService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import {CommentAttributes} from "../../application/dto/commentAttributes";
import {postService} from "../../../posts/application/postService";

export async function createCommentHandler(
    req: Request,
    res: Response) {
  try {
    const user = req.user;
    if (!user) {
      res.status(HttpStatus.Unauthorized).json({ message: "Unauthorized" });
      return;
    }

    const postId = req.params.postId;
    if (!postId) {
      return res.status(HttpStatus.BadRequest).json({
        errorsMessages: [{ field: 'postId', message: 'PostId is required' }]
      });
    }

    const postExists = await postService.findByIdOrFail(postId);
    if (!postExists) {
      res.status(HttpStatus.NotFound).send({message: "Post not found"} )
      return;
    }

    const { content } = req.body as CommentAttributes;

    const commentInput = {
      content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
    };

    const createdCommentId = await commentService.create(postId, commentInput);
    const createdComment = await commentService.findByIdOrFail(createdCommentId);

    const commentOutput = {
      id: createdComment._id.toString(),
      content: createdComment.content,
      commentatorInfo: createdComment.commentatorInfo,
      createdAt: new Date(createdComment.createdAt).toISOString(),
    };

    res.status(HttpStatus.Created).send(commentOutput);
    return
  } catch (error) {
    console.error("Error in createCommentHandler:", error);
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "PostId Not Found" });
      return;
    }
    res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
    return;
  }
}