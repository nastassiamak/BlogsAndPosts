import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { mapToBlogOutput } from "../mappers/mapToBlogOutput";
import { BlogCreateInput } from "../input/blogCreateInput";
import { blogService } from "../../application/blogService";
import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function createBlogHandler(
  req: Request<{}, {}, BlogCreateInput>,
  res: Response,
) {
  try {
    console.log(
      "createBlogHandler req.body:",
      JSON.stringify(req.body, null, 2),
    );
    const createdBlogId = await blogService.create(req.body);

    const createdBlog = await blogService.findByIdOrFail(createdBlogId);

    const blogOutput = mapToBlogOutput(createdBlog);

    res.status(HttpStatus.Created).send(blogOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
