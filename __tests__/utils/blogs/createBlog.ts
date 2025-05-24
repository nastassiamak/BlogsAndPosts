// @ts-ignore
import request from "supertest";
import { Express } from "express";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { BlogOutput } from "../../../src/blogs/routers/output/blogOutput";
import { BlogCreateInput } from "../../../src/blogs/routers/input/blogCreateInput";
import { ResourceType } from "../../../src/core/types/resourceType";
import { getBlogDto } from "./getBlogDto";

export async function createBlog(
  app: Express,
  blogDto?: BlogAttributes,
): Promise<BlogOutput> {
  const testBlogData: BlogCreateInput = {
    data: {
      type: ResourceType.Blogs,
      attributes: { ...getBlogDto(), ...blogDto },
    },
  };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateAdminAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  console.log(createdBlogResponse.body);

  return createdBlogResponse.body;
}
