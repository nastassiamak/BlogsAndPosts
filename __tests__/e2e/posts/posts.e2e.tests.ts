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

  it("should return posts list; GET /posts", async () => {
    await Promise.all([createPost(app), createPost(app)]);

    const postListResponse = await request(app)
      .get(POSTS_PATH)
      //.set("Authorization", adminToken)
      .expect(HttpStatus.Ok);

    console.log(postListResponse.body);
    expect(Array.isArray(postListResponse.body.items)).toBe(true);
    expect(postListResponse.body.items.length).toBeGreaterThanOrEqual(2);
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

    await updatePost(app, createdBlogId, createdPostId, postUpdateData);

    const postResponse = await getPostById(app, createdPostId);

    expect(postResponse).toEqual({
      id: createdPostId,
      title: postUpdateData.title,
      shortDescription: postUpdateData.shortDescription,
      content: postUpdateData.content,
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
