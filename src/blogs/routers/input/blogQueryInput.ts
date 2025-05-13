import {PaginationAndSorting} from "../../../core/types/paginationAndSorting";
import {BlogSortField} from "./blogSortField";

export type BlogQueryInput = PaginationAndSorting<BlogSortField> &
    Partial<{
    searchBlogNameTerm: string;
    searchBlogDescriptionTerm: string;
    }>