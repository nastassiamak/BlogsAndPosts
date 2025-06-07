import { Request, Response } from "express";
import { postService } from "../../application/postService";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import { ParsedQs } from "qs";
import { PostSortField } from "../input/postSortField";
import { SortDirection } from "../../../core/types/sortDirection";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import { mapToPostOutput } from "../mappers/mapToPostOutput";
import {PostQueryInput} from "../input/postQueryInput";

export async function getPostListHandler(
  req: Request<{}, {}, {}, ParsedQs>,
  res: Response,
)
{
  console.log("Запрос GET /posts:", req.query);
  function parsePostQuery(query: ParsedQs): PostQueryInput {
    return {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
      sortDirection:
        query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
    };
  }

  try {
    const queryInput = parsePostQuery(req.query);

    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);
    // Запрос данных с пагинацией и сортировкой
    const paginatedPosts = await postService.findMany(queryWithDefaults);

    console.log(
        `Найдено блогов: ${paginatedPosts.items.length}, всего: ${paginatedPosts.totalCount}`,
    );

    // Маппим каждый пост из БД в нужный формат output
    const mappedItems = paginatedPosts.items.map((post) =>
        mapToPostOutput(post),
    );

    const responsePayload = {
      pagesCount: Math.ceil(
          paginatedPosts.totalCount / queryWithDefaults.pageSize,
      ),
      page: queryWithDefaults.pageNumber,
      pageSize: queryWithDefaults.pageSize,
      totalCount: paginatedPosts.totalCount,
      items: mappedItems,
    };
    console.log(responsePayload, "<--- postlist");
    res.status(HttpStatus.Ok).send(responsePayload);

  } catch (error) {
    console.error("Ошибка в getPostListHandler:", error);
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Post not found" });
    }
    res
        .status(400)
        .send({ message: (error as Error).message || "Invalid query" });
  }
}
