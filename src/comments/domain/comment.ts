export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type Comments = {
  content: string;
  commentatorInfo: CommentatorInfo;
  postId: string;
  createdAt: string;
};
