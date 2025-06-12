
import { Request, Response } from "express";
import { PostQueryInput } from "../input/postQueryInput";
import { postService } from "../../application/postService";
import { mapToPostOutput } from "../mappers/mapToPostOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
import { PostSortField } from "../input/postSortField";
import { ParsedQs } from "qs";
import { SortDirection } from "../../../core/types/sortDirection";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {mapToBlogListPaginatedOutput} from "../../../blogs/routers/mappers/mapToBlogListPaginatedOutputUtil";
import {mapToPostListPaginatedOutput} from "../mappers/mapToPostListPaginatedOutputUtil";

export async function getPostListHandler(req: Request, res: Response) {


  try {

    const queryInput = {
      pageNumber: Number(req.query.pageNumber) || 1,
      pageSize: Number(req.query.pageSize) || 10,
      sortBy: (req.query.sortBy as PostSortField) || PostSortField.CreatedAt,
      sortDirection: req.query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
    };

   const queryWithDefaults =
       setDefaultSortAndPaginationIfNotExist(queryInput);

    const paginatedPosts =
        await postService.findMany(queryInput);

    // Считаем pagesCount, если в сервисе не отдаётся
    const pagesCount =
        Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);

    console.log(`Найдено постов: ${paginatedPosts.items.length}, всего: ${paginatedPosts.totalCount}`);

    // Формируем ответ с нужной структурой — даже если постов нет, items должен быть массивом
    const responsePayload =
        mapToPostListPaginatedOutput(
            queryWithDefaults.pageNumber,
            pagesCount,
            queryWithDefaults.pageSize,
            paginatedPosts.totalCount,
            paginatedPosts.items,
        )

    console.log(responsePayload, "<--- postList");

    res.send(responsePayload);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
     res.status(HttpStatus.NotFound).json({ message: "Post not found" });
    }
    res.status(HttpStatus.BadRequest).json({ message: (error as Error).message || "Invalid query" });
  }
}