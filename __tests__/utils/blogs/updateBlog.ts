// @ts-ignore
import request from "supertest";
import { Express } from "express";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { BlogUpdateInput } from "../../../src/blogs/routers/input/blogUpdateInput";
import { ResourceType } from "../../../src/core/types/resourceType";
import { getBlogDto } from "./getBlogDto";

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto?: BlogAttributes,
): Promise<void> {
  const testBlogData: BlogUpdateInput = {

    blogId,

    ...getBlogDto(),
    ...blogDto,

  };
  console.log(
    "Sending update request with data:",
    JSON.stringify(testBlogData, null, 2),
  );

  const updateBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set("Authorization", generateAdminAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);

  return updateBlogResponse.body;
}
