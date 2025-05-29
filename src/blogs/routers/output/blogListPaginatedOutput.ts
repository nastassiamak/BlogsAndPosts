import { PaginatedOutput } from "../../../core/types/paginatedOutput";
import { BlogDataOutput } from "./blogDataOutput";

export type BlogListPaginatedOutput = {
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  items: BlogDataOutput[];
};
