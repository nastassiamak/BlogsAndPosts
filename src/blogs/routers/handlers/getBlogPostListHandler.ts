import { Request, Response } from "express";
import { postService } from "../../../posts/application/postService";
import { ParsedQs } from "qs";
import { SortDirection } from "../../../core/types/sortDirection";
import { PostSortField } from "../../../posts/routers/input/postSortField";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import {blogService} from "../../application/blogService";


export async function getBlogPostListHandler(
  req: Request<{blogId: string}, {}, {}, ParsedQs>,
  res: Response,
) {
  console.log("Хендлер: getBlogPostListHandler, params:", req.params, "query:", req.query);
  // function parseBlogPostQuery(query: ParsedQs): PostQueryInput {
  //   return {
  //     pageNumber: Number(query.pageNumber) || 1,
  //     pageSize: Number(query.pageSize) || 10,
  //     sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
  //     sortDirection:
  //       query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc,
  //
  //   };
  // }

  try {
    const blogId = await blogService.findByIdOrFail(req.params.blogId);
    console.log("Получен запрос на blogId:", blogId);
    const rawPageNumber = req.query.pageNumber as string | undefined;
    const rawPageSize = req.query.pageSize as string | undefined;
    const rawSortBy = req.query.sortBy as string | undefined;
    const rawSortDir = req.query.sortDirection as string | undefined;

    const pageNumber = rawPageNumber && +rawPageNumber > 0 ? +rawPageNumber : 1;
    const pageSize = rawPageSize && +rawPageSize > 0 ? +rawPageSize : 10;
    const sortBy = rawSortBy && Object.values(PostSortField).includes(rawSortBy as PostSortField)
        ? rawSortBy as PostSortField
        : PostSortField.CreatedAt;
    const sortDirection = rawSortDir === 'asc' ? SortDirection.Asc : SortDirection.Desc;


    // const pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    // const pageSizeRaw = req.query.pageSize ? Number(req.query.pageSize) : 10;
    // const pageSize = pageSizeRaw > 0 ? pageSizeRaw : 10;
    // const sortBy = (req.query.sortBy as PostSortField) || PostSortField.CreatedAt;
    // const sortDirection = (req.query.sortDirection as string) === "asc" ? SortDirection.Asc : SortDirection.Desc

    const paginatedPosts = await postService.findPostsByBlogId(
        { pageNumber, pageSize, sortBy, sortDirection },
        blogId._id.toString(),
    );

    const pagesCount = Math.ceil(paginatedPosts.totalCount / pageSize);

    const response = {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount: paginatedPosts.totalCount,
      items: paginatedPosts.items,
    };

    res.status(200).json(response);

    // const blog = await blogService.findByIdOrFail(blogId);
    // const queryInput = { ...parseBlogPostQuery(req.query), blogId };
    //
    // const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);
    // console.log("Параметры запроса:", queryWithDefaults);
    //
    // // Получаем данные с пагинацией
    // const paginatedPosts = await postService.findPostsByBlogId(
    //   queryWithDefaults,
    //     blog._id.toString(),
    // );
    //
    // const safePageSize =
    //     queryWithDefaults.pageSize > 0 ? queryWithDefaults.pageSize : 10;
    //
    // const pagesCount =
    //     Math.ceil(paginatedPosts.totalCount / safePageSize);
    // // const pagesCount =
    // //     Math.ceil(paginatedPosts.totalCount / queryWithDefaults.pageSize);
    //
    // // Формируем итоговый ответ с пагинацией и преобразованными постами
    // const responsePayload = mapToBlogPostListPaginatedOutput(
    //
    //     queryWithDefaults.pageNumber,
    //     pagesCount,
    //     queryWithDefaults.pageSize,
    //     paginatedPosts.totalCount,
    //     paginatedPosts.items,
    // );
    //
    // console.log("Формируем ответ:", responsePayload);
    //
    // res.status(HttpStatus.Ok).send(responsePayload);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
      return;
    }
    console.error(error);
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}
