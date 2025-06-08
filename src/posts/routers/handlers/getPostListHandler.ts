import { Request, Response } from "express";
import { PostQueryInput } from "../input/postQueryInput";
import { postService } from "../../application/postService";
import { mapToPostOutput } from "../mappers/mapToPostOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
import { PostSortField } from "../input/postSortField";
import { SortDirection } from "../../../core/types/sortDirection";
import { validationResult } from "express-validator";
export async function getPostListHandler(req: Request, res: Response) {
  try {
    // Берём и явно приводим поля из req.query,
    // их уже гарантированно провалидировали middleware express-validator
    const pageNumber = +(req.query.pageNumber ?? 1);
    const pageSize = +(req.query.pageSize ?? 10);
    const sortBy = (req.query.sortBy ??
      PostSortField.CreatedAt) as PostSortField;
    const sortDirection =
      req.query.sortDirection === "asc"
        ? SortDirection.Asc
        : SortDirection.Desc;

    // Остальные поля (поиск и т.п.) можно получить и привести аналогично
    const searchCreatedAtTerm = req.query.searchCreatedAtTerm as
      | string
      | undefined;

    const queryInput: PostQueryInput = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      ...(searchCreatedAtTerm ? { searchCreatedAtTerm } : {}),
    };

    // Вызываем сервис для получения постов с пагинацией, сортировкой и опциональным поиском
    const paginatedPosts = await postService.findMany(queryInput);

    // Маппим данные постов для ответа
    const mappedItems = paginatedPosts.items.map(mapToPostOutput);

    // Формируем ответ с пагинацией
    const responsePayload = {
      pagesCount: Math.ceil(paginatedPosts.totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: paginatedPosts.totalCount,
      items: mappedItems,
    };

    res.status(HttpStatus.Ok).json(responsePayload);
  } catch (error) {
    console.error("Error in getPostListHandler:", error);
    res.status(HttpStatus.InternalServerError).json({
      message: "Internal Server Error",
    });
  }
}
