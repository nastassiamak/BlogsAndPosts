import { PaginatedOutput } from "../../../core/types/paginatedOutput";
import { PostDataOutput } from "./postDataOutput";

export type PostListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostDataOutput[];
};
