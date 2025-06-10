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

export async function getPostListHandler(
    req: Request,
    res: Response,
) {
  console.log("Хендлер: getPostListHandler, query:", req.query);

  function parsePostQuery(query: ParsedQs): PostQueryInput {
    const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;

    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new Error("Page number must be a positive integer");
    }

    const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 20) {
      throw new Error("Page size must be an integer between 1 and 100");
    }

    const sortBy = (query.sortBy as PostSortField) || PostSortField.CreatedAt;
    // можно добавить проверку на валидные значения sortBy

    const sortDirection =
        query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc;

    // если есть дополнительные поля для поиска, добавьте их здесь

    return {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    };

  }
  try {
    const queryInput =  parsePostQuery(req.query);
   // const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);
    // Вызываем сервис для получения постов с пагинацией, сортировкой и опциональным поиском
    const paginatedPosts = await postService.findMany(queryInput);

    console.log(
        `Найдено постов: ${paginatedPosts.items.length}, всего: ${paginatedPosts.totalCount}`,
    );

    // Маппим данные постов для ответа
    const mappedItems = paginatedPosts.items.map((post)=>
    mapToPostOutput(post),
    );

    // Формируем ответ с пагинацией
    const responsePayload = {
      pagesCount: Math.ceil(paginatedPosts.totalCount /queryInput.pageSize),
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: paginatedPosts.totalCount,
      items: mappedItems,
    };

    console.log(responsePayload, "<--- postList");
    res.send(responsePayload);
  } catch (error) {
    if(error instanceof RepositoryNotFoundError){
      res.status(HttpStatus.NotFound).send({message: "Post not found"})
    }
    res
        .status(400)
        .send({ message: (error as Error).message || "Invalid query" });
  }
}
