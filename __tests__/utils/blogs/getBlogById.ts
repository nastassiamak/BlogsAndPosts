// @ts-ignore
import request from "supertest";
import { Express } from "express";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { BlogOutput } from "../../../src/blogs/routers/output/blogOutput";

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<BlogOutput> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    //.set("Authorization", generateAdminAuthToken())
    .expect(HttpStatus.Ok);

  return blogResponse.body;
}
