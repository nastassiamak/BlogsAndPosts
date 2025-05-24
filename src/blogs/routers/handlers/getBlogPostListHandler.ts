import { Request, Response } from "express";
import { PostQueryInput } from "../../../posts/routers/input/postQueryInput";
import { postService } from "../../../posts/application/postService";
import { mapToPostListPaginatedOutput } from "../../../posts/routers/mappers/mapToPostListPaginatedOutputUtil";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";

export async function getBlogPostListHandler(
  req: Request<{ id: string }, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const blogId = req.params.id;
    console.log("Получен запрос на blogId:", blogId);  // вывод параметра пути

    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    console.log("Параметры запроса:", queryInput);    // вывод параметров пагинации и сортировки

    const { items, totalCount } = await postService.findPostsByBlog(queryInput, blogId);

    console.log(`Найдено постов: ${items.length}, из них всего: ${totalCount}`);  // вывод результата из БД

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    console.log("Формируем ответ:", postListOutput);

    res.send(postListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
