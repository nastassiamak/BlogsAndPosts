import {PostSortField} from "../input/postSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import { Request, Response } from "express";
import {postService} from "../../application/postService";
import {HttpStatus} from "../../../core/types/httpStatus";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {ParsedQs} from "qs";
import {mapToPostListPaginatedOutput} from "../mappers/mapToPostListPaginatedOutputUtil";

export async function getPostListHandler(req: Request<{}, {}, {}, ParsedQs>, res: Response) {
    console.log("Вызван getPostListHandler", req.query)

    try {

        const queryInput = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: (req.query.sortBy as PostSortField) || PostSortField.CreatedAt,
            sortDirection: req.query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
        };

        const queryWithDefaults =
            setDefaultSortAndPaginationIfNotExist(queryInput);

        // Далее вызываем сервис с queryInput
        const paginatedPosts =
            await postService.findMany(queryInput);

        // Считаем pagesCount, если не возвращается сервисом
        const pagesCount =
            Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);

        const responsePayload =
            mapToPostListPaginatedOutput(
            queryWithDefaults.pageNumber,
            pagesCount,
            queryWithDefaults.pageSize,
            paginatedPosts.totalCount,
            paginatedPosts.items,
        )

        console.log("Ответ API: ", responsePayload);
        res.status(HttpStatus.Ok).json(responsePayload);
    } catch (error) {
        // Обработка ошибок
        res.status(HttpStatus.BadRequest).json({ message: (error as Error).message || "Invalid query" });
    }
}