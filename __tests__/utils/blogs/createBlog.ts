import {BlogInputDto} from "../../../src/blogs/application/dtos/blogInputDto";
import {BlogViewModel} from "../../../src/blogs/types/blogViewModel";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import request from "supertest";
import {generateAdminAuthToken} from "../generateAdminAuthToken";
import {HttpStatus} from "../../../src/core/types/httpStatus";
import {Express} from "express";
import {getBlogDto} from "./getBlogDto";


export async function createBlog(
    app: Express,
    blogDto?: BlogInputDto,
): Promise<BlogViewModel> {

    const defaultBlogData: BlogInputDto = getBlogDto();

    const testBlogData = {
        ...defaultBlogData,
        ...blogDto
    };

    const createdBlogResponse =
        await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', generateAdminAuthToken())
            .send(testBlogData)
            .expect(HttpStatus.Created);


    return createdBlogResponse.body;


}
