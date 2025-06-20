import {PostSortField} from "../input/postSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import { Request, Response } from "express";
import {postService} from "../../application/postService";
import {HttpStatus} from "../../../core/types/httpStatus";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
import {ParsedQs} from "qs";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {mapToPostListPaginatedOutput} from "../mappers/mapToPostListPaginatedOutputUtil";


export async function getPostListHandler(req: Request<{}, {}, {}, ParsedQs>, res: Response) {
    console.log("Вызван getPostListHandler", req.query);
    try {
        // Парсим параметры из query и задаём дефолты
        const queryInput = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: (req.query.sortBy as PostSortField) || PostSortField.CreatedAt,
            sortDirection: req.query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc
        };

        // При необходимости установите дефолты
        const queryWithDefaults =
            setDefaultSortAndPaginationIfNotExist(queryInput);


        // Вызываем метод репозитория для получения данных с пагинацией
        const paginatedPosts =
            await postService.findMany(queryWithDefaults);

        const pagesCount =
            Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);

        const responsePayload =
            mapToPostListPaginatedOutput(
                queryWithDefaults.pageNumber,
                pagesCount,
                queryWithDefaults.pageSize,
                paginatedPosts.totalCount,
                paginatedPosts.items
            );

        console.log("Ответ API: ", responsePayload);

        res.status(HttpStatus.Ok).json(responsePayload);

    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
            res.status(HttpStatus.NotFound).json({message: "Post not found"});
        }
        res.status(HttpStatus.BadRequest).json({message: (error as Error).message || "Invalid query"});
    }
}
