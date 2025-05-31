import {Request, Response} from "express";
import {PostQueryInput} from "../../../posts/routers/input/postQueryInput";
import {postService} from "../../../posts/application/postService";
import {mapToPostListPaginatedOutput} from "../../../posts/routers/mappers/mapToPostListPaginatedOutputUtil";
//import { errorsHandler } from "../../../core/errors/errorsHandler";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {blogService} from "../../application/blogService";
import {ParsedQs} from "qs";
import {SortDirection} from "../../../core/types/sortDirection";
import {PostSortField} from "../../../posts/routers/input/postSortField";
import {HttpStatus} from "../../../core/types/httpStatus";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";


export async function getBlogPostListHandler(
  req: Request<{ id: string }, {}, {}, ParsedQs>,
  res: Response,
) {
  function parseBlogPostQuery(query: ParsedQs): PostQueryInput {
    return {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: PostSortField.CreatedAt,
      sortDirection: SortDirection.Desc
    };
  }
  try {



    const id = req.params.id;
    console.log("Получен запрос на blogId:", id); // вывод параметра пути

    const blogId = await blogService.findByIdOrFail(id);
    const queryInput = parseBlogPostQuery(req.query);
    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);
    console.log("Параметры запроса:", queryWithDefaults); // вывод параметров пагинации и сортировки

    const paginatedPosts = await postService.findPostsByBlog(
        queryWithDefaults,
        blogId._id.toString(),
    );

    console.log(`Найдено постов: ${paginatedPosts.items.length}, 
   из них всего: ${paginatedPosts.totalCount}`); // вывод результата из БД

    // const postListOutput = mapToPostListPaginatedOutput(items,
    //   queryWithDefaults.pageNumber,
    //   queryWithDefaults.pageSize,
    //   totalCount,
    // );

    console.log("Формируем ответ:", paginatedPosts);

    res.send(paginatedPosts);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: 'Blog not found' });
    }
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}
