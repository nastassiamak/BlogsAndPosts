import { PostAttributes } from "../../../src/posts/application/dtos/postAttributes";

import { PostCreateInput } from "../../../src/posts/routers/input/postCreateInput";
import { ResourceType } from "../../../src/core/types/resourceType";
import { Express } from "express";
import { getPostDto } from "./getPostDto";
import request from "supertest";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { createBlog } from "../blogs/createBlog";
import { PostDataOutput } from "../../../src/posts/routers/output/postDataOutput";

export async function createPost(
  app: Express,
  postDto?: PostAttributes,
): Promise<PostDataOutput> {
  const blog = await createBlog(app);

  const defaultPostData = getPostDto(blog.blogId);
  const testPostData = {
    ...defaultPostData,
    ...postDto,
  };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateAdminAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  console.log(createdPostResponse.body);
  return createdPostResponse.body;
}
