import {BlogViewModel} from "../../../src/blogs/types/blogViewModel";
import {Express} from "express";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {generateAdminAuthToken} from "../generateAdminAuthToken";
import request from "supertest";
import {HttpStatus} from "../../../src/core/types/httpStatus";

export async function getBlogById(
    app: Express,
    blogId: string,
): Promise<BlogViewModel> {
    const blogResponse =
        await request(app)
            .get(`${BLOGS_PATH}/${blogId}`)
            .set('Authorization', generateAdminAuthToken())
            .expect(HttpStatus.Ok);

    return blogResponse.body;
}