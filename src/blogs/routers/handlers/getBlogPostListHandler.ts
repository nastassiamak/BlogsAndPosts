import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { SortDirection } from "../../../core/types/sortDirection";
import { PostSortField } from "../../../posts/routers/input/postSortField";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import { blogsQueryRepository } from "../../repositories/blogsQueryRepository";
import { postsQueryRepository } from "../../../posts/repositories/postsQueryRepository";

export async function getBlogPostListHandler(
  req: Request<{ blogId: string }, {}, {}, ParsedQs>,
  res: Response,
) {
  console.log(
    "Хендлер: getBlogPostListHandler, params:",
    req.params,
    "query:",
    req.query,
  );
  try {
    const blogId = await blogsQueryRepository.findByIdOrFail(req.params.blogId);
    console.log("Получен запрос на blogId:", blogId);
    const rawPageNumber = req.query.pageNumber as string | undefined;
    const rawPageSize = req.query.pageSize as string | undefined;
    const rawSortBy = req.query.sortBy as string | undefined;
    const rawSortDir = req.query.sortDirection as string | undefined;

    const pageNumber = rawPageNumber && +rawPageNumber > 0 ? +rawPageNumber : 1;
    const pageSize = rawPageSize && +rawPageSize > 0 ? +rawPageSize : 10;
    const sortBy =
      rawSortBy &&
      Object.values(PostSortField).includes(rawSortBy as PostSortField)
        ? (rawSortBy as PostSortField)
        : PostSortField.CreatedAt;
    const sortDirection =
      rawSortDir === "asc" ? SortDirection.Asc : SortDirection.Desc;

    const paginatedPosts = await postsQueryRepository.findPostsByBlog(
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

    res.status(HttpStatus.Ok).json(response);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
      return;
    }
    console.error(error);
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}
