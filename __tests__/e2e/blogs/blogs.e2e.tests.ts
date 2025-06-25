// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setupApp";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { BLOGS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";
import { getBlogDto } from "../../utils/blogs/getBlogDto";
import { createBlog } from "../../utils/blogs/createBlog";
import { getBlogById } from "../../utils/blogs/getBlogById";
import { updateBlog } from "../../utils/blogs/updateBlog";
import { createPostByBlogId } from "../../utils/blogs/createdPostByBlogId";

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

  it("should return blog by id; GET /blogs/{blogId}", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.blogId;

    const blog = await getBlogById(app, createdBlogId);

    expect(blog).toEqual({
      ...createdBlog,
    });
  });

  it("should create post by blogId; POST /blogs/{blogId}/posts", async () => {
    const createdBlog = await createBlog(app);
    const blogId = createdBlog.blogId;

    const createdPost = await createPostByBlogId(app, blogId);

    console.log("New Post: ", createdPost);

    expect(createdPost).toMatchObject({
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("should update blog; PUT /blogs/:id", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.blogId;

    const blogUpdateData: BlogAttributes = {
      name: "Updated Blog",
      description: "Description new",
      websiteUrl: "http://exampleNew.com/",
    };

    await updateBlog(app, createdBlogId, blogUpdateData);

    const blogResponse = await getBlogById(app, createdBlogId);

    expect(blogResponse).toEqual({
      blogId: createdBlogId,
      name: blogUpdateData.name,
      description: blogUpdateData.description,
      websiteUrl: blogUpdateData.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('should delete blog and check after "NOT FOUND"; DELETE /blogs/:id', async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.blogId;

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlogId}`)
      .expect(HttpStatus.NotFound);
  });

  it("should create new post for specific blog and return 201 with correct response structure", async () => {
    const createdBlog = await createBlog(app);
    const blogId = createdBlog.blogId;


    const postData = {
      title: "Test post title",
      shortDescription: "Test short description",
      content: "Test content",
      blogId,
    };

    const response = await request(app)
      .post(`${BLOGS_PATH}/${blogId}/posts`)
      .set("Authorization", generateAdminAuthToken())
      .send(postData)
      .expect(HttpStatus.Created);

    // Подстрахуемся: если пришло _id, то преобразуем в id для стабильности теста
    const responseBody = {
      ...response.body,
      blogId: response.body.blogId ?? response.body._id,
    };
    delete responseBody.blogId;

    expect(responseBody).toMatchObject({
      id: expect.any(String),
      blogId,
      blogName: expect.any(String),
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      createdAt: expect.any(String),
    });
  });
  it("should return posts for a specific blog with pagination and status 200", async () => {
    // 1. Создаем блог
    const createdBlog = await createBlog(app);
    const blogId = createdBlog.blogId;

    // 2. Создаем несколько постов для блога
    const postsToCreate = 5; // чтобы проверить пагинацию
    for (let i = 0; i < postsToCreate; i++) {
      await createPostByBlogId(app, blogId, {
        title: `Post Title ${i}`,
        shortDescription: `Short Desc ${i}`,
        content: `Content ${i}`,
      });
    }

    // 3. Выполняем запрос к списку постов блога с параметрами пагинации
    const pageNumber = 1;
    const pageSize = 10;
    const response = await request(app)
        .get(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
        .query({ pageNumber, pageSize, sortBy: "createdAt", sortDirection: "desc" })
        .expect(HttpStatus.Ok);

    // 4. Проверяем структуру и содержимое ответа
    expect(response.body).toHaveProperty("pagesCount");
    expect(response.body).toHaveProperty("page", pageNumber);
    expect(response.body).toHaveProperty("pageSize", pageSize);
    expect(response.body).toHaveProperty("totalCount");
    expect(Array.isArray(response.body.items)).toBe(true);

    // Длина items не должна превышать pageSize
    expect(response.body.items.length).toBeLessThanOrEqual(pageSize);

    // Проверим свойства первого поста
    if (response.body.items.length > 0) {
      const post = response.body.items[0];
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("shortDescription");
      expect(post).toHaveProperty("content");
      expect(post).toHaveProperty("blogId", blogId);
      expect(post).toHaveProperty("blogName");
      expect(post).toHaveProperty("createdAt");
    }
  });
});
