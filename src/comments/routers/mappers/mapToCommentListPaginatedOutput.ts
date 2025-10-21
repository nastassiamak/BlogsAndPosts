import { CommentDataOutput } from "../output/commentDataOutput";
import { CommentListPaginatedOutput } from "../output/commentListPaginatedOutput";

export function mapToCommentListPaginatedOutput(
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  comments: CommentDataOutput[],
): CommentListPaginatedOutput {
  return {
    pagesCount,
    page,
    pageSize,
    totalCount,
    items: comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    })),
  };
}
