import { Express } from "express";
import { getPostDto } from "../posts/getPostDto";
import request from "supertest";
import { BLOGS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { PostDataOutput } from "../../../src/posts/routers/output/postDataOutput";

export async function getPostsByBlogId(
  app: Express,
  blogId: string,
): Promise<PostDataOutput> {
  const postResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
    .expect(HttpStatus.Ok);
  console.log(
    "Sending POST with body:",
    JSON.stringify(postResponse.body, null, 2),
  );
  return postResponse.body;
}
