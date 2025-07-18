import { CommentDataOutput } from "./commentDataOutput";

export type CommentListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentDataOutput[];
};
