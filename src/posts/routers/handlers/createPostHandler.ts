import {PostCreateInput} from "../input/postCreateInput";
import {postService} from "../../application/postService";
import { Request, Response } from 'express';
import {mapToBlogOutput} from "../../../blogs/routers/mappers/mapToBlogOutput";
import {mapToPostOutputUtil} from "../mappers/mapToPostOutputUtil";
import {HttpStatus} from "../../../core/types/httpStatus";
import {errorsHandler} from "../../../core/errors/errorsHandler";

export async function createPostHandler(
    req: Request<{},{}, PostCreateInput>,
    res: Response,
) {
    try {
        const createdPostId =
            await postService.create(req.body.data.attributes);

        const createdPost =
            await postService.findByIdOrFail(createdPostId);
        // Периодическая проверка на null (если ваша функция все еще возвращает null)
        if (createdPost === null) {
            // Обработка ситуации, когда пост не найден
            return res.status(HttpStatus.NotFound).send({ error: 'Post not found' });
        }


        const postOutput =
            mapToPostOutputUtil(createdPost);
        res
            .status(HttpStatus.Created)
            .send(postOutput)
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}