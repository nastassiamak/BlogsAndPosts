import {PaginatedOutput} from "../../../core/types/paginatedOutput";
import {PostDataOutput} from "./postDataOutput";

export type PostListPaginationOutput = {
    meta: PaginatedOutput;
    data: PostDataOutput[];
}