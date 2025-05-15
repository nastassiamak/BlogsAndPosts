import {PostQueryInput} from "../input/postQueryInput";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {postService} from "../../application/postService";

export async function getPostListHandler(
    req: Request<{},{},{}, PostQueryInput>,
    res: Response,
) {
    try {
        const queryInput =
            setDefaultSortAndPaginationIfNotExist(req.query);

        const {items, totalCount} = await postService.findMany(queryInput);

        const postListOutput =

    }
}