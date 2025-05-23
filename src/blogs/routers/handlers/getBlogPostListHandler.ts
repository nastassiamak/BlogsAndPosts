import { Request, Response } from "express";
import { PostQueryInput } from "../../../posts/routers/input/postQueryInput";
import { postService } from "../../../posts/application/postService";
import { mapToPostListPaginatedOutput } from "../../../posts/routers/mappers/mapToPostListPaginatedOutputUtil";
import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function getBlogPostListHandler(
  req: Request<{ id: string }, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const blogId = req.params.id;
    const queryInput = req.query;

    const { items, totalCount } = await postService.findPostsByBlog(
      queryInput,
      blogId,
    );

    const postListOutput = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(postListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
