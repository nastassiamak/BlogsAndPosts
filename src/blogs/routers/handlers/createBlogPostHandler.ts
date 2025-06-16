import { Request, Response } from "express";
import { PostCreateInput } from "../../../posts/routers/input/postCreateInput";
import { mapToPostOutput } from "../../../posts/routers/mappers/mapToPostOutput";
import { postService } from "../../../posts/application/postService";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import {blogsRepository} from "../../repositories/blogsRepository";

export async function createBlogPostHandler(
  req: Request<{id: string}, {}, PostCreateInput>,
  res: Response,
){

  const blogId = req.params.id;
  try {

    // Проверяем, что блог существует
    const blog = await blogsRepository.findByIdOrFail(blogId);
    const postData = req.body;

    const createdPostId = await postService.create({
      ...postData,
      blogId: blog._id.toString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    });
    const createdPost = await postService.findByIdOrFail(createdPostId);

    const postOutput = mapToPostOutput(createdPost);

    res.status(HttpStatus.Created).send(postOutput);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
    }

    console.error("Error in createBlogPostHandler:", error);
    res.status(HttpStatus.InternalServerError).send("Internal Server Error");
  }
}
