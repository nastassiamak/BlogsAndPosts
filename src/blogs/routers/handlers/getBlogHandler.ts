import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { mapToBlogOutput } from "../mappers/mapToBlogOutput";
import { blogService } from "../../application/blogService";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
//import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function getBlogHandler(
  req: Request<{ blogId: string }>,
  res: Response,
) {
  try {
    const blogId = req.params.blogId;
    const blog = await blogService.findByIdOrFail(blogId);

    const blogOutput = mapToBlogOutput(blog);

    res.status(HttpStatus.Ok).send(blogOutput);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
    } else {
      res
        .status(HttpStatus.InternalServerError)
        .send({ message: "Internal Server Error" });
    }
  }
}
