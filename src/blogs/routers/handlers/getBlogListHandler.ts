import { Request, Response } from "express";
import { BlogQueryInput } from "../input/blogQueryInput";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import { blogService } from "../../application/blogService";
import { mapToBlogListPaginatedOutput } from "../mappers/mapToBlogListPaginatedOutputUtil";
import { ParsedQs } from "qs";
import { BlogSortField } from "../input/blogSortField";
import { SortDirection } from "../../../core/types/sortDirection";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import { HttpStatus } from "../../../core/types/httpStatus";
import { mapToBlogOutput } from "../mappers/mapToBlogOutput";
import {WithId} from "mongodb";
import {Blog} from "../../domain/blog";

export async function getBlogListHandler(req: Request<{ blogId: string}, {}, {}, ParsedQs>, res: Response){
  console.log("Вызван getBlogListHandler", req.query)
  try {
    const queryInput = {
      pageNumber: Number(req.query.pageNumber) || 1,
      pageSize: Number(req.query.pageSize) || 10,
      sortBy: (req.query.sortBy as BlogSortField) || BlogSortField.CreatedAt,
      sortDirection: req.query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
      searchBlogNameTerm: req.query.searchNameTerm as string | undefined,
      searchBlogDescriptionTerm: req.query.searchBlogDescriptionTerm as string | undefined,
    };

    // При необходимости установите дефолты
    const queryWithDefaults =
        setDefaultSortAndPaginationIfNotExist(queryInput);

    // // Получаем пагинированный результат из сервиса - с данными из БД
    const paginatedBlogs =
        await blogService.findMany(queryInput);

    // Считаем pagesCount, если в сервисе не отдаётся
    const pagesCount =
        Math.ceil(paginatedBlogs.totalCount / queryWithDefaults.pageSize);

    // // Формируем и отправляем ответ через маппер
    const responsePayload =
        mapToBlogListPaginatedOutput(

          queryWithDefaults.pageNumber,
          pagesCount,
          queryWithDefaults.pageSize,
          paginatedBlogs.totalCount,
            paginatedBlogs.items,
    );

    console.log("Ответ API:", responsePayload);
    res.status(HttpStatus.Ok).json(responsePayload);

  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).json({ message: "Blog not found" });
    }
    res.status(HttpStatus.BadRequest).json({ message: (error as Error).message || "Invalid query" });
  }
}