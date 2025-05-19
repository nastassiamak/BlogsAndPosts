import { Request, Response} from "express";
import {errorsHandler} from "../../../core/errors/errorsHandler";
import {PostUpdateInput} from "../input/postUpdateInput";
import {postService} from "../../application/postService";
import {HttpStatus} from "../../../core/types/httpStatus";

export async function updatePostHandler(
    req: Request<{id: string}, {}, PostUpdateInput>,
    res: Response
) {
    try {
        const id = req.params.id;

        await postService.update(id, req.body.data.attributes);

        res
            .sendStatus(HttpStatus.NoContent);

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}