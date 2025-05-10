import {Response, Request} from 'express';
import {BlogInputDto} from "../../application/dtos/blogInputDto";
import {db} from "../../../db/inMemoryDb";
import {HttpStatus} from "../../../core/types/httpStatus";
import {createErrorMessages} from "../../../core/utils/errorUtils";
import {blogsRepository} from "../../repositories/blogsRepository";

export async function updateBlogHandler(
    req: Request<{id: string}, {}, BlogInputDto>,
    res: Response) {
    try {

        const id = req.params.id;
        const blog = await blogsRepository.findById(id);

        if (!blog) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{field: 'id', message: 'Blog id not found'}])
                );
            return;
        }

        await blogsRepository.update(id, req.body);

        res
            .sendStatus(HttpStatus.NoContent)

    } catch (e: unknown) {
        res
            .status(HttpStatus.InternalServerError)
    }
}