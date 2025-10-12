import { CommentatorInfo } from "../../domain/comment";

export type CommentDataOutput = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  postId: string;
  createdAt: string;
};
