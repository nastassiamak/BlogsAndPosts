import { CommentQueryInput } from "../routers/input/commentQueryInput";
import { CommentListPaginatedOutput } from "../routers/output/commentListPaginatedOutput";
import { commentsRepository } from "../routers/repositories/commentsRepository";
import { WithId } from "mongodb";
import { Comments } from "../domain/comment";
import { query } from "express-validator";
import { CommentAttributes } from "./dto/commentAttributes";
import { postService } from "../../posts/application/postService";
import { userService } from "../../users/application/userService";
import {RepositoryNotFoundError} from "../../core/errors/repositoryNotFoundError";
import {CommentUpdateInput} from "../routers/input/commentUpdateInput";
import {resolve} from "node:dns";

export const commentService = {
  async findMany(
    queryDto: CommentQueryInput,
  ): Promise<CommentListPaginatedOutput> {
    return await commentsRepository.findMany(queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<Comments>> {
    return commentsRepository.findByIdOrFail(id);
  },

  async create( postId: string, dto: CommentAttributes) {
   const post = await postService.findByIdOrFail(postId);
   if (!post) {

   }
    const userId =
        await userService.findByIdOrFail(dto.commentatorInfo.userId);
    const newComment: Comments = {
      content: dto.content,
      commentatorInfo: {
        userId: userId._id.toString(),
        userLogin: userId.login,
      },

      createdAt: new Date().toISOString(),
    };
    return await commentsRepository.createComment(newComment);
  },

  async update(id: string, dto: CommentUpdateInput): Promise<void> {
    return await commentsRepository.updateComment(id, dto);
  },

  async delete(id: string): Promise<void> {
    return await commentsRepository.deleteComment(id);
  },
};
