import {PostSortField} from "../input/postSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import { Request, Response } from "express";
import {postService} from "../../application/postService";
import {HttpStatus} from "../../../core/types/httpStatus";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {ParsedQs} from "qs";
import {mapToPostListPaginatedOutput} from "../mappers/mapToPostListPaginatedOutputUtil";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
import {BlogSortField} from "../../../blogs/routers/input/blogSortField";


export async function getPostListHandler(req: Request, res: Response) {
    console.log("Вызван getPostListHandler", req.query);
    try {
        // Парсим параметры из query и задаём дефолты
        const queryDto = {
            pageNumber: req.query.pageNumber ? parseInt(req.query.pageNumber as string, 10) : 1,
            pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10,
            sortBy: (req.query.sortBy as PostSortField) || PostSortField.CreatedAt,
            sortDirection: req.query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc
        }

        // Вызываем метод репозитория для получения данных с пагинацией
        const postsPage = await postService.findMany(queryDto);

        console.log("Ответ API: ", postsPage);
        res.status(HttpStatus.Ok).json(postsPage);

    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
            res.status(HttpStatus.NotFound).json({message: "Post not found"});
        }
        res.status(HttpStatus.BadRequest).json({message: (error as Error).message || "Invalid query"});
    }
}
