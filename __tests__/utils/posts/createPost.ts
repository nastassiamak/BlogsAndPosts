import { PostAttributes } from "../../../src/posts/application/dtos/postAttributes";

import { PostCreateInput } from "../../../src/posts/routers/input/postCreateInput";
import { ResourceType } from "../../../src/core/types/resourceType";
import { Express } from "express";
import { getPostDto } from "./getPostDto";
import request from "supertest";
import {BLOGS_PATH, POSTS_PATH} from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { createBlog } from "../blogs/createBlog";
import {PostDataOutput} from "../../../src/posts/routers/output/postDataOutput";
import {BlogCreateInput} from "../../../src/blogs/routers/input/blogCreateInput";
import {getBlogDto} from "../blogs/getBlogDto";

export async function createPost(
  app: Express,
  id: string,
  postDto?: PostAttributes,
): Promise<PostDataOutput> {
  const testPostData: PostCreateInput = {
    ...getPostDto(id), ...postDto
  };
  const url = `${BLOGS_PATH}/${id}${POSTS_PATH}`;
  console.log("Request URL:", url);
  const createdPostResponse = await request(app)
    .post(url)
    .set("Authorization", generateAdminAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  console.log(createdPostResponse.body);
  return createdPostResponse.body;
}
