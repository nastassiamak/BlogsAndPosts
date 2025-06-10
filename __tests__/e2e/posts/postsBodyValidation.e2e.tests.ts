import { setupApp } from "../../../src/setupApp";
import express from "express";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";
import request from "supertest";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { ResourceType } from "../../../src/core/types/resourceType";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import { getBlogDto } from "../../utils/blogs/getBlogDto";

describe("Posts API body validation check", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();
  const correctTestBlogAttributes: BlogAttributes = getBlogDto();

  beforeAll(async () => {
    await runDB("mongodb://localhost:27017/test");
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("should not create post when empty body passed; POST /posts", async () => {
    // Без авторизации - ожидаем 401 Unauthorized

    const response = await request(app)
      .post(POSTS_PATH)
      .send({})
      .expect(HttpStatus.Unauthorized);
    // Опционально: проверить структуру тела с ошибкой
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toBe("string");
  });

  it("should not create post when invalid body passed; POST /posts", async () => {
    // Некорректные поля и типы
    const invalidDataSet1 = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({
        title: "   ",
        shortDescription: "",
        content: 1, // неправильный тип
      })
      .expect(HttpStatus.BadRequest);

    // Проверяем количество ошибок валидации
    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({
        title: 21, // не строка
        shortDescription: "   ",
        content: "2vgg",
        blogId: 1, // возможно невалидно, лучше строка или корректный id
      })
      .expect(HttpStatus.BadRequest);

    //console.log(invalidDataSet2.body.errorsMessages);
    expect(invalidDataSet2.body.errorsMessages).toHaveLength(2);
  });

  it("should return empty posts list initially", async () => {
    const postListResponse = await request(app).get(POSTS_PATH);
    expect(postListResponse.body.items).toHaveLength(0);
  });

  // Тесты GET /posts с разными параметрами пагинации и сортировки

  it("should return 200 with no query parameters", async () => {

    const res =
        await request(app)
            .get(POSTS_PATH)
            .expect(HttpStatus.Ok);
    expect(res.body).toHaveProperty("items");
    // Для отладки можно залогировать весь ответ (по необходимости)
     console.log(res.body);
  });

  it("should return 200 with only pageNumber param", async () => {
    const res = await request(app)
      .get(POSTS_PATH)
      .query({ pageNumber: 1 })
      .expect(HttpStatus.Ok);
    expect(res.body).toHaveProperty("page", 1);
  });

  it("should return 200 with pageNumber and pageSize", async () => {
    const res = await request(app)
      .get(POSTS_PATH)
      .query({ pageNumber: 1, pageSize: 10 })
      .expect(HttpStatus.Ok);
    expect(res.body).toHaveProperty("pageSize", 10);
  });

  it("should return 200 when adding valid sortBy", async () => {
    const res = await request(app)
      .get(POSTS_PATH)
      .query({ pageNumber: 1, pageSize: 10, sortBy: "createdAt" })
      .expect(HttpStatus.Ok);
    expect(res.body).toHaveProperty("items");
  });

  it("should return 200 when adding valid sortDirection", async () => {
    const res = await request(app)
      .get(POSTS_PATH)
      .query({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "createdAt",
        sortDirection: "desc",
      })
      .expect(HttpStatus.Ok);
    //console.log(res.body);
    expect(res.body).toHaveProperty("items");
  });

  // Тесты для невалидных значений параметров

  it("should return 400 when passing invalid pageNumber", async () => {
    const res = await request(app)
      .get(POSTS_PATH)
      .query({ pageNumber: "abc" })
      .expect(HttpStatus.BadRequest);
    //console.log(res.body);
  });

  it("should return 400 when passing invalid pageSize", async () => {
    await request(app)
      .get(POSTS_PATH)
      .query({ pageSize: -1 })
      .expect(HttpStatus.BadRequest);
  });

  it("should return 400 when passing invalid sortBy", async () => {
    await request(app)
      .get(POSTS_PATH)
      .query({ sortBy: "invalidField" })
      .expect(HttpStatus.BadRequest);
  });

  it("should return 400 when passing invalid sortDirection", async () => {
    await request(app)
      .get(POSTS_PATH)
      .query({ sortDirection: "upwards" })
      .expect(HttpStatus.BadRequest);
  });
});
