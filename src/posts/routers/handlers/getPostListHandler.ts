import {PostSortField} from "../input/postSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import { Request, Response } from "express";
import {postService} from "../../application/postService";
import {HttpStatus} from "../../../core/types/httpStatus";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {ParsedQs} from "qs";
import {mapToPostListPaginatedOutput} from "../mappers/mapToPostListPaginatedOutputUtil";

function parsePositiveInt(value: unknown): number | undefined {
    if (value === undefined) return undefined;
    const num = Number(value);
    return Number.isInteger(num) && num > 0 ? num : undefined;
}

export async function getPostListHandler(req: Request<{}, {}, {}, ParsedQs>, res: Response) {
    console.log("Вызван getPostListHandler", req.query);
    try {
        const pageNumber = parsePositiveInt(req.query.pageNumber);
        const pageSize = parsePositiveInt(req.query.pageSize);
        const sortBy = req.query.sortBy as PostSortField | undefined;
        const sortDirection = req.query.sortDirection as SortDirection | undefined;

        const queryInput = {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        };

        const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);

        const paginatedPosts = await postService.findMany(queryWithDefaults);

        const pagesCount = Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);

        const responsePayload = mapToPostListPaginatedOutput(
            queryWithDefaults.pageNumber,
            pagesCount,
            queryWithDefaults.pageSize,
            paginatedPosts.totalCount,
            paginatedPosts.items,
        );

        console.log("Ответ API: ", responsePayload);
        res.status(HttpStatus.Ok).json(responsePayload);

    } catch (error) {
        res.status(HttpStatus.BadRequest).json({ message: (error as Error).message || "Invalid query" });
    }
}