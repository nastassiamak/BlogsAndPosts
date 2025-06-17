import {PostSortField} from "../input/postSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import { Request, Response } from "express";
import {postService} from "../../application/postService";
import {HttpStatus} from "../../../core/types/httpStatus";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {ParsedQs} from "qs";
import {mapToPostListPaginatedOutput} from "../mappers/mapToPostListPaginatedOutputUtil";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";


export async function getPostListHandler(req: Request<{}, {}, {}, ParsedQs>, res: Response) {
    console.log("Вызван getPostListHandler", req.query);
    try {
        const pageNumber = Number(req.query.pageNumber) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const sortBy = req.query.sortBy as PostSortField || PostSortField.CreatedAt;
        const sortDirection = req.query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc;

        const queryInput = {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        };

        const queryWithDefaults =
            setDefaultSortAndPaginationIfNotExist(queryInput);

        const paginatedPosts =
            await postService.findMany(queryInput);

        const pagesCount =
            Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);

        const responsePayload =
            mapToPostListPaginatedOutput(

            queryWithDefaults.pageNumber,
            pagesCount,
            queryWithDefaults.pageSize,
            paginatedPosts.totalCount,
            paginatedPosts.items,
        );

        console.log("Ответ API: ", responsePayload);
        res.status(HttpStatus.Ok).json(responsePayload);

    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
            res.status(HttpStatus.NotFound).json({ message: "Post not found" });
        }
        res.status(HttpStatus.BadRequest).json({ message: (error as Error).message || "Invalid query" });
    }
}