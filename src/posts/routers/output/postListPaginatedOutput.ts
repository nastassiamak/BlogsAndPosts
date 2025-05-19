import {PaginatedOutput} from "../../../core/types/paginatedOutput";
import {PostDataOutput} from "./postDataOutput";

export type PostListPaginatedOutput = {
    meta: PaginatedOutput;
    data: PostDataOutput[];
}