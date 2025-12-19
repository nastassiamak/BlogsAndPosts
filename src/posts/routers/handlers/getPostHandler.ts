import { Request, Response } from "express";
import { mapToPostOutput } from "../mappers/mapToPostOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import { postsQueryRepository } from "../../repositories/postsQueryRepository";

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const post = await postsQueryRepository.findByIdOrFail(id);

    const postOutput = mapToPostOutput(post);

    res.status(HttpStatus.Ok).send(postOutput);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Post not found" });
    } else {
      res
        .status(HttpStatus.InternalServerError)
        .send({ message: "Internal Server Error" });
    }
  }
}
