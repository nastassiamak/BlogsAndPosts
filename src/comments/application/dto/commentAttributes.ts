import { CommentatorInfo } from "../../domain/comment";

export type CommentAttributes = {
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt?: string;
};
