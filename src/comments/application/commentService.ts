import { CommentQueryInput } from "../routers/input/commentQueryInput";
import { CommentListPaginatedOutput } from "../routers/output/commentListPaginatedOutput";
import { commentsRepository } from "../routers/repositories/commentsRepository";
import { WithId } from "mongodb";
import { Comments } from "../domain/comment";
import { query } from "express-validator";
import { CommentAttributes } from "./dto/commentAttributes";
import { postService } from "../../posts/application/postService";
import { userService } from "../../users/application/userService";
import { RepositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { CommentUpdateInput } from "../routers/input/commentUpdateInput";
import { resolve } from "node:dns";
import { postsQueryRepository } from "../../posts/repositories/postsQueryRepository";

export const commentService = {
  async findMany(
    postId: string,
    queryDto: CommentQueryInput,
  ): Promise<CommentListPaginatedOutput> {
    return await commentsRepository.findMany(postId, queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<Comments>> {
    return commentsRepository.findByIdOrFail(id);
  },

  async create(postId: string, dto: CommentAttributes): Promise<string> {
    // Проверяем, что пост существует
    const post = await postsQueryRepository.findByIdOrFail(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Проверяем, что пользователь существует
    const user = await userService.findByIdOrFail(dto.commentatorInfo.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newComment: Comments = {
      postId: postId,
      content: dto.content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
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
