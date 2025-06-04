import { Request, Response } from "express";
import { PostQueryInput } from "../input/postQueryInput";
import { mapToPostListPaginatedOutput } from "../mappers/mapToPostListPaginatedOutputUtil";
//import { errorsHandler } from "../../../core/errors/errorsHandler";
import { postService } from "../../application/postService";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import {ParsedQs} from "qs";
import {PostSortField} from "../input/postSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import {getPostHandler} from "./getPostHandler";
import {HttpStatus} from "../../../core/types/httpStatus";
import {BlogSortField} from "../../../blogs/routers/input/blogSortField";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
import {mapToPostOutput} from "../mappers/mapToPostOutput";

export async function getPostListHandler(
  req: Request<{}, {}, {}, ParsedQs>,
  res: Response,
) {
  console.log("Запрос GET /posts:", req.query);
  function parsePostQuery(query: ParsedQs): PostQueryInput {
    return {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
      sortDirection: (query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc),
      searchPostTitleTerm: (query.searchPostTitleTerm as string) || undefined,
      searchPostShortDescriptionTerm: (query.searchPostShortDescriptionTerm as string) || undefined,
      searchPostContentTerm: (query.searchPostContentTerm as string) || undefined,
    };
  }


  try {

    const queryInput = parsePostQuery(req.query);
    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);

    const paginatedPosts = await postService.findMany(queryWithDefaults);

    console.log(`Найдено постов: ${paginatedPosts.items.length}, всего: ${paginatedPosts.totalCount}`);
    // Маппим каждый пост из БД в нужный формат output
    const mappedItems = paginatedPosts.items.map(blog => mapToPostOutput(blog));


    // Формируем итоговый ответ с пагинацией и преобразованными постами
    const responsePayload = {
      pagesCount: Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize),
      page: queryWithDefaults.pageNumber,
      pageSize: queryWithDefaults.pageSize,
      totalCount: paginatedPosts.totalCount,
      items: mappedItems,
    };
    res.send(responsePayload);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: 'Post not found' });
    }
    console.error("Error in getPostListHandler:", error);
    res.status(HttpStatus.InternalServerError).send({message: "Internal Server Error"});
  }
}
