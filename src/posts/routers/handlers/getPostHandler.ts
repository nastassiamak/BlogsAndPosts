import { Request, Response } from "express";
import { postService } from "../../application/postService";
import { mapToPostOutput } from "../mappers/mapToPostOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
//import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) { try {

    const id = req.params.id;
    const post = await postService.findByIdOrFail(id);

    const postOutput = mapToPostOutput(post);

    res.status(HttpStatus.Ok).send(postOutput);
} catch (error) {
    if (error instanceof RepositoryNotFoundError) {
        res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
    } else {
        res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
    }
}


}
