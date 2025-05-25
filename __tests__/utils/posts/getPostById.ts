import { PostOutput } from "../../../src/posts/routers/output/postOutput";
import { Express } from "express";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import request from "supertest";

export async function getPostById(
  app: Express,
  postId: string,
): Promise<PostOutput> {
  const getResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    //.set("Authorization", generateAdminAuthToken())
    .expect(HttpStatus.Ok);

  return getResponse.body;
}
