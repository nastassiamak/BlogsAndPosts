export type CommentAttributes = {
    content: string;
    commentatorInfo?: {
        userId: string;
        userLogin: string;
    };
    createdAt?: string;
};