import { PaginatedOutput } from "../../../core/types/paginatedOutput";
import { PostDataOutput } from "./postDataOutput";

export type PostListPaginatedOutput = {
  pageCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostDataOutput[];
};
