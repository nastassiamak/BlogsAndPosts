import { Request, Response } from "express";
import { PostCreateInput } from "../input/postCreateInput";
import { postService } from "../../application/postService";
import { mapToPostOutput } from "../mappers/mapToPostOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import { blogsQueryRepository } from "../../../blogs/repositories/blogsQueryRepository";
import { postsQueryRepository } from "../../repositories/postsQueryRepository";

export async function createPostHandler(
  req: Request<{}, {}, PostCreateInput>,
  res: Response,
) {
  try {
    // Проверяем, что блог с таким blogId из тела запроса существует
    const blog = await blogsQueryRepository.findByIdOrFail(req.body.blogId);

    // Добавляем имя блога и дату создания в тело поста
    const postData = {
      ...req.body,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const createdPostId = await postService.create(postData);
    const createdPost =
      await postsQueryRepository.findByIdOrFail(createdPostId);

    const postOutput = mapToPostOutput(createdPost);
    res.status(HttpStatus.Created).send(postOutput);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
    }
    console.error("Error in createPostHandler:", error);
    res
      .status(HttpStatus.InternalServerError)
      .send({ message: "Internal Server Error" });
  }
}
