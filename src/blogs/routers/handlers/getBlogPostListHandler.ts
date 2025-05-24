import { Request, Response } from "express";
import { PostQueryInput } from "../../../posts/routers/input/postQueryInput";
import { postService } from "../../../posts/application/postService";
import { mapToPostListPaginatedOutput } from "../../../posts/routers/mappers/mapToPostListPaginatedOutputUtil";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";

export async function getBlogPostListHandler(
  req: Request<{ id: string }, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const blogId = req.params.id;

    const queryInput =  setDefaultSortAndPaginationIfNotExist(req.query);


    const { items, totalCount } = await postService.findPostsByBlog(
      queryInput,
      blogId,
    );

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    },
        blogId);
    res.send(postListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
