import { Request, Response} from "express";
import {PostQueryInput} from "../input/postQueryInput";
import {mapToPostListPaginatedOutput} from "../mappers/mapToPostListPaginatedOutputUtil";
import {errorsHandler} from "../../../core/errors/errorsHandler";
import {postService} from "../../application/postService";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";

export async function getPostListHandler(
    req: Request<{},{},{}, PostQueryInput>,
    res: Response,
) {
    try {
        const queryInput =
            setDefaultSortAndPaginationIfNotExist(req.query);

        const { items, totalCount } = await postService
            .findMany(queryInput);

        const postsListOutput =
            mapToPostListPaginatedOutput(
                items, {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount,
                }
            );
        res
            .send(postsListOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}