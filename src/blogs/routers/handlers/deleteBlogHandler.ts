import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { blogService } from "../../application/blogService";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";

export async function deleteBlogHandler(
  req: Request<{ blogId: string }>,
  res: Response,
): Promise<void> {
  try {
    const blogId = req.params.blogId;

    await blogService.delete(blogId);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
    }
    console.error("Error in deletePostHandler:", error);
    res.status(HttpStatus.InternalServerError);
  }
}
