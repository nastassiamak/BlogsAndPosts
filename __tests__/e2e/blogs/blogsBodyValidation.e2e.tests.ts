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
import { ResourceType } from "../../../src/core/types/resourceType";
import { BlogCreateInput } from "../../../src/blogs/routers/input/blogCreateInput";
import { BlogUpdateInput } from "../../../src/blogs/routers/input/blogUpdateInput";

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

  it("❌ should not create blog when incorrect body passed; POST /api/blogs", async () => {
    const correctTestBlogData: BlogCreateInput = {
      data: {
        type: ResourceType.Blogs,
        attributes: correctTestBlogAttributes,
      },
    };
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestBlogData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({
        data: {
          ...correctTestBlogData.data,
          attributes: {
            name: "    ",
            description: "      ",
            websiteUrl: "Invalid Url",
            createdAt: "12",
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errors).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({
        data: {
          ...correctTestBlogData.data,
          attributes: {
            name: "",
            description: "",
            websiteUrl: "",
            createdAt: 89,
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errors).toHaveLength(4);

    // check что никто не создался
    const blogListResponse = await request(app)
      .get(BLOGS_PATH)
      .set("Authorization", adminToken);

    expect(blogListResponse.body.data).toHaveLength(0);
  });

  it("❌ should not update blog when incorrect data passed; PUT /api/blogs/:id", async () => {
    const createdBlog = await createBlog(app, correctTestBlogAttributes);
    const createdBlogId = createdBlog.data.id;

    const correctTestBlogData: BlogUpdateInput = {
      data: {
        type: ResourceType.Blogs,
        id: createdBlogId,
        attributes: correctTestBlogAttributes,
      },
    };

    const invalidDataSet1 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", adminToken)
      .send({
        data: {
          ...correctTestBlogData.data,
          attributes: {
            name: "    ",
            description: "      ",
            websiteUrl: "Invalid Url",
            createdAt: "12",
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errors).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlogId}`)
      .set("Authorization", adminToken)
      .send({
        data: {
          ...correctTestBlogData.data,
          attributes: {
            name: "A",
            description: "      ",
            websiteUrl: "http://exp.com/",
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errors).toHaveLength(2);

    const blogResponse = await getBlogById(app, createdBlogId);

    expect(blogResponse).toEqual({
      ...createdBlog,
    });
  });
});
