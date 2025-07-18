import { PaginationAndSorting } from "../../../core/types/paginationAndSorting";
import { CommentSortField } from "./commentSortField";

export type CommentQueryInput = PaginationAndSorting<CommentSortField> &
  Partial<{}>;
