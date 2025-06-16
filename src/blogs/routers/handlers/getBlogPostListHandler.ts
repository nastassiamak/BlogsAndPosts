import { Request, Response } from "express";
import { PostQueryInput } from "../../../posts/routers/input/postQueryInput";
import { postService } from "../../../posts/application/postService";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import { blogService } from "../../application/blogService";
import { ParsedQs } from "qs";
import { SortDirection } from "../../../core/types/sortDirection";
import { PostSortField } from "../../../posts/routers/input/postSortField";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import {mapToBlogPostListPaginatedOutput} from "../mappers/mapToBlogPostListPaginatedOutputUtil";

export async function getBlogPostListHandler(
  req: Request<{ id: string }, {}, {}, ParsedQs>,
  res: Response,
) {
  console.log("Хендлер: getBlogPostListHandler, params:", req.params, "query:", req.query);
  function parseBlogPostQuery(query: ParsedQs): PostQueryInput {
    return {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
      sortDirection:
        query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
    };
  }

  try {
    const blogId = req.params.id;
    console.log("Получен запрос на blogId:", blogId);

    const blog = await blogService.findByIdOrFail(blogId);
    const queryInput = parseBlogPostQuery(req.query);
    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);
    console.log("Параметры запроса:", queryWithDefaults);

    // Получаем данные с пагинацией
    const paginatedPosts = await postService.findPostsByBlogId(
      queryWithDefaults,
        blog._id.toString(),
    );

    const pagesCount =
        Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);

    // Формируем итоговый ответ с пагинацией и преобразованными постами
    const responsePayload = mapToBlogPostListPaginatedOutput(

        queryWithDefaults.pageNumber,
        pagesCount,
        queryWithDefaults.pageSize,
        paginatedPosts.totalCount,
        paginatedPosts.items,
    );

    console.log("Формируем ответ:", responsePayload);

    res.status(HttpStatus.Ok).send(responsePayload);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
      return;
    }
    console.error(error);
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}
