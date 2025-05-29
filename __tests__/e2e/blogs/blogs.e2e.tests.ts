// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setupApp";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";
import { getBlogDto } from "../../utils/blogs/getBlogDto";
import { createBlog } from "../../utils/blogs/createBlog";
import { getBlogById } from "../../utils/blogs/getBlogById";
import { updateBlog } from "../../utils/blogs/updateBlog";
import { createPostByBlogId } from "../../utils/blogs/createdPostByBlogId";
import { getPostsByBlogId } from "../../utils/blogs/getPostsByBlogId";
import { blogsRepository } from "../../../src/blogs/repositories/blogsRepository";

describe("Blog API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    try {
      await runDB("mongodb://localhost:27017/test");
      console.log("Connected to test DB");
      await clearDb(app);
      console.log("Database cleared");
    } catch (error) {
      console.error("Error in beforeAll:", error);
      throw error; // повторно выбрасываем, чтобы тест падал с ошибкой
    }
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should create a blog; POST /blogs", async () => {
    const [blog] = await Promise.all([
      createBlog(app, {
        ...getBlogDto(),
      }),
    ]);

    const attributes = blog;
    expect(attributes).toHaveProperty("name");
    expect(attributes).toHaveProperty("description");
    expect(attributes).toHaveProperty("websiteUrl");
  });

  it("should return blogs list; GET /blogs", async () => {
    await Promise.all([createBlog(app), createBlog(app)]);

    const response = await request(app)
      .get(BLOGS_PATH)
     // .set("Authorization", adminToken)
      .expect(HttpStatus.Ok);

    console.log(response.body);
    // Пример если поле называется items:
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it("should return blog by id; GET /blogs/:id", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.id;

    const blog = await getBlogById(app, createdBlogId);

    expect(blog).toEqual({
      ...createdBlog,
    });
  });

  it("should create post by blogId; POST /blogs/{blogId}/posts", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.id;

    await createPostByBlogId(app, createdBlogId);
  });

  it("should return posts by blogId; GET /blogs/{blogId}/posts", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.id;
    await Promise.all([
      await createPostByBlogId(app, createdBlogId),

      await createPostByBlogId(app, createdBlogId),
    ]);
    await getPostsByBlogId(app, createdBlogId);
  });

  it("should update blog; PUT /blogs/:id", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.id;

    const blogUpdateData: BlogAttributes = {
      name: "Updated Blog",
      description: "Description new",
      websiteUrl: "http://exampleNew.com/",
    };

    await updateBlog(app, createdBlogId, blogUpdateData);

    const blogResponse = await getBlogById(app, createdBlogId);

    expect(blogResponse).toEqual({
      id: createdBlogId,
      name: blogUpdateData.name,
      description: blogUpdateData.description,
      websiteUrl: blogUpdateData.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('should delete blog and check after "NOT FOUND"; DELETE /blogs/:id', async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.id;

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlogId}`)
      .expect(HttpStatus.NotFound);
  });
});
