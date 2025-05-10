import {BlogInputDto} from "../../../src/blogs/dto/blogInputDto";
import {Express} from "express";
import {getBlogDto} from "./getBlogDto";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {generateAdminAuthToken} from "../generateAdminAuthToken";
import {HttpStatus} from "../../../src/core/types/httpStatus";
import request from "supertest";

export async function updateBlog(
    app: Express,
    blogId: string,
    blogDto: BlogInputDto,
    ): Promise<void> {
    const defaultBlogData: BlogInputDto = getBlogDto();

    const testBlogData = {
        ...defaultBlogData,
        ...blogDto,
    };

    const updateBlogResponse =
        await request(app)
            .put(`${BLOGS_PATH}/${blogId}`)
            .set('Authorization', generateAdminAuthToken())
            .send(testBlogData)
            .expect(HttpStatus.NoContent);

    return updateBlogResponse.body;
}