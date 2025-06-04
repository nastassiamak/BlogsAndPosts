import { PostAttributes } from "../../../src/posts/application/dtos/postAttributes";
import { Express } from "express";
import { PostUpdateInput } from "../../../src/posts/routers/input/postUpdateInput";
import { ResourceType } from "../../../src/core/types/resourceType";
import { getPostDto } from "./getPostDto";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import request from "supertest";

export async function updatePost(
  app: Express,
  blogId: string,
  postId: string,
  postDto?: PostAttributes,
): Promise<void> {
  const testPostData = {
    id: postId,

    ...getPostDto(blogId),
    ...postDto,
  };
  console.log(
    "Sending update request with data:",
    JSON.stringify(testPostData, null, 2),
  );

  const updatePostResponse = await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set("Authorization", generateAdminAuthToken())
    .send(testPostData)
    .expect(HttpStatus.NoContent);

  return updatePostResponse.body;
}
