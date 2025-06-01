import { Request, Response } from "express";
import { PostCreateInput } from "../input/postCreateInput";
import { postService } from "../../application/postService";
import { mapToPostOutput } from "../mappers/mapToPostOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
//import { errorsHandler } from "../../../core/errors/errorsHandler";


export async function createPostHandler(
    req: Request<{ blogId: string }, {}, PostCreateInput>,
    res: Response,
) {
    try {
        const blogId = req.params.blogId;
        const dataToCreate = {
            ...req.body,
            blogId, // добавляем blogId из URL в данные поста
            createdAt: new Date().toISOString(),
        };

        const createdPostId = await postService.create(dataToCreate);
        const createdPost = await postService.findByIdOrFail(createdPostId);

        const postOutput = mapToPostOutput(createdPost);

        res.status(HttpStatus.Created).send(postOutput);
    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
            res.status(HttpStatus.NotFound).send({ message: "Blog or Post not found" });
        } else {
            console.error(error);
            res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
        }
    }
}
// export async function createPostHandler(
//   req: Request<{}, {}, PostCreateInput>,
//   res: Response,
// ) {
//
//     try {
//         const createdPostId = await postService.create(req.body);
//
//         const createdPost = await postService.findByIdOrFail(createdPostId);
//
//         const postOutput = mapToPostOutput(createdPost);
//
//         res.status(HttpStatus.Created).send(postOutput);
//     } catch (error) {
//         if (error instanceof RepositoryNotFoundError) {
//             res.status(HttpStatus.NotFound).send({ message: "Post not found" });
//         } else {
//             res.status(HttpStatus.InternalServerError).send({ message: "Internal Server Error" });
//         }
//     }
// }