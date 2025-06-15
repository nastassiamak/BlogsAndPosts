import { setupApp } from "../../../src/setupApp";
import express from "express";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";
import request from "supertest";
import { POSTS_PATH, BLOGS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import { getBlogDto } from "../../utils/blogs/getBlogDto";

describe("Posts API body validation check", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();
  const correctTestBlogAttributes: BlogAttributes = getBlogDto();

  let blogId: string;

  beforeAll(async () => {
    await runDB("mongodb://localhost:27017/test");
    await clearDb(app);

    // Создаём блог для постов
    const blogRes = await request(app)
        .post(BLOGS_PATH)
        .set("Authorization", adminToken)
        .send(correctTestBlogAttributes)
        .expect(HttpStatus.Created);

    blogId = blogRes.body.id;

    // Создаём несколько постов с разными createdAt
    const now = Date.now();
    const postsToCreate = [
      { title: "Post A", shortDescription: "Desc A", content: "Cont A", blogId, createdAt: new Date(now - 100000) },
      { title: "Post B", shortDescription: "Desc B", content: "Cont B", blogId, createdAt: new Date(now - 50000) },
      { title: "Post C", shortDescription: "Desc C", content: "Cont C", blogId, createdAt: new Date(now) },
    ];

    for (const post of postsToCreate) {
      await request(app)
          .post(POSTS_PATH)
          .set("Authorization", adminToken)
          .send(post)
          .expect(HttpStatus.Created);
    }
  });

  afterAll(async () => {
    await stopDb();
  });

  // Ваши тесты валидации создания постов (оставляем без изменений)
  describe("POST /posts - create post validation", () => {
    it("should not create post when empty body passed", async () => {
      const response = await request(app)
          .post(POSTS_PATH)
          .send({})
          .expect(HttpStatus.Unauthorized);

      expect(response.body).toHaveProperty("message");
      expect(typeof response.body.message).toBe("string");
    });
    it("should not create post when invalid body passed", async () => {
      const invalidDataSet1 = await request(app)
          .post(POSTS_PATH)
          .set("Authorization", adminToken)
          .send({ title: "   ", shortDescription: "", content: 1 })
          .expect(HttpStatus.BadRequest);
      expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

      const invalidDataSet2 = await request(app)
          .post(POSTS_PATH)
          .set("Authorization", adminToken)
          .send({ title: 21, shortDescription: "   ", content: "2vgg", blogId: 1 })
          .expect(HttpStatus.BadRequest);
      expect(invalidDataSet2.body.errorsMessages).toHaveLength(2);
    });
  });

  // GET тесты
  describe("GET /posts - initial state and basic list", () => {
    it("should return some posts list after creation", async () => {
      const res = await request(app)
          .get(POSTS_PATH)
          .expect(HttpStatus.Ok);

      expect(res.body).toHaveProperty("items");
      expect(Array.isArray(res.body.items)).toBe(true);

      expect(res.body).toHaveProperty("page", 1);
      expect(res.body).toHaveProperty("pageSize");
      expect(res.body).toHaveProperty("totalCount");
      expect(res.body).toHaveProperty("pagesCount");

    });

    it("should return 200 with no query parameters", async () => {
      const res = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);
      expect(res.body).toHaveProperty("items");
      console.log(res.body);
    });
  });

  describe("GET /posts - pagination and sorting params", () => {
    it("should return 200 with only pageNumber param", async () => {
      const res = await request(app)
          .get(POSTS_PATH)
          .query({ pageNumber: 2, pageSize: 2 })
          .expect(HttpStatus.Ok);

      console.log(res.body);
      expect(res.body).toHaveProperty("page", 2);
      expect(res.body).toHaveProperty("pageSize", 2);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBeLessThanOrEqual(2);
    });

    it("should return 200 with pageNumber and pageSize", async () => {
      const res = await request(app)
          .get(POSTS_PATH)
          .query({ pageNumber: 1, pageSize: 2 })
          .expect(HttpStatus.Ok);
      expect(res.body).toHaveProperty("pageSize", 2);
      expect(res.body.items.length).toBeLessThanOrEqual(2);
    });

    it("should return 200 when adding valid sortBy and sort ascending", async () => {
      const res = await request(app)
          .get(POSTS_PATH)
          .query({ pageNumber: 1, pageSize: 10, sortBy: "createdAt", sortDirection: "asc" })
          .expect(HttpStatus.Ok);
      expect(res.body).toHaveProperty("items");

      // Проверка сортировки по дате по возрастанию
      const dates = res.body.items.map((item: any) => new Date(item.createdAt).getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i - 1]);
      }
    });

    it("should return 200 when adding valid sortBy and sort descending", async () => {
      const res = await request(app)
          .get(POSTS_PATH)
          .query({ pageNumber: 1, pageSize: 10, sortBy: "createdAt", sortDirection: "desc" })
          .expect(HttpStatus.Ok);
      expect(res.body).toHaveProperty("items");

      // Проверка сортировки по дате по убыванию
      const dates = res.body.items.map((item: any) => new Date(item.createdAt).getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
      }
    });
  });

  describe("GET /posts - invalid pagination and sorting params", () => {
    it("should return 400 when passing invalid pageNumber", async () => {
      await request(app)
          .get(POSTS_PATH)
          .query({ pageNumber: "abc" })
          .expect(HttpStatus.BadRequest);
    });

    it("should return 400 when passing invalid pageSize", async () => {
      await request(app)
          .get(POSTS_PATH)
          .query({ pageSize: -1 })
          .expect(HttpStatus.BadRequest);
    });

    it("should return 400 when passing invalid sortBy", async () => {
      const res = await request(app)
          .get(POSTS_PATH)
          .query({ sortBy: "invalidField" })
          .expect(HttpStatus.BadRequest);
      console.log(res.body);
    });

    it("should return 400 when passing invalid sortDirection", async () => {
      await request(app)
          .get(POSTS_PATH)
          .query({ sortDirection: "upwards" })
          .expect(HttpStatus.BadRequest);
    });
  });
});
