import { PaginatedOutput } from "../../../core/types/paginatedOutput";
import { BlogDataOutput } from "./blogDataOutput";

export type BlogListPaginatedOutput = {
  pageCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogDataOutput[];
};
