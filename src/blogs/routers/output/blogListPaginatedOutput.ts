
import { BlogDataOutput } from "./blogDataOutput";

export type BlogListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogDataOutput[];
};
