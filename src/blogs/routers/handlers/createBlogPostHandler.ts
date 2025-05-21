import { Request, Response} from 'express';
import {PostCreateInput} from "../../../posts/routers/input/postCreateInput";
import {blogService} from "../../application/blogService";
import {mapToPostOutput} from "../../../posts/routers/mappers/mapToPostOutput";
import {postService} from "../../../posts/application/postService";
import {mapToBlogPostOutput} from "../mappers/mapToBlogPostOutput";
import {HttpStatus} from "../../../core/types/httpStatus";
import {errorsHandler} from "../../../core/errors/errorsHandler";

export async function createBlogPostHandler(
    req: Request< {id: string}, {}, PostCreateInput>,
    res: Response,
) {
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

        const createdPost = await postService.create(postCreateData);

       // const createBlogPost = await postService
       //     .createPostByBlogId(createdPost, blog)

        const blogPostOutput = mapToPostOutput(postDataWithBlog);

        return res.status(HttpStatus.Created).send(blogPostOutput);
    } catch (e: unknown) {
        errorsHandler(e, res)
    }
}