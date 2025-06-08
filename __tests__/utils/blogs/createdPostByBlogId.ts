import request from "supertest";
import { Express } from "express";
import { PostAttributes } from "../../../src/posts/application/dtos/postAttributes";

import { getPostDto } from "../posts/getPostDto";
import { ResourceType } from "../../../src/core/types/resourceType";
import { BLOGS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { PostDataOutput } from "../../../src/posts/routers/output/postDataOutput";

export async function createPostByBlogId(
  app: Express,
  blogId: string,
  postDto?: Partial<Omit<PostAttributes, "blogId">>,
): Promise<PostDataOutput> {
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
    .post(`${BLOGS_PATH}/${blogId}/posts`)
    .set("Authorization", generateAdminAuthToken())
    .send(postDataToSend)
    .expect(HttpStatus.Created);

  console.log("Response body:", response.body);
  return response.body;
}
