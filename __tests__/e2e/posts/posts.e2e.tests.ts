import express from "express";
import { setupApp } from "../../../src/setupApp";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { before } from "node:test";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";
import { createPost } from "../../utils/posts/createPost";
import request from "supertest";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { getPostById } from "../../utils/posts/getPostById";

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

  it("should create post; POST /api/posts", async () => {
    await createPost(app);
  });

  it("should return posts list; GET /api/posts", async () => {
    await createPost(app);

    const postListResponse = await request(app)
      .get(POSTS_PATH)
      .set("Authorization", adminToken)
      .expect(HttpStatus.Ok);

    console.log(postListResponse.body.data);
    expect(postListResponse.body.data).toBeInstanceOf(Array);
    expect(postListResponse.body.data).toHaveLength(2);
  });

  it("should return posts by id; GET /api/posts/:id", async () => {
    const createdPost = await createPost(app);
    const createdPostId = createdPost.data.id;

    const getPost = await getPostById(app, createdPostId);

    expect(getPost.data.id).toBe(createdPostId);
    expect(getPost.data.attributes).toEqual(createdPost.data.attributes);
  });
});
