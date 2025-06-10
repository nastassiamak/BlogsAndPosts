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
import {mapToBlogOutput} from "../../../blogs/routers/mappers/mapToBlogOutput";
import {mapToPostListPaginatedOutput} from "../mappers/mapToPostListPaginatedOutputUtil";

function parseQuery(query: any): PostQueryInput {
  const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
  if (isNaN(pageNumber) || pageNumber < 1) {
    throw new Error("pageNumber must be a positive integer");
  }

  const pageSize = query.pageSize ? Number(query.pageSize) : 10;
  if (isNaN(pageSize) || pageSize < 1 || pageSize > 20) {
    throw new Error("pageSize must be an integer between 1 and 100");
  }

  const sortBy = query.sortBy ?? PostSortField.CreatedAt;
  if (!Object.values(PostSortField).includes(sortBy)) {
    throw new Error(`sortBy must be one of: ${Object.values(PostSortField).join(", ")}`);
  }

  const sortDirection =
      query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc;

  if (!Object.values(SortDirection).includes(sortDirection)) {
    throw new Error(`sortDirection must be one of: ${Object.values(SortDirection).join(", ")}`);
  }

  return { pageNumber, pageSize, sortBy, sortDirection };
}

export async function getPostListHandler(req: Request, res: Response): Promise<void> {
  try {
    console.log("Entered getPostListHandler, req.query:", req.query);
    const queryWithDefaults = parseQuery(req.query);
    //const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);

    const paginatedPosts = await postService.findMany(queryWithDefaults);

    // Формируем ответ через маппер
    const responsePayload = mapToPostListPaginatedOutput(
        paginatedPosts.items,
        queryWithDefaults.pageNumber,
        queryWithDefaults.pageSize,
        paginatedPosts.totalCount,
    );
    console.log("Returning response:", responsePayload);

    res.status(HttpStatus.Ok).json(responsePayload);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Post not found" });
      return; // важно, чтобы не упало дальше
    }
    res.status(HttpStatus.BadRequest).send({ message: (error as Error).message || "Invalid query" });
  }
}