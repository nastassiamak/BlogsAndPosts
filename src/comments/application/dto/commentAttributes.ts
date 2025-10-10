
export type CommentAttributes = {
  postId?: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin?: string;
  } // если не приходит с клиента, не обязательно
  createdAt?: string;
};
