import { Request, Response } from "express";
import { PostQueryInput } from "../../../posts/routers/input/postQueryInput";
import { postService } from "../../../posts/application/postService";
import { mapToPostListPaginatedOutput } from "../../../posts/routers/mappers/mapToPostListPaginatedOutputUtil";
//import { errorsHandler } from "../../../core/errors/errorsHandler";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import { blogService } from "../../application/blogService";
import { ParsedQs } from "qs";
import { SortDirection } from "../../../core/types/sortDirection";
import { PostSortField } from "../../../posts/routers/input/postSortField";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import { mapToPostOutput } from "../../../posts/routers/mappers/mapToPostOutput";

export async function getBlogPostListHandler(
  req: Request<{ id: string }, {}, {}, ParsedQs>,
  res: Response,
) {
  function parseBlogPostQuery(query: ParsedQs): PostQueryInput {
    return {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
      sortDirection:
        query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
      // searchPostTitleTerm: (query.searchPostTitleTerm as string) || undefined,
      // searchPostShortDescriptionTerm:
      //   (query.searchPostShortDescriptionTerm as string) || undefined,
    };
  }

  try {
    const id = req.params.id;
    console.log("Получен запрос на blogId:", id);

    const blog = await blogService.findByIdOrFail(id);
    const queryInput = parseBlogPostQuery(req.query);
    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);
    console.log("Параметры запроса:", queryWithDefaults);

    // Получаем данные с пагинацией
    const paginatedPosts = await postService.findPostsByBlog(
      queryWithDefaults,
      blog._id.toString(),
    );

    console.log(
      `Найдено постов: ${paginatedPosts.items.length}, всего: ${paginatedPosts.totalCount}`,
    );

    // Маппим каждый пост из БД в нужный формат output
    const mappedItems = paginatedPosts.items.map((post) =>
      mapToPostOutput(post),
    );

    // Формируем итоговый ответ с пагинацией и преобразованными постами
    const responsePayload = {
      pagesCount: Math.ceil(
        paginatedPosts.totalCount / queryWithDefaults.pageSize,
      ),
      page: queryWithDefaults.pageNumber,
      pageSize: queryWithDefaults.pageSize,
      totalCount: paginatedPosts.totalCount,
      items: mappedItems,
    };

    console.log("Формируем ответ:", responsePayload);

    res.status(HttpStatus.Ok).json(responsePayload);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
      return;
    }
    console.error(error);
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}
