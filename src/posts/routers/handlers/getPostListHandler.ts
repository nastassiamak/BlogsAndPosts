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

  try {
    const queryInput = req.query as unknown as PostQueryInput;
   // const queryInput: PostQueryInput =  req.query;
    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);
    // Вызываем сервис для получения постов с пагинацией, сортировкой и опциональным поиском
    const paginatedPosts = await postService.findMany(queryWithDefaults);

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
