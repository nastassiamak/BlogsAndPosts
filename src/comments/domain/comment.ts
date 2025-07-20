export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type Comments = {
  //postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};
