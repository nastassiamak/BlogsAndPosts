import { CommentatorInfo } from "../../domain/comment";

export type CommentDataOutput = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};
