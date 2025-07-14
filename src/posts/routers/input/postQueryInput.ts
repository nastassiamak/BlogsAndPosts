import { PaginationAndSorting } from "../../../core/types/paginationAndSorting";
import { PostSortField } from "./postSortField";

export type PostQueryInput = PaginationAndSorting<PostSortField> & Partial<{}>;
