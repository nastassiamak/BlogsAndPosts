import {SortDirection} from "../../../core/types/sortDirection";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {HttpStatus} from "../../../core/types/httpStatus";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
import {Request, Response} from "express";
import {ParsedQs} from "qs";
import {UserSortField} from "../input/userSortField";
import {userService} from "../../application/userService";
import {mapToUserListPaginatedOutput} from "../mappers/mapToUserListPaginatedOutput";

export async function getUserListHandler(req: Request<{}, {}, {}, ParsedQs>, res: Response) {
    console.log("Вызван getUserListHandler", req.query);
    try {
        // Парсим параметры из query и задаём дефолты
        const queryInput = {
            pageNumber: Number(req.query.pageNumber) || 1,
            pageSize: Number(req.query.pageSize) || 10,
            sortBy: (req.query.sortBy as UserSortField) || "createdAt",
            sortDirection: req.query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc
        };

        // При необходимости установите дефолты
        const queryWithDefaults =
            setDefaultSortAndPaginationIfNotExist(queryInput);


        // Вызываем метод репозитория для получения данных с пагинацией
        const paginatedPosts =
            await userService.findMany(queryWithDefaults);

        const pagesCount =
            Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);

        const responsePayload =
            mapToUserListPaginatedOutput(
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
