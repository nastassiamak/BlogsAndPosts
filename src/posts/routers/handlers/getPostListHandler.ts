import {Request, Response} from "express";
import {PostQueryInput} from "../input/postQueryInput";
import {postService} from "../../application/postService";
import {mapToPostOutput} from "../mappers/mapToPostOutput";
import {HttpStatus} from "../../../core/types/httpStatus";
import {PostSortField} from "../input/postSortField";
import {ParsedQs} from "qs";
import {SortDirection} from "../../../core/types/sortDirection";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";

function parseQuery(query: any): PostQueryInput {
  return {
    pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
    pageSize: query.pageSize ? Number(query.pageSize) : 10,
    sortBy: query.sortBy ?? PostSortField.CreatedAt,
    sortDirection: query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
  };
}

export async function getPostListHandler(req: Request, res: Response): Promise<void> {
  try {
    const queryInput = parseQuery(req.query);
    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);

    const paginatedPosts = await postService.findMany(queryWithDefaults);

    const mappedItems = paginatedPosts.items.map(mapToPostOutput);

    // Корректный расчёт pagesCount по числовому queryWithDefaults.pageSize
    const pagesCount = Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);

    const responsePayload = {
      pagesCount,
      page: queryWithDefaults.pageNumber,
      pageSize: queryWithDefaults.pageSize,
      totalCount: paginatedPosts.totalCount,
      items: mappedItems || [],
    };

    res.status(HttpStatus.Ok).json(responsePayload);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Post not found" });
    }
    res.status(HttpStatus.BadRequest).send({ message: (error as Error).message || "Invalid query" });
  }
}