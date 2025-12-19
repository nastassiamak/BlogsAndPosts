// @ts-ignore
import request from "supertest";
import { Express } from "express";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";

import { BlogDataOutput } from "../../../src/blogs/routers/output/blogDataOutput";

export async function getBlogById(
  app: Express,
  id: string,
): Promise<BlogDataOutput> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${id}`)
    .expect(HttpStatus.Ok);

  console.log(
    "Sending POST with body:",
    JSON.stringify(blogResponse.body, null, 2),
  );
  return blogResponse.body;
}
