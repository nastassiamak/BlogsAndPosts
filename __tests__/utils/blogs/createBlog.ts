// @ts-ignore
import request from "supertest";
import { Express } from "express";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";

import { BlogCreateInput } from "../../../src/blogs/routers/input/blogCreateInput";
import { ResourceType } from "../../../src/core/types/resourceType";
import { getBlogDto } from "./getBlogDto";
import { BlogDataOutput } from "../../../src/blogs/routers/output/blogDataOutput";

export async function createBlog(
  app: Express,
  blogDto?: BlogAttributes,
): Promise<BlogDataOutput> {
  const testBlogData: BlogCreateInput = {
    ...getBlogDto(),
    ...blogDto,
  };
  console.log("Request body:", JSON.stringify(testBlogData, null, 2)); // Здесь

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Content-Type", "application/json")
    .set("Authorization", generateAdminAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  console.log(createdBlogResponse.body);

  return createdBlogResponse.body;
}
