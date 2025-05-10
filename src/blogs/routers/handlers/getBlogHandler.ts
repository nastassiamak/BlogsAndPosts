import { Response, Request } from "express";
import {db} from "../../../db/inMemoryDb";
import {HttpStatus} from "../../../core/types/httpStatus";
import {createErrorMessages} from "../../../core/utils/errorUtils";
import {blogsRepository} from "../../repositories/blogsRepository";
import {mapToBlogViewModelUtil} from "../mappers/mapToBlogViewModelUtil";

export async function getBlogHandler(
    req: Request, res: Response) {
    try {

        const id = req.params.id;
        const blog = await blogsRepository.findById(id);

        if (!blog) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{field: 'id', message: "Not Found"}])
                );
            return;
        }

        const blogViewModel = mapToBlogViewModelUtil(blog);

        res
            .status(HttpStatus.Ok)
            .send(blogViewModel);

    } catch (e: unknown) {
        res
            .sendStatus(HttpStatus.InternalServerError)
    }

}