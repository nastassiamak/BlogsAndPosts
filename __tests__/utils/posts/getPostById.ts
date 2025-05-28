
import { Express } from "express";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import request from "supertest";
import {PostDataOutput} from "../../../src/posts/routers/output/postDataOutput";

export async function getPostById(
  app: Express,
  postId: string,
): Promise<PostDataOutput> {
  const getResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    //.set("Authorization", generateAdminAuthToken())
    .expect(HttpStatus.Ok);

  return getResponse.body;
}
