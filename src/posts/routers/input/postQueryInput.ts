import { PaginationAndSorting } from "../../../core/types/paginationAndSorting";
import { PostSortField } from "./postSortField";

export type PostQueryInput = PaginationAndSorting<PostSortField>
  //   &
  // Partial<{
  //   // searchPostTitleTerm: string;
  //   // searchPostShortDescriptionTerm: string;
  //   // searchPostContentTerm: string;
  //  // searchCreatedAtTerm: string;
  // }>;
