import { Request, Response } from "express";
import { CommentCreateInput } from "../input/commentCreateInput";
import { postService } from "../../../posts/application/postService";
import { mapToCommentOutput } from "../mappers/mapToCommentOutput";
import { commentService } from "../../application/commentService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import {CommentAttributes} from "../../application/dto/commentAttributes";
import {postsRepository} from "../../../posts/repositories/postsRepository";
import {commentsRepository} from "../repositories/commentsRepository";

export async function createCommentHandler(
    req: Request, res: Response){
  try {
    const user = req.user;  // должен быть установлен в authMiddleware
    if (!user) {
       res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { postId } = req.params;
    const { content } = req.body;


    const post = await postService.findByIdOrFail(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }

    const comment = await commentService.create({
      content: content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      }
      // commentatorInfo: {
      //   userId: string;
      //   userLogin?: string;
      // } // если не приходит с клиента, не обязательно
      // createdAt?: string;
    });


    //const createdCommentId = await commentService.create(postId, commentInput);
   // const createdComment = await commentService.findByIdOrFail(createdCommentId);

   // const commentOutput = mapToCommentOutput(createdComment);

     res.status(HttpStatus.Created).send(comment);
  } catch (error) {
    console.error("Error in createCommentHandler:", error);
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "PostId Not Found" });
    }
    res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
  }
}
