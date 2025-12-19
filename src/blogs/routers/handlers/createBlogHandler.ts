import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { mapToBlogOutput } from "../mappers/mapToBlogOutput";
import { BlogCreateInput } from "../input/blogCreateInput";
import { blogService } from "../../application/blogService";
import { blogsQueryRepository } from "../../repositories/blogsQueryRepository";

export async function createBlogHandler(
  req: Request<{}, {}, BlogCreateInput>,
  res: Response,
) {
  try {
    const createdBlogId = await blogService.create(req.body);

    const createdBlog =
      await blogsQueryRepository.findByIdOrFail(createdBlogId);

    const blogOutput = mapToBlogOutput(createdBlog);

    res.status(HttpStatus.Created).send(blogOutput);
  } catch (error) {
    console.error("Error in createBlogHandler:", error);
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}
