import { CommentAttributes } from "../../../src/comments/application/dto/commentAttributes";

export function getCommentDto(): CommentAttributes {
  return {
    content: "test content",
    commentatorInfo: {
      userId: "test userId",
      userLogin: "test user login",
    },
  };
}
