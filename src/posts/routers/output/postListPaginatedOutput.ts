import { PaginatedOutput } from "../../../core/types/paginatedOutput";
import { PostDataOutput } from "./postDataOutput";

export type PostListPaginatedOutput = {
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  items: PostDataOutput[];
};
