import { Request, Response } from "express";
import { PostCreateInput } from "../input/postCreateInput";
import { postService } from "../../application/postService";
import { mapToPostOutput } from "../mappers/mapToPostOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
//import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function createPostHandler(
  req: Request<{}, {}, PostCreateInput>,
  res: Response,
) {

    try {
        const createdPostId = await postService.create(req.body);

        const createdPost = await postService.findByIdOrFail(createdPostId);

        const postOutput = mapToPostOutput(createdPost);

        res.status(HttpStatus.Created).send(postOutput);
    } catch (error) {
        console.error("Error in createPostHandler:", error);
        res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
    }
}