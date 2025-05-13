import {PaginatedOutput} from "../../../core/types/paginatedOutput";
import {BlogDataOutput} from "./blogDataOutput";

export type BlogListPaginatedOutput = {
    meta: PaginatedOutput;
    data: BlogDataOutput[];
}