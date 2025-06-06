import express, { response } from "express";
import { setupApp } from "../../../src/setupApp";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { before } from "node:test";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";
import { createPost } from "../../utils/posts/createPost";
import request from "supertest";
import {BLOGS_PATH, POSTS_PATH} from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { getPostById } from "../../utils/posts/getPostById";
import { ResourceType } from "../../../src/core/types/resourceType";
import { PostAttributes } from "../../../src/posts/application/dtos/postAttributes";
import { createBlog } from "../../utils/blogs/createBlog";
import { updatePost } from "../../utils/posts/updatePost";

describe("Posts API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    await runDB("mongodb://localhost:27017/test");
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should create post; POST /posts", async () => {
    const post = await createPost(app);

    expect(post).toHaveProperty("title");
    expect(post).toHaveProperty("shortDescription");
    expect(post).toHaveProperty("content");
    expect(post).toHaveProperty("blogId");
  });
  it("should return paginated and sorted posts list", async () => {
    // Создаем блог, чтобы у постов был валидный blogId
    const blogResponse = await request(app)
        .post(BLOGS_PATH)
        .set("Authorization", adminToken)
        .send({
          name: "Test Blog",
          description: "Description",
          websiteUrl: "https://example.com",
        })
        .expect(HttpStatus.Created);

    const blogId = blogResponse.body.id;

    // Создаем 15 постов с разными датами создания и заголовками
    const postsData = Array.from({ length: 15 }, (_, i) => ({
      title: `Post Title ${i + 1}`,
      shortDescription: `Short Desc ${i + 1}`,
      content: `Content ${i + 1}`,
      blogId,
    }));

    for (const postData of postsData) {
      await request(app)
          .post(POSTS_PATH)
          .set("Authorization", adminToken)
          .send(postData)
          .expect(HttpStatus.Created);
      // Если в вашем API нельзя задать createdAt вручную, то сортировка по createdAt будет по времени вставки
    }

    const pageNumber = 1;
    const pageSize = 10;
    const sortBy = "createdAt";
    const sortDirection = "desc";

    const response = await request(app)
        .get(POSTS_PATH)
        .query({ pageNumber, pageSize, sortBy, sortDirection })
        .expect(HttpStatus.Ok);

    const body = response.body;

    expect(body).toHaveProperty("items");
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeLessThanOrEqual(pageSize);

    expect(body.page).toBe(pageNumber);
    expect(body.pageSize).toBe(pageSize);
    expect(body.totalCount).toBeGreaterThanOrEqual(postsData.length);
    expect(body.pagesCount).toBe(Math.ceil(body.totalCount / pageSize));

    // Проверяем сортировку: каждый следующий post.createdAt меньше или равен предыдущему
    for (let i = 1; i < body.items.length; i++) {
      const prevDate = new Date(body.items[i - 1].createdAt).getTime();
      const curDate = new Date(body.items[i].createdAt).getTime();
      expect(prevDate).toBeGreaterThanOrEqual(curDate);
    }
  });



  it("should return posts by id; GET /posts/:id", async () => {
    const createdPost = await createPost(app);
    const createdPostId = createdPost.id;

    const getPost = await getPostById(app, createdPostId);

    expect(getPost).toEqual({
      ...createdPost,
    });
  });

  it("should update post; PUT /posts/:id ", async () => {
    const createdBlog = await createBlog(app);
    const createdBlogId = createdBlog.id;
    const createdPost = await createPost(app);
    const createdPostId = createdPost.id;

    const postUpdateData: PostAttributes = {
      title: "newTit",
      shortDescription: "NewSh",
      content: "newCon",
      blogId: createdBlogId,
    };

    await updatePost(app, createdBlogId, createdPostId);

    const postResponse = await getPostById(app, createdPostId);

    expect(postResponse).toEqual({
      id: createdPostId,
      title: postResponse.title,
      shortDescription: postResponse.shortDescription,
      content: postResponse.content,
      blogId: createdBlogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('should delete post and check after "NOT FOUND"; DELETE /posts/:id', async () => {
    const createdPost = await createPost(app);
    const createdPostId = createdPost.id;
    await request(app)
      .delete(`${POSTS_PATH}/${createdPostId}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${POSTS_PATH}/${createdPostId}`)
      .expect(HttpStatus.NotFound);
  });
});
