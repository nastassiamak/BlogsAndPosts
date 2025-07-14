// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";
import { setupApp } from "../../../src/setupApp";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { getBlogDto } from "../../utils/blogs/getBlogDto";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";
import { createBlog } from "../../utils/blogs/createBlog";
import { getBlogById } from "../../utils/blogs/getBlogById";

describe("Blog API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctTestBlogAttributes: BlogAttributes = getBlogDto();
  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    await runDB("mongodb://localhost:27017/test");
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it("❌ should not create blog when incorrect body passed; POST /blogs", async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogAttributes)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({
        name: "    ",
        description: "      ",
        websiteUrl: "Invalid Url",
        createdAt: "12",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({
        name: "",
        description: "",
        websiteUrl: "",
        createdAt: 89,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(4);

    // check что никто не создался
    const blogListResponse = await request(app).get(BLOGS_PATH);
    //.set("Authorization", adminToken);

    expect(blogListResponse.body.items).toHaveLength(0);
  });

  it("❌ should not update blog when incorrect data passed; PUT /blogs/:id", async () => {
    const createdBlog = await createBlog(app, correctTestBlogAttributes);
    const createdBlogId = createdBlog.id;

    const invalidDataSet1 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", adminToken)
      .send({
        name: "    ",
        description: "      ",
        websiteUrl: "Invalid Url",
        createdAt: "12",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", adminToken)
      .send({
        name: "A",
        description: "      ",
        websiteUrl: "http://exp.com/",
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(2);

    const blogResponse = await getBlogById(app, createdBlogId);

    expect(blogResponse).toEqual({
      ...createdBlog,
    });
  });

  // Добавляем блок для пагинации и сортировки
  describe("GET /blogs - pagination and sorting", () => {
    it("should return 200 and paginated blogs list with default params", async () => {
      const res = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

      console.log("Response body:", res.body);
      expect(res.body).toHaveProperty("items"); // Проверяем, что в объекте есть поле items
      expect(Array.isArray(res.body.items)).toBe(true); // Проверяем, что items — массив

      expect(res.body).toHaveProperty("page", 1);
      expect(res.body).toHaveProperty("pageSize");
      expect(res.body).toHaveProperty("totalCount");
      expect(res.body).toHaveProperty("pagesCount");
    });

    it("should paginate blogs correctly - GET /blogs?pageNumber=2&pageSize=2", async () => {
      const res = await request(app)
        .get(BLOGS_PATH)
        .query({ pageNumber: 2, pageSize: 2 })
        .expect(HttpStatus.Ok);

      expect(res.body).toHaveProperty("page", 2);
      expect(res.body).toHaveProperty("pageSize", 2);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBeLessThanOrEqual(2);
    });

    it("should sort blogs ascending by name", async () => {
      const res = await request(app)
        .get(BLOGS_PATH)
        .query({ sortBy: "name", sortDirection: "asc" })
        .expect(HttpStatus.Ok);

      expect(res.body).toHaveProperty("items");
      const names = res.body.items.map((item: any) => item.name);
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sorted);
    });

    it("should sort blogs descending by name", async () => {
      const res = await request(app)
        .get(BLOGS_PATH)
        .query({ sortBy: "name", sortDirection: "desc" })
        .expect(HttpStatus.Ok);

      expect(res.body).toHaveProperty("items");
      const names = res.body.items.map((item: any) => item.name);
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(sorted);
    });

    it("should return 400 for invalid pagination params", async () => {
      await request(app)
        .get(BLOGS_PATH)
        .query({ pageNumber: "abc" })
        .expect(HttpStatus.BadRequest);

      await request(app)
        .get(BLOGS_PATH)
        .query({ pageSize: -1 })
        .expect(HttpStatus.BadRequest);
    });

    it("should return 400 for invalid sorting params", async () => {
      await request(app)
        .get(BLOGS_PATH)
        .query({ sortBy: "invalidField" })
        .expect(HttpStatus.BadRequest);

      await request(app)
        .get(BLOGS_PATH)
        .query({ sortDirection: "upwards" })
        .expect(HttpStatus.BadRequest);
    });
  });
});
