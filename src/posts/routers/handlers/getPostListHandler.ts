import {PostSortField} from "../input/postSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import { Request, Response } from "express";
import {postService} from "../../application/postService";
import {HttpStatus} from "../../../core/types/httpStatus";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY = PostSortField.CreatedAt;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

export async function getPostListHandler(req: Request, res: Response) {
    try {
        // Используем значения из query, или дефолты, если параметры отсутствуют
        const pageNumber =
            req.query.pageNumber !== undefined
                ? Number(req.query.pageNumber)
                : DEFAULT_PAGE_NUMBER;

        const pageSize =
            req.query.pageSize !== undefined
                ? Number(req.query.pageSize)
                : DEFAULT_PAGE_SIZE;

        const sortBy =
            typeof req.query.sortBy === "string" &&
            Object.values(PostSortField).includes(req.query.sortBy as PostSortField)
                ? (req.query.sortBy as PostSortField)
                : DEFAULT_SORT_BY;

        const sortDirection =
            typeof req.query.sortDirection === "string" &&
            Object.values(SortDirection).includes(req.query.sortDirection as SortDirection)
                ? (req.query.sortDirection as SortDirection)
                : DEFAULT_SORT_DIRECTION;

        const queryInput = {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        };

        // Далее вызываем сервис с queryInput
        const paginatedPosts = await postService.findMany(queryInput);

        // Считаем pagesCount, если не возвращается сервисом
        const pagesCount = Math.ceil(paginatedPosts.totalCount / pageSize);

        const responsePayload = {
            items: paginatedPosts.items,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: paginatedPosts.totalCount,
            pagesCount: pagesCount,
        };

        res.status(HttpStatus.Ok).json(responsePayload);
    } catch (error) {
        // Обработка ошибок
        res.status(HttpStatus.BadRequest).json({ message: (error as Error).message || "Invalid query" });
    }
}