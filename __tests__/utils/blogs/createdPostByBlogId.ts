import request from "supertest";
import { Express } from "express";
import { getPostDto } from "../posts/getPostDto";
import { BLOGS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import {PostCreateInput} from "../../../src/posts/routers/input/postCreateInput";

export async function createPostByBlogId(
  app: Express,
  blogId: string,
  postDto?: Partial<PostCreateInput>,
): Promise<PostCreateInput> {
  const defaultPostData = getPostDto(blogId);

  const postDataToSend = {
    ...defaultPostData,
    ...postDto,
  };

  console.log(
    "Sending POST with body:",
    JSON.stringify(postDataToSend, null, 2),
  );

  const response = await request(app)
    .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
    .set("Authorization", generateAdminAuthToken())
    .send(postDataToSend)
    .expect(HttpStatus.Created);

  console.log("Response body:", response.body);
  return response.body;
}
