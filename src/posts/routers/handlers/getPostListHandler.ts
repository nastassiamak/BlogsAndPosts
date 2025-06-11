
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

export async function getPostListHandler(req: Request<{}, {}, {}, ParsedQs>, res: Response) {
  console.log("Запрос GET /posts: ", req.query);

  function parsePostQuery(query: ParsedQs): PostQueryInput {
    return {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
      sortDirection: query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
    };
  }

  try {
    const queryInput = parsePostQuery(req.query);

    // Если у вас setDefaultSortAndPaginationIfNotExist добавляет дефолты — можно вызвать, либо убрать, если parsePostQuery справляется
    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);
    //const queryWithDefaults = queryInput;

    const paginatedPosts =
        await postService.findMany(queryWithDefaults);

    console.log(`Найдено постов: ${paginatedPosts.items.length}, всего: ${paginatedPosts.totalCount}`);

    const mappedItems =
        paginatedPosts.items.map((post) => mapToPostOutput(post));


    // Формируем ответ с нужной структурой — даже если постов нет, items должен быть массивом
    const responsePayload = {
      pagesCount: Math.ceil(
          paginatedPosts.totalCount / queryWithDefaults.pageSize
      ),
      page: queryWithDefaults.pageNumber,
      pageSize: queryWithDefaults.pageSize,
      totalCount: paginatedPosts.totalCount,
      items: mappedItems,
    };

    console.log(responsePayload, "<--- postList");

    res.send(responsePayload);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
     res.status(HttpStatus.NotFound).json({ message: "Post not found" });
    }
    res.status(HttpStatus.BadRequest).json({ message: (error as Error).message || "Invalid query" });
  }
}