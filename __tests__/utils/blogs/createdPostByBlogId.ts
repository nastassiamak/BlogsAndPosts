import request from "supertest";
import { Express } from "express";
import {PostAttributes} from "../../../src/posts/application/dtos/postAttributes";
import {PostOutput} from "../../../src/posts/routers/output/postOutput";
import {getPostDto} from "../posts/getPostDto";
import {ResourceType} from "../../../src/core/types/resourceType";
import {BLOGS_PATH, POSTS_PATH} from "../../../src/core/paths/paths";
import {generateAdminAuthToken} from "../generateAdminAuthToken";
import {HttpStatus} from "../../../src/core/types/httpStatus";

export async function createPostByBlogId(
    app: Express,
    blogId: string,
    postDto?: PostAttributes,
    ): Promise<PostOutput> {

    const defaultPostData = getPostDto(blogId);

    const testPostData = {
        data: {
            type: ResourceType.Posts,
            attributes: {
                ...defaultPostData,
                ...postDto,
            },
        },
    };
    console.log('Sending POST with body:', JSON.stringify(testPostData, null, 2));

    const createdPostResponse =
        await request(app)
            .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
            .set("Authorization", generateAdminAuthToken())
            .send(testPostData)
            .expect(HttpStatus.Created);

    console.log(createdPostResponse.body);
    return createdPostResponse.body;
}