import { WithId } from "mongodb";
import { CommentDataOutput } from "../output/commentDataOutput";
import { Comments } from "../../domain/comment";

export function mapToCommentOutput(
  comment: WithId<Comments>,
): CommentDataOutput {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  };
}
