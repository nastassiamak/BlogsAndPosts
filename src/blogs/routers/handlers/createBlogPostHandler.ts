import { Request, Response} from 'express';
import {PostCreateInput} from "../../../posts/routers/input/postCreateInput";
import {blogService} from "../../application/blogService";
import {mapToPostOutput} from "../../../posts/routers/mappers/mapToPostOutput";
import {postService} from "../../../posts/application/postService";

import {HttpStatus} from "../../../core/types/httpStatus";
import {errorsHandler} from "../../../core/errors/errorsHandler";
import {mapToBlogPostOutput} from "../mappers/mapToBlogPostOutput";

export async function createBlogPostHandler(
    req: Request< {id: string}, {}, PostCreateInput>,
    res: Response,
): Promise<void> {
    try {
        const {id} = req.params;

        const postCreateData = req.body.data.attributes;
        const blog = await blogService
            .findByIdOrFail(id)


        const postDataWithBlog = {
            ...postCreateData,
            blogId: blog._id.toString(),  // или blog.id, в зависимости от типа
            blogName: blog.name || "",
        };

        const createdPostId = await postService
            .create(postDataWithBlog);
        const createdPost = await postService.findByIdOrFail(createdPostId)

        const postOutput = mapToBlogPostOutput(blog, createdPost)

         res.status(HttpStatus.Created).send(postOutput);
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}