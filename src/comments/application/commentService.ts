import { CommentQueryInput } from "../routers/input/commentQueryInput";
import { CommentListPaginatedOutput } from "../routers/output/commentListPaginatedOutput";
import { commentsRepository } from "../routers/repositories/commentsRepository";
import { WithId } from "mongodb";
import { Comments } from "../domain/comment";
import { query } from "express-validator";
import { CommentAttributes } from "./dto/commentAttributes";
import { postService } from "../../posts/application/postService";
import { userService } from "../../users/application/userService";

export const commentService = {
  async findMany(
    queryDto: CommentQueryInput,
  ): Promise<CommentListPaginatedOutput> {
    return await commentsRepository.findMany(queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<Comments>> {
    return commentsRepository.findByIdOrFail(id);
  },

  async create(dto: CommentAttributes) {
    const post = await postService.findByIdOrFail(dto.postId);
    const userId = await userService.findByIdOrFail(dto.commentatorInfo.userId);
    const newComment: Comments = {
      postId: post._id.toString(),
      content: dto.content,
      commentatorInfo: {
        userId: userId._id.toString(),
        userLogin: userId.login,
      },
      createdAt: new Date().toString(),
    };
    return await commentsRepository.createComment(newComment);
  },

  async update(id: string, dto: CommentAttributes): Promise<void> {
    return await commentsRepository.updateComment(id, dto);
  },

  async delete(id: string): Promise<void> {
    return await commentsRepository.deleteComment(id);
  },
};
